package main

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "io"
    "log"
    "math/rand"
    "net/http"
    "strings"
    "time"
    "unicode/utf8"

    "golang.org/x/text/cases"
    "golang.org/x/text/language"
)

type CustomTime time.Time

func (ct *CustomTime) UnmarshalJSON(b []byte) error {
    s := string(b)
    s = s[1 : len(s)-1]

    t, err := time.Parse("2006-01-02T15:04:05.000", s)
    if err == nil {
        *ct = CustomTime(t.UTC())
        return nil
    }
    t, err = time.Parse("2006-01-02T15:04:05", s)
    if err == nil {
        *ct = CustomTime(t.UTC())
        return nil
    }
    t, err = time.Parse(time.RFC3339Nano, s)
    if err == nil {
        *ct = CustomTime(t.UTC())
        return nil
    }
    return errors.New("invalid time format: " + s)
}

func (ct CustomTime) MarshalJSON() ([]byte, error) {
    t := time.Time(ct)
    return []byte(t.Format(`"2006-01-02T15:04:05Z07:00"`)), nil
}

func (ct CustomTime) ToTime() time.Time {
    return time.Time(ct)
}

func cleanUTF8(input string) string {
    if utf8.ValidString(input) {
        return input
    }
    return strings.ToValidUTF8(input, "")
}

type CNAInfo struct {
    Vendor string `json:"vendor,omitempty"`
}

type NVDResponse struct {
    ResultsPerPage  int `json:"resultsPerPage"`
    StartIndex      int `json:"startIndex"`
    TotalResults    int `json:"totalResults"`
    Vulnerabilities []struct {
        CVE struct {
            ID               string     `json:"id"`
            SourceIdentifier string     `json:"sourceIdentifier"`
            Published        CustomTime `json:"published"`
            LastModified     CustomTime `json:"lastModified"`
            VulnStatus       string     `json:"vulnStatus"`
            Descriptions     []struct {
                Lang  string `json:"lang"`
                Value string `json:"value"`
            } `json:"descriptions"`
            Metrics struct {
                CvssMetricV3 []struct {
                    CvssData struct {
                        BaseScore    float64 `json:"baseScore"`
                        BaseSeverity string  `json:"baseSeverity"`
                    } `json:"cvssData"`
                } `json:"cvssMetricV3"`
                CvssMetricV2 []struct {
                    CvssData struct {
                        BaseScore    float64 `json:"baseScore"`
                        BaseSeverity string  `json:"baseSeverity"`
                    } `json:"cvssData"`
                } `json:"cvssMetricV2"`
            } `json:"metrics"`
            References []struct {
                URL string `json:"url"`
            } `json:"references"`
            CNA CNAInfo `json:"cna"`
        } `json:"cve"`
    } `json:"vulnerabilities"`
}

type NVDFetcher struct {
    client *http.Client
    repo   *VulnerabilityRepository
    apiKey string
}

func NewNVDFetcher(repo *VulnerabilityRepository, apiKey string) *NVDFetcher {
    return &NVDFetcher{
        client: &http.Client{Timeout: 30 * time.Second},
        repo:   repo,
        apiKey: apiKey,
    }
}

func (f *NVDFetcher) FetchLatest(days int) error {
    now := time.Now()
    start := now.AddDate(0, 0, -days)
    url := fmt.Sprintf(
        "https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=%s&pubEndDate=%s",
        start.Format("2006-01-02T15:04:05Z"),
        now.Format("2006-01-02T15:04:05Z"),
    )
    log.Printf("Fetching latest CVEs from NVD: %s", url)
    return f.fetchAllPages(url)
}

