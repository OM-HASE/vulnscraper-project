# VulnScraper: OEM Vulnerability Detection System

A comprehensive MERN stack application with Go-based web scrapers for real-time OEM vulnerability detection and automated reporting.

## 🚀 Features

- **Real-time Vulnerability Scraping**: Go-based scrapers for Cisco, Juniper, Honeywell, and other OEM security advisories
- **Machine Learning Classification**: Automated severity assessment and risk scoring
- **Interactive Dashboard**: React-based dashboard with real-time updates and data visualization
- **Real-time Alerts**: Socket.IO and Twilio integration for immediate notifications
- **RESTful API**: Comprehensive API for external integrations
- **Containerized Deployment**: Docker support for easy deployment and scaling

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Go Scrapers   │───▶│   MongoDB       │◀───│  Express API    │
│   (Data Source) │    │   (Database)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │  React Dashboard│
                                               │   (Frontend)    │
                                               └─────────────────┘
```

## 🛠️ Tech Stack

- **Scraper**: Go (Golang) with Colly framework
- **Backend**: Node.js + Express.js
- **Frontend**: React.js with Material-UI
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Alerts**: Twilio SMS, Email notifications
- **Charts**: Chart.js / Recharts
- **Deployment**: Docker + Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Go (v1.21 or higher)  
- MongoDB (v6.0 or higher)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vulnscraper.git
   cd vulnscraper
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - MongoDB: mongodb://localhost:27017

### Manual Setup

#### 1. Database Setup
```bash
# Start MongoDB
mongod --dbpath /path/to/your/db

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### 4. Scraper Setup
```bash
cd scraper
go mod download
go run main.go
```

## 📊 API Endpoints

### Vulnerabilities
- `GET /api/vulnerabilities` - List all vulnerabilities
- `GET /api/vulnerabilities/:id` - Get vulnerability by ID
- `POST /api/vulnerabilities` - Create new vulnerability
- `PUT /api/vulnerabilities/:id` - Update vulnerability
- `DELETE /api/vulnerabilities/:id` - Delete vulnerability

### Statistics
- `GET /api/vulnerabilities/stats` - Get vulnerability statistics
- `GET /api/vulnerabilities/trends` - Get trend data

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/vulnscraper

# API Server
PORT=5000
JWT_SECRET=your-jwt-secret

# Alerts
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

### Scraper Configuration

Configure scraping intervals and targets in `scraper/config/config.go`:

```go
type Config struct {
    ScrapeInterval  time.Duration
    MaxConcurrent   int
    RequestTimeout  time.Duration
    OEMTargets     []OEMTarget
}
```

## 📈 Monitoring & Alerts

### Real-time Alerts
- **Socket.IO**: Real-time dashboard updates
- **Twilio SMS**: Critical vulnerability alerts
- **Email**: Daily/weekly reports

### Dashboard Features
- Severity distribution charts
- Vulnerability trends
- Real-time threat feed
- Filterable vulnerability lists
- Export capabilities

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Go Tests
```bash
cd scraper
go test ./...
```

## 🚢 Deployment

### Production Deployment

1. **Configure production environment**
   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   # Edit production-specific settings
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Team

- **Om Vikas Hase** - Backend & Go Development
- **Harshal Kailas Dhotre** - Frontend & Socket.IO
- **Amit Randhir Holkar** - Database & Charts
- **Mayur Vilas Ingale** - Frontend & Twilio Integration

## 📞 Support

For support and questions:
- Email: support@vulnscraper.com
- Issues: [GitHub Issues](https://github.com/your-username/vulnscraper/issues)
- Documentation: [Project Wiki](https://github.com/your-username/vulnscraper/wiki)

---

**⚠️ Security Notice**: This tool is for legitimate security monitoring purposes only. Always ensure compliance with applicable laws and website terms of service when scraping external sites.