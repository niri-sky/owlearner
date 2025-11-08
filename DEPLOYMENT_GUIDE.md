# Deployment Guide - Owl Learner LMS

This guide provides step-by-step instructions for deploying your Learning Management System (LMS) with Vercel and setting up the required database and services.

## Architecture Overview

Your application consists of:
- **Backend**: NestJS GraphQL API with Prisma ORM
- **Frontend**: 4 Next.js applications:
  - Landing Page (public-facing website)
  - Admin Dashboard
  - Teacher Dashboard  
  - Organization Dashboard

## Database Setup

### Recommended Database: PostgreSQL

Your application requires **PostgreSQL** (as defined in the Prisma schema). Here are your best options:

#### Option 1: Vercel Postgres (Recommended for Vercel deployments)
- **Pros**: Seamless integration with Vercel, serverless, auto-scaling
- **Pricing**: Free tier available (256 MB storage, 60 compute hours/month)
- **Setup**:
  1. Go to your Vercel dashboard
  2. Select your project
  3. Navigate to "Storage" tab
  4. Click "Create Database" → "Postgres"
  5. Copy the `DATABASE_URL` connection string

#### Option 2: Neon (Serverless PostgreSQL)
- **Website**: https://neon.tech
- **Pros**: Generous free tier, serverless, branches for dev/staging
- **Pricing**: Free tier includes 0.5 GB storage, 1 compute hour/month
- **Setup**:
  1. Sign up at neon.tech
  2. Create a new project
  3. Copy the connection string (starts with `postgresql://`)