func (f *NVDFetcher) fetchAllPages(baseURL string) error {
    startIndex := 0
    totalResults := -1
    savedCount := 0

    for totalResults == -1 || startIndex < totalResults {
        url := fmt.Sprintf("%s&startIndex=%d", baseURL, startIndex)

        req, err := http.NewRequest("GET", url, nil)
        if err != nil {
            return fmt.Errorf("failed to create request: %v", err)
        }
        req.Header.Set("apiKey", f.apiKey)

        resp, err := f.client.Do(req)
        if err != nil {
            return fmt.Errorf("failed to fetch: %v", err)
        }
        defer resp.Body.Close()

        if resp.StatusCode != http.StatusOK {
            body, _ := io.ReadAll(resp.Body)
            return fmt.Errorf("HTTP error %d: %s", resp.StatusCode, string(body))
        }

        var data NVDResponse
        if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
            return fmt.Errorf("failed to decode JSON: %v", err)
        }

        if totalResults == -1 {
            totalResults = data.TotalResults
            log.Printf("Total vulnerabilities to fetch: %d", totalResults)
        }

        for _, item := range data.Vulnerabilities {
            vuln := f.mapToVulnerability(item)
            if err := f.saveOrUpdate(vuln); err != nil {
                log.Printf("Failed to save %s: %v", vuln.CVE, err)
            } else {
                savedCount++
            }
        }

        startIndex += data.ResultsPerPage
        log.Printf("Processed %d of %d...", startIndex, totalResults)
    }

    log.Printf("✓ Successfully fetched and saved %d new/updated vulnerabilities", savedCount)
    return nil
}

func randomFloatInRange(min, max float64) float64 {
    return min + rand.Float64()*(max-min)
}

func calculateSeverity(cvss float64) string {
    switch {
    case cvss == 0:
        return "Unknown"
    case cvss >= 0.1 && cvss <= 3.9:
        return "Low"
    case cvss >= 4.0 && cvss <= 6.9:
        return "Medium"
    case cvss >= 7.0 && cvss <= 8.9:
        return "High"
    case cvss >= 9.0:
        return "Critical"
    default:
        return "Unknown"
    }
}

var titleCaser = cases.Title(language.English)

func assignDefaultCVSSByDescription(cvss float64, description string) float64 {
    if cvss != 0 {
        return cvss
    }
    rand.Seed(time.Now().UnixNano())
    desc := strings.ToLower(description)
    if strings.Contains(desc, "critical") {
        return randomFloatInRange(9.0, 10.0)
    }
    if strings.Contains(desc, "high") {
        return randomFloatInRange(7.0, 8.9)
    }
    if strings.Contains(desc, "medium") {
        return randomFloatInRange(4.0, 6.9)
    }
    if strings.Contains(desc, "low") {
        return randomFloatInRange(0.1, 3.9)
    }
    return randomFloatInRange(4.0, 6.9) // default medium if no clues
}

func (f *NVDFetcher) mapToVulnerability(item struct {
    CVE struct {
        ID             string     `json:"id"`
        SourceIdentifier string    `json:"sourceIdentifier"`
        Published      CustomTime `json:"published"`
        LastModified   CustomTime `json:"lastModified"`
        VulnStatus     string     `json:"vulnStatus"`
        Descriptions   []struct {
            Lang  string `json:"lang"`
            Value string `json:"value"`
        } `json:"descriptions"`
        Metrics struct {
            CvssMetricV3 []struct {
                CvssData struct {
                    BaseScore    float64 `json:"baseScore"`
                    BaseSeverity string  `json:"baseSeverity"`
                } `json:"cvssData"`
            } `json:"cvssMetricV3"`
            CvssMetricV2 []struct {
                CvssData struct {
                    BaseScore    float64 `json:"baseScore"`
                    BaseSeverity string  `json:"baseSeverity"`
                } `json:"cvssData"`
            } `json:"cvssMetricV2"`
        } `json:"metrics"`
        References []struct {
            URL string `json:"url"`
        } `json:"references"`
        CNA CNAInfo `json:"cna"`
    } `json:"cve"`
}) *Vulnerability {
    title := ""
    for _, desc := range item.CVE.Descriptions {
        if desc.Lang == "en" {
            title = cleanUTF8(desc.Value)
            if len(title) > 100 {
                title = title[:97] + "..."
            }
            break
        }
    }

    var cvss float64
    if len(item.CVE.Metrics.CvssMetricV3) > 0 {
        cvss = item.CVE.Metrics.CvssMetricV3[0].CvssData.BaseScore
    } else if len(item.CVE.Metrics.CvssMetricV2) > 0 {
        cvss = item.CVE.Metrics.CvssMetricV2[0].CvssData.BaseScore
    } else {
        cvss = 0
    }

    cvss = assignDefaultCVSSByDescription(cvss, title)
    severity := calculateSeverity(cvss)

    tags := []string{}
    if severity != "" && severity != "Unknown" {
        tags = append(tags, severity)
    }
    tags = append(tags, "NVD")

    var refs []string
    for _, ref := range item.CVE.References {
        refs = append(refs, cleanUTF8(ref.URL))
    }

    return &Vulnerability{
        CVE:         cleanUTF8(item.CVE.ID),
        Title:       title,
        Description: title,
        Severity:    severity,
        CVSS:        cvss,
        Vendor:      cleanUTF8(f.extractVendor(title)),
        Product:     cleanUTF8(f.extractProduct(title)),
        Published:   item.CVE.Published.ToTime(),
        Updated:     item.CVE.LastModified.ToTime(),
        References:  refs,
        Tags:        tags,
        Status:      cleanUTF8(item.CVE.VulnStatus),
    }
}

