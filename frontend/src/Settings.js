import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { cronConfig } from "./config/cron";

export default function Settings() {
  const [cron, setCron] = useState(null);

  // Alert Configuration states
  const [criticalOnly, setCriticalOnly] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // For phone and OTP management
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpType, setOtpType] = useState(null); // "sms"

  useEffect(() => {
    const fetchCron = async () => {
      const response = await axios.get("/api/cron");
      setCron(response.data[0]);
      // Initialize toggles - adjust if loading actual user settings
      setCriticalOnly(true);
      setEmailNotifications(false);
      setSmsNotifications(false);
    };
    fetchCron();
  }, []);

  const updateCronSchedule = async (e) => {
    const response = await axios.put("/api/cron", { cron: e.target.value });
    setCron(response.data);
  };

  // Handlers for toggles and OTP flow

  const handleCriticalOnlyChange = (e) => {
    const checked = e.target.checked;
    setCriticalOnly(checked);
    if (!checked) {
      setEmailNotifications(false);
      setSmsNotifications(false);
    }
  };

  const handleEmailToggle = (e) => {
    const checked = e.target.checked;
    setEmailNotifications(checked);
  };

  const handleSmsToggle = (e) => {
    const checked = e.target.checked;
    if (checked && !smsNotifications) {
      // First time enable - start OTP flow
      setOtpType("sms");
      setPhoneNumber("");
      setOtp("");
      setOtpSent(false);
    } else {
      setSmsNotifications(checked);
    }
  };

  const sendOtp = async () => {
    try {
      if (otpType === "sms") {
        await axios.post("/api/send-sms-otp", { phone: phoneNumber });
      }
      setOtpSent(true);
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    setVerifyingOtp(true);
    try {
      let response;
      if (otpType === "sms") {
        response = await axios.post("/api/verify-sms-otp", { phone: phoneNumber, otp });
      }
      if (response.data.verified) {
        if (otpType === "sms") setSmsNotifications(true);
      } else {
        alert("OTP verification failed. Please try again.");
      }
    } catch {
      alert("Verification error.");
    }
    setVerifyingOtp(false);
  };

  return (
    <>
      <style>{`
        /* Your existing style block here (unchanged) */
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #121418;
          color: #cbd3da;
          transition: background-color 0.4s ease, color 0.4s ease;
        }
        body.light-theme, body.light-theme html {
          background: #f5f7fa;
          color: #333333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #282c34;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: background-color 0.4s ease, color 0.4s ease;
        }
        body.light-theme .header {
          background: #ffffff;
          color: #282c34;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .page-title {
          font-size: 1.8rem;
          font-weight: 600;
        }
        .current-time {
          font-weight: 500;
          font-size: 0.9rem;
          margin-right: 1.5rem;
          color: #9da5b4;
          transition: color 0.4s ease;
        }
        body.light-theme .current-time {
          color: #666666;
        }
        .user-profile {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
          transition: color 0.4s ease;
        }
        body.light-theme .user-profile {
          color: #444444;
        }
        .user-profile i {
          font-size: 1.5rem;
          margin-right: 0.5rem;
          color: #61dafb;
          transition: color 0.4s ease;
        }
        body.light-theme .user-profile i {
          color: #007acc;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .card {
          background: #1e222a;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.4s ease;
        }
        body.light-theme .card {
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .card__header {
          border-bottom: 2px solid #61dafb;
          padding: 1rem 1.5rem;
          background-color: #22262f;
          border-radius: 10px 10px 0 0;
          transition: background-color 0.4s ease;
        }
        body.light-theme .card__header {
          background-color: #e4f0fb;
        }
        .card__header h3 {
          margin: 0;
          font-weight: 700;
          color: #61dafb;
          transition: color 0.4s ease;
        }
        body.light-theme .card__header h3 {
          color: #282c34;
        }
        .card__body {
          padding: 1rem 1.5rem 1.5rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #a0a0a0;
          transition: color 0.4s ease;
        }
        body.light-theme .form-label {
          color: #444444;
        }
        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #555;
          border-radius: 26px;
          transition: 0.4s;
        }
        input:checked + .slider {
          background-color: #61dafb;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }
        input:checked + .slider:before {
          transform: translateX(22px);
        }
        .form-control {
          width: 100%;
          padding: 8px 12px;
          border: 1.5px solid #555;
          border-radius: 6px;
          font-size: 1rem;
          background-color: #2a2e39;
          color: #cbd3da;
          transition: border-color 0.3s ease, background-color 0.4s ease, color 0.4s ease;
        }
        .form-control:focus {
          outline: none;
          border-color: #61dafb;
          box-shadow: 0 0 5px rgba(97, 218, 251, 0.5);
          background-color: #2a2e39;
          color: #f0f0f0;
        }
        body.light-theme .form-control {
          border: 1.5px solid #ddd;
          background-color: #fff;
          color: #282c34;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-weight: 600;
          font-size: 0.9rem;
          border-bottom: 1px solid #444;
          transition: border-color 0.4s ease;
          color: #ddd;
        }
        body.light-theme .status-item {
          color: #444;
          border-bottom: 1px solid #eee;
        }
        .status-item:last-child {
          border-bottom: none;
        }
        .status {
          padding: 0.2rem 0.7rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          min-width: 70px;
          text-align: center;
          background-color: #4caf50;
          transition: background-color 0.4s ease;
        }
        body.light-theme .status {
          background-color: #388e3c;
          color: #fff;
        }
        .btn {
          padding: 6px 14px;
          font-size: 1rem;
          margin-top: 0.5rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          background-color: #61dafb;
          color: #222;
          transition: background-color 0.3s ease;
        }
        .btn:disabled {
          background-color: #a0cbe8;
          cursor: not-allowed;
        }
        .btn:not(:disabled):hover {
          background-color: #21a1f1;
          color: #fff;
        }
      `}</style>

      <div>
        <div className="settings-grid">
          {/* Alert Configuration card */}
          <div className="card">
            <div className="card__header">
              <h3>Alert Configuration</h3>
            </div>
            <div className="card__body">
              {/* Critical Severity Only (first) */}
              <div className="form-group">
                <label className="form-label">Critical Severity Only</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={criticalOnly}
                    onChange={handleCriticalOnlyChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Email Notifications - no email input or OTP */}
              <div className="form-group">
                <label className="form-label">Email Notifications</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={handleEmailToggle}
                    disabled={!criticalOnly}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* SMS Notifications with phone + OTP flow */}
              <div className="form-group">
                <label className="form-label">SMS Notifications</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={handleSmsToggle}
                    disabled={!criticalOnly}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* OTP input and verification UI for SMS */}
              {otpType === "sms" && !smsNotifications && (
                <>
                  <div className="form-group">
                    <label className="form-label">Enter Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <button className="btn" onClick={sendOtp} disabled={!phoneNumber}>
                    Send OTP
                  </button>
                  {otpSent && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Enter OTP</label>
                        <input
                          type="text"
                          className="form-control"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn"
                        onClick={verifyOtp}
                        disabled={!otp || verifyingOtp}
                      >
                        Verify OTP
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Scraper Settings card */}
          <div className="card">
            <div className="card__header">
              <h3>Scraper Settings</h3>
            </div>
            <div className="card__body">
              <div className="form-group">
                <label className="form-label">Scrape Frequency</label>
                <select
                  className="form-control"
                  onChange={updateCronSchedule}
                  value={cron ? cron.cron : "0 0 * * *"}
                >
                  {cronConfig.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Add other scraper settings here if needed */}
            </div>
          </div>

          {/* System Status card */}
          <div className="card">
            <div className="card__header">
              <h3>System Status</h3>
            </div>
            <div className="card__body">
              <div className="status-item">
                <span>Database Connection</span>
                <span className="status status--success">Online</span>
              </div>
              <div className="status-item">
                <span>Scraper Service</span>
                <span className="status status--success">
                  {cron ? cron.status.charAt(0).toUpperCase() + cron.status.slice(1) : "Unknown"}
                </span>
              </div>
              <div className="status-item">
                <span>API Service</span>
                <span className="status status--success">Healthy</span>
              </div>
              <div className="status-item">
                <span>Last Scan</span>
                <span>{cron ? moment(cron.completedAt).fromNow() : "Unknown"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
