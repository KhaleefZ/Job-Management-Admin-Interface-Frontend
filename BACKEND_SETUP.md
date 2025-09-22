# Backend Setup Instructions

This document contains the setup instructions for the Node.js backend server that handles job applications.

## Backend Structure Created

The following backend files need to be created in a separate `backend` directory:

```
backend/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── controllers/
│   ├── applicationController.js
│   └── jobController.js
├── routes/
│   ├── applications.js
│   └── jobs.js
├── services/
│   ├── emailService.js
│   └── supabaseService.js
├── middleware/
│   ├── uploadMiddleware.js
│   ├── authMiddleware.js
│   └── errorHandler.js
└── uploads/                 # Directory for uploaded resumes
```

## Database Schema (Supabase)

Execute this SQL in your Supabase dashboard:

```sql
-- Applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  experience VARCHAR(50),
  current_company VARCHAR(255),
  current_role VARCHAR(255),
  notice_period VARCHAR(50),
  expected_salary VARCHAR(50),
  cover_letter TEXT,
  linkedin_profile VARCHAR(500),
  portfolio_website VARCHAR(500),
  why_interested TEXT,
  available_for_interview VARCHAR(100),
  resume_filename VARCHAR(255),
  resume_path VARCHAR(500),
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table (if not exists)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(100) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  experience_level VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  benefits TEXT[],
  skills TEXT[],
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_jobs_status ON jobs(status);
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://gnnwphicnekgwvdykzww.supabase.co
SUPABASE_KEY=sbp_e4605d3d51e18f8e12b22e585547820b65b061dc

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

## Installation Steps

1. Create the backend directory structure
2. Install dependencies:
   ```bash
   cd backend
   npm init -y
   npm install express cors helmet morgan compression dotenv
   npm install @supabase/supabase-js multer nodemailer jsonwebtoken bcryptjs
   npm install --save-dev nodemon
   ```

3. Add the server files (controllers, routes, services, middleware)
4. Create the uploads directory: `mkdir uploads`
5. Set up environment variables in `.env`
6. Run the database schema in Supabase
7. Start the server: `npm run dev`

## Frontend Integration

The frontend API client (`lib/api-client.ts`) has been updated to work with this backend structure. The key integration points are:

- **Application Submission**: `POST /api/applications` with FormData for file uploads
- **Job Fetching**: `GET /api/jobs` with filtering parameters
- **File Uploads**: Handled via multipart/form-data with multer middleware

## Features Implemented

1. **Job Application Submission**: Complete form with file upload
2. **Email Notifications**: Automated emails to both applicant and admin
3. **File Storage**: Resume uploads stored locally with unique filenames
4. **Database Integration**: All applications stored in Supabase
5. **Error Handling**: Comprehensive error handling and validation
6. **CORS Support**: Cross-origin requests enabled for frontend integration

## Testing

Once the backend is set up:

1. Start the backend server: `npm run dev` (should run on port 3001)
2. Start the frontend: `npm run dev` (should run on port 3000)
3. Test job application submission through the UI
4. Check Supabase database for stored applications
5. Verify email notifications are being sent

## Notes

- The backend runs on port 3001 by default
- Frontend API client is configured to use `http://localhost:3001`
- Email service requires Gmail app password for SMTP authentication
- File uploads are stored in the `uploads` directory
- All sensitive data is stored in environment variables