#### Option 3: Supabase
- **Website**: https://supabase.com
- **Pros**: Includes auth, storage, real-time subscriptions (though you won't use these features)
- **Pricing**: Free tier includes 500 MB database, 2 GB bandwidth/month
- **Setup**:
  1. Sign up at supabase.com
  2. Create a new project
  3. Go to Settings → Database
  4. Copy the connection string (Connection Pooling recommended)

#### Option 4: Railway
- **Website**: https://railway.app
- **Pros**: Simple setup, includes PostgreSQL, Redis, and other services
- **Pricing**: $5/month credit on free plan
- **Setup**:
  1. Sign up at railway.app
  2. Create new project → Add PostgreSQL
  3. Copy the `DATABASE_URL` from the Variables tab

### Database Connection String Format
Your `DATABASE_URL` should look like:
```
postgresql://username:password@host:port/database?schema=public
```

## Accessing Your Database

### Method 1: Using Prisma Studio (Built-in GUI)
```bash
# From the server directory
cd server
npx prisma studio
```
This opens a browser-based GUI at `http://localhost:5555` where you can view and edit data.

### Method 2: Using pgAdmin (Desktop Application)
1. Download from https://www.pgadmin.org/
2. Install and open pgAdmin
3. Right-click "Servers" → Register → Server
4. Enter connection details from your DATABASE_URL
5. Connect and browse your database

### Method 3: Using DBeaver (Universal Database Tool)
1. Download from https://dbeaver.io/
2. Install and open DBeaver
3. Click "New Database Connection" → PostgreSQL
4. Enter connection details
5. Test connection and proceed

### Method 4: Using psql (Command Line)
```bash
psql "postgresql://username:password@host:port/database"
```

### Method 5: Provider-Specific Dashboards
- **Vercel Postgres**: Built-in query editor in Vercel dashboard
- **Neon**: SQL Editor in Neon console
- **Supabase**: Table Editor in Supabase dashboard
- **Railway**: Query interface in Railway dashboard

## Required Third-Party Services

Your application requires these external services:

### 1. Stripe (Payment Processing)
- **Purpose**: Handle course payments
- **Setup**: 
  1. Sign up at https://stripe.com
  2. Get your Secret Key from Dashboard → Developers → API keys
  3. Get your Publishable Key for frontend

### 2. AWS S3 (File Storage)
- **Purpose**: Store course videos, images, and resources
- **Alternatives**: Cloudflare R2, DigitalOcean Spaces (S3-compatible)
- **Setup**:
  1. Create AWS account at https://aws.amazon.com
  2. Create an S3 bucket
  3. Create IAM user with S3 access
  4. Generate Access Key and Secret Key

### 3. Mux (Video Hosting/Streaming)
- **Purpose**: Professional video hosting and streaming for course content
- **Setup**:
  1. Sign up at https://mux.com
  2. Create new project
  3. Get Access Token ID and Secret from Settings → Access Tokens

### 4. SMTP Email Service
- **Purpose**: Send verification, password reset, and notification emails
- **Options**:
  - **SendGrid**: Free tier (100 emails/day) - https://sendgrid.com
  - **Mailgun**: Free tier (5,000 emails/month) - https://mailgun.com
  - **Amazon SES**: Very cheap, requires AWS account
  - **Resend**: Developer-friendly, free tier - https://resend.com

## Deployment Instructions

### Step 1: Deploy the Backend (NestJS Server)

The backend **cannot** be deployed on Vercel (Vercel is for frontend only). Use one of these options:

#### Option A: Railway (Recommended - Easiest)
1. Go to https://railway.app and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the NestJS app
5. Add environment variables (see Backend Environment Variables section below)
6. Set root directory to `/server` in settings
7. Railway will provide a public URL like `https://your-app.up.railway.app`

#### Option B: Render
1. Go to https://render.com and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`
5. Add environment variables
6. Deploy

#### Option C: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set buildpack: `heroku buildpacks:set heroku/nodejs`
4. Add environment variables via Heroku dashboard
5. Deploy: `git push heroku main`

#### Option D: DigitalOcean App Platform
1. Go to https://cloud.digitalocean.com
2. Create App → Deploy from GitHub
3. Select repository and `/server` directory
4. Add environment variables
5. Deploy

### Backend Environment Variables

Add these to your backend deployment:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# App Configuration
APP_NAME="Owl Learner"

# SMTP Configuration (use SendGrid, Mailgun, etc.)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"

# Frontend URLs (will be your Vercel URLs)
ADMIN_CLIENT_URL="https://admin.yourdomain.com"
TEACHER_CLIENT_URL="https://teacher.yourdomain.com"
ORGANIZATION_CLIENT_URL="https://org.yourdomain.com"
USER_CLIENT_URL="https://yourdomain.com"

# Security
HASH_SECRET="generate-a-random-string-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..." # or sk_live_ for production

# Mux (Video Platform)
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"

# AWS S3
AWS_ACCESS_KEY="your-aws-access-key"
AWS_SECRET_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET="your-bucket-name"
```

### Step 2: Initialize Database

After deploying the backend:

```bash
# On your local machine, set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Navigate to server directory
cd server

# Run migrations
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

### Step 3: Deploy Frontend Applications on Vercel

You need to deploy **4 separate Next.js applications**:

#### 1. Landing Page (Main Website)
```bash
# Navigate to project root
cd /workspace

# Install Vercel CLI
npm i -g vercel

# Deploy landing page
cd clients/landing-page
vercel
```

Follow prompts:
- Link to existing project or create new
- Set Project Name: `lms-landing-page`
- Add environment variables (see below)

**Environment Variables for Landing Page:**
```env
NEXT_PUBLIC_SERVER_URI="https://your-backend-url.railway.app"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # or pk_live_
```

#### 2. Admin Dashboard
```bash
cd clients/admin-dashboard
vercel
```

**Environment Variables:**
```env
NEXT_PUBLIC_SERVER_URI="https://your-backend-url.railway.app"
```

#### 3. Teacher Dashboard
```bash
cd clients/teacher-dashboard
vercel
```

**Environment Variables:**
```env
NEXT_PUBLIC_SERVER_URI="https://your-backend-url.railway.app"
```

#### 4. Organization Dashboard
```bash
cd clients/organization-dashboard
vercel
```

**Environment Variables:**
```env
NEXT_PUBLIC_SERVER_URI="https://your-backend-url.railway.app"
```

### Step 4: Configure Custom Domains (Optional)

In Vercel dashboard for each project:
1. Go to Settings → Domains
2. Add your custom domain:
   - Landing Page: `yourdomain.com`
   - Admin: `admin.yourdomain.com`
   - Teacher: `teacher.yourdomain.com`
   - Organization: `org.yourdomain.com`

Update your backend's client URL environment variables with these domains.

### Step 5: Update Backend with Frontend URLs

Go back to your backend deployment (Railway/Render/etc.) and update:
```env
ADMIN_CLIENT_URL="https://your-admin.vercel.app"
TEACHER_CLIENT_URL="https://your-teacher.vercel.app"
ORGANIZATION_CLIENT_URL="https://your-org.vercel.app"
USER_CLIENT_URL="https://your-landing.vercel.app"
```

## Using Vercel Dashboard for Deployment

### Alternative to CLI: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. For each application:
   - Click "Add New Project"
   - Select your repository
   - Configure:
     - **Root Directory**: `clients/landing-page` (or respective app)
     - **Framework Preset**: Next.js (auto-detected)
     - **Build Command**: `npm run build` (default)
     - **Output Directory**: `.next` (default)
   - Add environment variables
   - Click "Deploy"

4. Repeat for all 4 applications (change root directory each time)

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database is connected and migrations are applied
- [ ] All 4 frontend apps are deployed on Vercel
- [ ] Environment variables are set correctly on all deployments
- [ ] CORS is enabled on backend (already done in your code)
- [ ] Test user registration and login
- [ ] Test course creation and purchase flow
- [ ] Test file uploads (S3)
- [ ] Test video uploads (Mux)
- [ ] Test email sending
- [ ] Set up monitoring (Railway/Render have built-in monitoring)

## Local Development Setup

```bash
# 1. Install dependencies for all apps
cd server && npm install
cd ../clients/landing-page && npm install
cd ../admin-dashboard && npm install
cd ../teacher-dashboard && npm install
cd ../organization-dashboard && npm install

# 2. Set up environment variables
# Copy .env.sample in server and fill values
cp server/.env.sample server/.env

# Copy .env.local.sample in each client
cp clients/landing-page/.env.local.sample clients/landing-page/.env.local
# Repeat for other clients

# 3. Start database migrations
cd server
npx prisma migrate dev
npx prisma generate

# 4. Start development servers
# Terminal 1: Backend
cd server && npm run start:dev

# Terminal 2: Landing page
cd clients/landing-page && npm run dev

# Terminal 3: Admin dashboard
cd clients/admin-dashboard && npm run dev

# Terminal 4: Teacher dashboard  
cd clients/teacher-dashboard && npm run dev

# Terminal 5: Organization dashboard
cd clients/organization-dashboard && npm run dev
```

## Cost Estimate (Free Tier/Low Traffic)

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| **Vercel** (4 apps) | Unlimited hobby projects | $20/month per team member |
| **Railway** (Backend) | $5/month credit | Pay per usage (~$5-20/month) |
| **Neon** (Database) | 0.5 GB | $19/month for 3GB |
| **AWS S3** | 5 GB storage, 20K requests | $0.023/GB/month |
| **Mux** | 100 mins video processing | ~$0.015/min encoding |
| **Stripe** | Free | 2.9% + $0.30 per transaction |
| **SendGrid** | 100 emails/day | $19.95/month for 50K |
| **Total (minimal traffic)** | ~$0-10/month | ~$50-100/month for production |

## Troubleshooting

### Common Issues

**1. Database Connection Error**
- Verify DATABASE_URL is correct
- Check if database allows connections from your hosting IP
- For serverless, use connection pooling

**2. CORS Issues**
- Backend has `app.enableCors()` - verify it's in main.ts
- Check NEXT_PUBLIC_SERVER_URI is correct on frontends

**3. File Upload Fails**
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure bucket has correct CORS policy

**4. Emails Not Sending**
- Test SMTP credentials
- Check spam folder
- Verify email templates path is correct

**5. GraphQL Schema Issues**
- Run `npx prisma generate` after schema changes
- Restart backend server

## Support and Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **NestJS Docs**: https://docs.nestjs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app/

## Security Recommendations

1. **Use environment variables** for all secrets (never commit .env files)
2. **Enable HTTPS** (automatic on Vercel and Railway)
3. **Set up database backups** (most providers have automatic backups)
4. **Use strong HASH_SECRET** (generate with: `openssl rand -base64 32`)
5. **Monitor logs** for suspicious activity
6. **Keep dependencies updated** regularly
7. **Use Stripe webhook signatures** for payment verification
8. **Implement rate limiting** for API endpoints (add to NestJS)

---

**Need Help?** If you encounter issues during deployment, check the logs in your hosting provider's dashboard. Most issues are related to environment variables or database connectivity.