func (f *NVDFetcher) extractVendor(text string) string {
    textLower := strings.ToLower(text)
    vendors := []string{
    "1e limited",
    "42gears mobility systems pvt ltd",
    "9front", "arcinfo", "Linux",
    "acronis international gmbh",
    "adobe systems incorporated",
    "advanced micro devices inc.",
    "airbus",
    "algosec",
    "alias robotics s.l.",
    "ami",
    "apache software foundation",
    "appcheck ltd.",
    "apple inc.",
    "arista networks, inc.",
    "arm limited",
    "artica pfms",
    "asea brown boveri ltd. abb",
    "asr microelectronics co., ltd.",
    "asustor, inc.",
    "atlassian",
    "austin hackers anonymous",
    "autodesk",
    "automotive security research group asrg",
    "avaya, inc.",
    "axis communications ab",
    "axxonsoft",
    "b. braun se",
    "baicells technologies co., ltd.",
    "baidu, inc.",
    "baxter",
    "becton, dickinson and company bd",
    "beyondtrust",
    "bitdefender",
    "black lantern security",
    "blackberry",
    "brocade communications systems, llc",
    "ca technologies - a broadcom company",
    "canon inc.",
    "canonemea",
    "canonical ltd.",
    "carrier global corporation",
    "cato",
    "centreon",
    "cert vde",
    "cert.pl",
    "certcc",
    "check point software technologies ltd.",
    "checkmarx",
    "checkmk gmbh",
    "chrome",
    "ciena",
    "cirosec gmbh",
    "cisco systems, inc.",
    "citrix systems, inc.",
    "cloudflare, inc.",
    "computer emergency response team of the republic of turkey",
    "concretecms",
    "connectwise",
    "cpansec",
    "crafter cms",
    "cybellum technologies ltd",
    "cyber security works pvt. ltd.",
    "cyberdanube",
    "cybersecurity and infrastructure security agency cisa u.s. civilian government",
    "dahua technologies",
    "dassault systmes",
    "delinea",
    "dell",
    "deltaww",
    "devolutions inc.",
    "dfinity foundation",
    "directcyber",
    "docker inc.",
    "document foundation, the",
    "dotcms llc",
    "dragos, inc.",
    "drupal.org",
    "duo security, inc.",
    "dutch institute for vulnerability disclosure",
    "eaton",
    "eclipse foundation",
    "elan microelectronics",
    "elastic",
    "enisa",
    "environmental systems research institute, inc.",
    "ericsson",
    "eset",
    "exodus intelligence",
    "f5 networks",
    "facebook, inc.",
    "fedora project",
    "fidelis cybersecurity, inc.",
    "flexera software llc",
    "floragunn gmbh",
    "fluid attacks",
    "forcepoint",
    "forescout",
    "forgerock, inc.",
    "fortinet, inc.",
    "fortra",
    "freebsd",
    "f-secure",
    "gallagher group ltd.",
    "general electric gas power",
    "genetec inc.",
    "github, inc.",
    "gitlab inc.",
    "glyph cog, llc",
    "go project",
    "google devices",
    "google inc.",
    "government technology agency of singapore cyber security group govtech csg",
    "grafana labs",
    "green rocket security inc.",
    "gridware",
    "hackerone",
    "halborn",
    "hallo welt! gmbh",
    "hangzhou hikvision digital technology co., ltd.",
    "hanwha vision co., ltd.",
    "harborist",
    "hashicorp inc.",
    "hcl software",
    "herodevs",
    "hewlett packard enterprise hpe",
    "hiddenlayer",
    "hillstone networks, inc.",
    "hitachi energy",
    "hitachi vantara",
    "hitachi, ltd.",
    "honeywell international inc.",
    "honor device co., ltd.",
    "hp inc.",
    "huawei technologies",
    "huntr.dev",
    "hypr corp",
    "ibm corporation",
    "ics-cert",
    "idemia",
    "illumio",
    "indian computer emergency response team cert-in",
    "intel corporation",
    "internet systems consortium isc",
    "israel national cyber directorate",
    "ivanti",
    "jenkins project",
    "jetbrains s.r.o.",
    "jfrog",
    "johnson controls",
    "joomla! project",
    "josh bressers",
    "jpcertcc",
    "juniper networks, inc.",
    "kaspersky labs",
    "knime ag",
    "korelogic",
    "krcertcc",
    "kubernetes",
    "lenovo group ltd.",
    "lg electronics",
    "liferay inc.",
    "line corporation",
    "logitech",
    "manageengine",
    "mandiant inc.",
    "mattermost, inc.",
    "mautic",
    "mcafee defunct",
    "mediatek, inc.",
    "medtronic",
    "mend",
    "m-files corporation",
    "micro focus international defunct",
    "microchip technology",
    "microsoft corporation",
    "mim software inc.",
    "mirantis",
    "mitsubishi electric corporation",
    "mongodb, inc.",
    "moxa inc.",
    "mozilla corporation",
    "n-able",
    "national cyber security centre netherlands ncsc-nl",
    "national cyber security centre sk-cert",
    "national instruments",
    "naver corporation",
    "nec corporation",
    "netapp, inc.",
    "netflix, inc.",
    "netmotion software",
    "netskope",
    "network optix",
    "nlnet labs",
    "node.js",
    "nortonlifelock inc.",
    "nozomi networks inc.",
    "nvidia corporation",
    "objective development software gmbh",
    "octopus deploy",
    "odoo",
    "okta",
    "omnissa",
    "onekey gmbh",
    "open design alliance",
    "openanolis",
    "opencloudos community",
    "openeuler",
    "openharmony",
    "openssl software foundation",
    "opentext",
    "openvpn inc.",
    "open-xchange",
    "opera",
    "oppo mobile telecommunication corp., ltd.",
    "oracle",
    "otrs ag",
    "palantir technologies",
    "palo alto networks, inc.",
    "panasonic holdings corporation",
    "papercut",
    "patchstack",
    "payara",
    "pegasystems inc.",
    "pentraze",
    "perforce",
    "phoenix technologies, inc.",
    "php group",
    "ping identity corporation",
    "pivotal software, inc.",
    "postgresql",
    "profelis it consultancy",
    "progress software corporation",
    "proofpoint inc.",
    "pure storage, inc.",
    "python software foundation",
    "qnap systems, inc.",
    "qualcomm, inc.",
    "qualys, inc.",
    "rami.io",
    "rapid7, inc.",
    "red hat, inc.",
    "robert bosch gmbh",
    "rockwell automation",
    "rti",
    "sailpoint technologies",
    "samsung mobile",
    "samsung tv appliance",
    "sap se",
    "sba-research",
    "schneider electric se",
    "schweitzer engineering laboratories, inc.",
    "sec consult vulnerability lab",
    "secomea as",
    "securifera, inc.",
    "security risk advisors",
    "servicenow",
    "shop beat solutions pty ltd",
    "sick ag",
    "siemens ag",
    "sierra wireless inc.",
    "silicon labs",
    "silver peak systems, inc.",
    "snow software",
    "snyk",
    "softiron",
    "solarwinds",
    "sonatype",
    "sonicwall, inc.",
    "sophos limited",
    "spanish national cybersecurity institute, s.a. incibe",
    "splunk inc.",
    "star labs sg pte. ltd.",
    "suse",
    "swift project",
    "switzerland government common vulnerability program",
    "symantec corporation",
    "synaptics, inc.",
    "synology inc.",
    "synopsys",
    "talos",
    "tcpdump group",
    "teamviewer germany gmbh",
    "tecnomobile",
    "temporal technologies inc.",
    "tenable network security, inc.",
    "teradici corporation",
    "thales group",
    "the missing link australia tml",
    "the openbmc project",
    "the opennms group",
    "tianocore.org",
    "tibco software inc.",
    "tigera, inc.",
    "tplink",
    "trellix",
    "trend micro, inc.",
    "twcertcc",
    "unisoc",
    "upkeeper",
    "vaadin ltd.",
    "vdoo connected trust ltd.",
    "vivo mobile communication co., ltd.",
    "vmware",
    "vuldb",
    "vulncheck",
    "vulsec labs",
    "watchguard technologies, inc.",
    "western digital",
    "wikimedia-foundation",
    "wiz",
    "wolfssl inc.",
    "wordfence",
    "wpscan",
    "wso2 llc",
    "xerox",
    "xiaomi technology co., ltd.",
    "yandex n.v.",
    "yokogawagroup",
    "yugabyte, inc.",
    "zabbix",
    "zephyr project",
    "zero day initiative",
    "zoom video communications, inc.",
    "zowe",
    "zscaler, inc.",
    "zte corporation",
    "zuso advanced research team zuso art",
    "zyxel corporation"}

    for _, v := range vendors {
        if strings.Contains(textLower, v) {
            return titleCaser.String(v)
        }
    }
    return "Unknown"
}

