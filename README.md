# Job Application Tracker

A full-stack web application for tracking job applications with user authentication, CRUD operations, search functionality, and responsive design.

## Live Demo

- **Frontend:** (https://job-tracker-sigma-khaki.vercel.app/)
- **Backend API:** (https://job-tracker-0r26.onrender.com/)

## Features

- **User Authentication:** Secure registration and login system
- **Dashboard:** Overview with application statistics and status tracking
- **CRUD Operations:** Create, read, update, and delete job applications
- **Search & Filter:** Find applications by company, role, or location
- **Status Management:** Track application progress (Applied, Interview, Offer, etc.)
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **RESTful API:** Clean, well-documented backend API

## Tech Stack

### Frontend
- React.js
- Axios for API calls
- CSS3 with modern styling
- Responsive design

### Backend
- Django & Django REST Framework
- PostgreSQL database
- User authentication system
- CORS handling for cross-origin requests

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL (Render)

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- Git

### Backend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker/job_tracker_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd job_tracker_frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://127.0.0.1:8000/api" > .env.local

# Start development server
npm start
```

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/register/` - Register new user
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/user/` - Get current user

### Application Endpoints
- `GET /api/applications/` - List applications (with search/filter)
- `POST /api/applications/` - Create new application
- `GET /api/applications/{id}/` - Get specific application
- `PUT /api/applications/{id}/` - Update application
- `DELETE /api/applications/{id}/` - Delete application
- `GET /api/applications/stats/` - Get application statistics

### Query Parameters
- `search` - Search by company, role, or location
- `status` - Filter by application status

## Design Decisions

- **Clean UI:** Focused on usability with a modern card-based design
- **Mobile-First:** Responsive design ensures great experience on all devices
- **User-Centric:** Each user sees only their own applications
- **Performance:** Efficient API queries with search and filtering
- **Security:** Proper authentication and CORS configuration

## Deployment

The application is deployed using:
- **Render** for Django backend with PostgreSQL
- **Vercel** for React frontend
- Environment variables for configuration
- WhiteNoise for static file serving

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

zachary (houndslight) - ocean@outlook.lv

Project Link: https://github.com/houndslight/job-tracker
