# HireMatch - AI-Powered Job Board

A full-stack job board application with AI-powered CV matching and scoring.

## Stack
- **Backend**: Laravel 12 (REST API) + JWT Auth
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Database**: MySQL
- **AI**: OpenAI GPT-3.5-turbo for CV/job matching

## Setup Instructions

### Prerequisites
- PHP 8.2+, Composer, Node.js 18+, MySQL

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

Edit `.env` with your credentials:
```
DB_DATABASE=hirematch
DB_USERNAME=root
DB_PASSWORD=your_password
OPENAI_API_KEY=your_openai_key
MAIL_USERNAME=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_pass
```

```bash
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hirematch.com | Admin123! |
| Employer | alice@techcorp.com | Password123! |
| Employer | bob@creativeagency.com | Password123! |
| Employer | carol@startupxyz.com | Password123! |
| Candidate | david@candidate.com | Password123! |
| Candidate | emma@candidate.com | Password123! |

---

## Features

- **JWT Authentication** with role-based access (admin/employer/candidate)
- **Job Board** with search, filters (type, location), pagination
- **AI Matching** - OpenAI analyzes CV against job requirements, returns 0-100 score + feedback
- **CV Upload** - PDF/DOC/DOCX up to 5MB with drag & drop
- **Application Management** - candidates apply, employers review and update status
- **Email Notifications** - via Mailtrap when application status changes
- **Saved Jobs** - candidates can save/unsave jobs
- **Admin Panel** - view stats, manage users and jobs

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/refresh`

### Jobs (Public)
- `GET /api/jobs?search=&location=&type[]=`
- `GET /api/jobs/{id}`

### Candidate (auth required)
- `POST /api/jobs/{id}/apply`
- `GET /api/applications`
- `DELETE /api/applications/{id}`
- `POST /api/jobs/{id}/save`
- `GET /api/saved-jobs`

### Employer (auth required)
- `POST /api/company`
- `PUT /api/company`
- `POST /api/jobs`
- `PUT /api/jobs/{id}`
- `DELETE /api/jobs/{id}`
- `GET /api/employer/jobs`
- `GET /api/employer/applications/{jobId}`
- `PUT /api/employer/applications/{id}/status`

### Admin (auth required)
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `DELETE /api/admin/users/{id}`
- `GET /api/admin/jobs`
- `DELETE /api/admin/jobs/{id}`