func (f *NVDFetcher) extractProduct(text string) string {
    text = strings.ToLower(text)
    products := []string{"microsoft", "google", "linux", "oracle", "debian", "apple", "ibm", "adobe", "cisco", "redhat", "fedoraproject", "canonical", "mozilla", "opensuse", "apache", "netapp", "hp", "qualcomm", "huawei", "siemens", "intel", "jenkins", "sap", "sun", "tenda", "dlink", "dell", "netgear", "samsung", "gitlab", "suse", "gnu", "juniper", "totolink", "phpgurukul", "fortinet", "vmware", "f5", "foxitsoftware", "schneider-electric", "php", "nvidia", "wireshark", "imagemagick", "novell", "oretnom23", "broadcom", "moodle", "mcafee", "symantec"}
    for _, p := range products {
        if strings.Contains(text, p) {
            return titleCaser.String(p)
        }
    }
    return "Various"
}

func (f *NVDFetcher) saveOrUpdate(vuln *Vulnerability) error {
    existing, err := f.repo.FindByCVE(context.Background(), vuln.CVE)
    if err == nil && existing != nil {
        // Always update vendor and product if they differ
        needUpdate := false
        if existing.Vendor != vuln.Vendor || existing.Product != vuln.Product {
            needUpdate = true
            // Update existing object for vendor and product
            existing.Vendor = vuln.Vendor
            existing.Product = vuln.Product
        }

        // Update if timestamp newer
        if existing.Updated.Before(vuln.Updated) {
            return f.repo.Update(context.Background(), vuln)
        }

        // Or update if CVSS or Severity changed
        if existing.CVSS != vuln.CVSS || existing.Severity != vuln.Severity {
            return f.repo.Update(context.Background(), vuln)
        }

        // If only vendor/product changed, update existing record
        if needUpdate {
            return f.repo.Update(context.Background(), existing)
        }

        return nil
    }
    return f.repo.Create(context.Background(), vuln)
}

