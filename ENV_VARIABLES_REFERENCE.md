# Environment Variables Reference

Quick reference for all required environment variables across your LMS application.

## Backend (NestJS Server)

Required environment variables for `/workspace/server/.env`

### Database
```env
# PostgreSQL Connection String
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://user:password@localhost:5432/owl_learner"

# Example providers:
# Vercel Postgres: postgresql://user:pass@host.vercel-storage.com:5432/verceldb
# Neon: postgresql://user:pass@host.neon.tech/dbname
# Supabase: postgresql://postgres:pass@db.host.supabase.co:5432/postgres
# Railway: postgresql://user:pass@host.railway.internal:5432/railway
```

### Application Configuration
```env
# Your application name (used in emails)
APP_NAME="Owl Learner"
```

### Email Configuration (SMTP)
```env
# SMTP Server Settings
SMTP_HOST="smtp.sendgrid.net"          # SendGrid
# SMTP_HOST="smtp.mailgun.org"         # Mailgun
# SMTP_HOST="email-smtp.us-east-1.amazonaws.com"  # AWS SES

SMTP_PORT="587"                        # Standard TLS port (use 465 for SSL)
SMTP_USER="apikey"                     # SendGrid uses 'apikey' as username
SMTP_PASSWORD="SG.xxxxx"               # Your SMTP API key/password

# Common providers:
# SendGrid: user="apikey", password="SG.xxxxxx"
# Mailgun: user="postmaster@your-domain.com", password="your-api-key"
# Gmail: user="your-email@gmail.com", password="app-password"
```

### Frontend URLs
```env
# URLs where your frontend apps are deployed
ADMIN_CLIENT_URL="https://admin-lms.vercel.app"
TEACHER_CLIENT_URL="https://teacher-lms.vercel.app"
ORGANIZATION_CLIENT_URL="https://org-lms.vercel.app"
USER_CLIENT_URL="https://lms.vercel.app"

# For local development:
# ADMIN_CLIENT_URL="http://localhost:3301"
# TEACHER_CLIENT_URL="http://localhost:3302"
# ORGANIZATION_CLIENT_URL="http://localhost:3303"
# USER_CLIENT_URL="http://localhost:3000"
```

### Security
```env
# Secret key for hashing/encryption
# Generate with: openssl rand -base64 32
HASH_SECRET="your-random-secret-key-here-make-it-long-and-random"
```

### Payment Processing (Stripe)
```env
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_xxxxx"     # Test key
# STRIPE_SECRET_KEY="sk_live_xxxxx"   # Production key
```

### Video Platform (Mux)
```env
# Get from: https://dashboard.mux.com
# Settings → Access Tokens → Create new token
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"
```

### File Storage (AWS S3)
```env
# AWS S3 Credentials
# Get from: AWS Console → IAM → Users → Security Credentials
AWS_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"                 # Your S3 bucket region
AWS_BUCKET="owl-learner-uploads"       # Your S3 bucket name

# Alternative: Cloudflare R2 (S3-compatible)
# AWS_ACCESS_KEY="R2-access-key"
# AWS_SECRET_KEY="R2-secret-key"
# AWS_REGION="auto"
# AWS_BUCKET="your-bucket"
```

### Complete Backend .env Example
```env
DATABASE_URL="postgresql://user:pass@host.railway.app:5432/railway"
APP_NAME="Owl Learner"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="SG.xxxxxxxxxxxxxx"
ADMIN_CLIENT_URL="https://admin.yourdomain.com"
TEACHER_CLIENT_URL="https://teacher.yourdomain.com"
ORGANIZATION_CLIENT_URL="https://org.yourdomain.com"
USER_CLIENT_URL="https://yourdomain.com"
HASH_SECRET="generated-random-secret-32-chars"
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"
AWS_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCY"
AWS_REGION="us-east-1"
AWS_BUCKET="your-bucket-name"
```

---

## Frontend Applications

All frontend apps use `NEXT_PUBLIC_` prefix for client-side accessible variables.

### Landing Page (`/clients/landing-page/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_SERVER_URI="https://your-backend.railway.app"

# Stripe Publishable Key (safe to expose to client)
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"  # For production
```

### Admin Dashboard (`/clients/admin-dashboard/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_SERVER_URI="https://your-backend.railway.app"
```

### Teacher Dashboard (`/clients/teacher-dashboard/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_SERVER_URI="https://your-backend.railway.app"
```

### Organization Dashboard (`/clients/organization-dashboard/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_SERVER_URI="https://your-backend.railway.app"
```

---

## How to Get Each Service Key

### 1. Database URL (PostgreSQL)

**Vercel Postgres:**
1. Go to https://vercel.com/dashboard
2. Select project → Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` from connection string

**Neon:**
1. Sign up at https://neon.tech
2. Create project
3. Copy connection string from dashboard

**Supabase:**
1. Sign up at https://supabase.com
2. Create project
3. Settings → Database → Connection string (use Connection Pooling)

**Railway:**
1. Sign up at https://railway.app
2. New Project → Add PostgreSQL
3. Variables tab → Copy `DATABASE_URL`

### 2. SMTP Credentials

**SendGrid (Recommended - Free 100/day):**
1. Sign up at https://sendgrid.com
2. Settings → API Keys → Create API Key
3. Use: `SMTP_HOST="smtp.sendgrid.net"`, `SMTP_USER="apikey"`, `SMTP_PASSWORD="SG.xxxx"`

**Mailgun:**
1. Sign up at https://www.mailgun.com
2. Sending → Domain Settings → SMTP credentials
3. Get credentials from dashboard

**Resend:**
1. Sign up at https://resend.com
2. API Keys → Create
3. Use SMTP settings from documentation

**Gmail (For testing only):**
1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use: `SMTP_HOST="smtp.gmail.com"`, `SMTP_PORT="587"`

### 3. Stripe Keys

1. Go to https://stripe.com
2. Create account
3. Dashboard → Developers → API keys
4. Copy:
   - **Secret key** (sk_test_xxx) → Backend `STRIPE_SECRET_KEY`
   - **Publishable key** (pk_test_xxx) → Frontend `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**For Production:**
- Toggle "View test data" to OFF
- Copy live keys (sk_live_xxx and pk_live_xxx)

### 4. Mux Credentials

1. Sign up at https://mux.com
2. Create new project (free $20 credit)
3. Settings → Access Tokens → Generate new token
4. Copy Token ID and Token Secret

### 5. AWS S3 Credentials

1. Sign up at https://aws.amazon.com
2. Create S3 bucket:
   - S3 Console → Create bucket
   - Set region and name
   - Enable public access if needed
3. Create IAM User:
   - IAM Console → Users → Add user
   - Attach policy: `AmazonS3FullAccess`
   - Create access key → Copy Access Key ID and Secret Access Key

**Cloudflare R2 (Alternative):**
1. Sign up at https://cloudflare.com
2. R2 → Create bucket
3. Manage R2 API Tokens → Create API token
4. Copy credentials (S3-compatible)

---

## Environment Variable Checklist

Use this checklist when deploying:

### Backend Deployment (Railway/Render/Heroku)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `APP_NAME` - Your application name
- [ ] `SMTP_HOST` - Email server host
- [ ] `SMTP_PORT` - Email server port
- [ ] `SMTP_USER` - Email username
- [ ] `SMTP_PASSWORD` - Email password
- [ ] `ADMIN_CLIENT_URL` - Admin dashboard URL
- [ ] `TEACHER_CLIENT_URL` - Teacher dashboard URL
- [ ] `ORGANIZATION_CLIENT_URL` - Organization dashboard URL
- [ ] `USER_CLIENT_URL` - Landing page URL
- [ ] `HASH_SECRET` - Random secret string
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `MUX_TOKEN_ID` - Mux token ID
- [ ] `MUX_TOKEN_SECRET` - Mux token secret
- [ ] `AWS_ACCESS_KEY` - AWS access key
- [ ] `AWS_SECRET_KEY` - AWS secret key
- [ ] `AWS_REGION` - AWS region
- [ ] `AWS_BUCKET` - S3 bucket name

### Frontend Deployments (Vercel)
**Landing Page:**
- [ ] `NEXT_PUBLIC_SERVER_URI` - Backend API URL
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Admin Dashboard:**
- [ ] `NEXT_PUBLIC_SERVER_URI` - Backend API URL

**Teacher Dashboard:**
- [ ] `NEXT_PUBLIC_SERVER_URI` - Backend API URL

**Organization Dashboard:**
- [ ] `NEXT_PUBLIC_SERVER_URI` - Backend API URL

---

## Security Best Practices

### ✅ DO:
- Use strong, random values for `HASH_SECRET` (32+ characters)
- Use environment variables, never hardcode secrets
- Use different keys for development and production
- Keep `.env` files in `.gitignore`
- Rotate keys periodically
- Use Stripe test keys in development

### ❌ DON'T:
- Commit `.env` files to Git
- Share API keys in public channels
- Use production keys in development
- Reuse the same secret across multiple apps
- Use simple/guessable secrets

---

## Generating Secure Secrets

### Generate HASH_SECRET

**Using OpenSSL (Mac/Linux):**
```bash
openssl rand -base64 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Using Python:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Online:**
- https://generate-random.org/api-key-generator (use 256-bit)

---

## Testing Environment Variables

### Backend
```bash
# Test if environment variables are loaded
cd server
node -e "console.log(process.env.DATABASE_URL ? '✓ DATABASE_URL loaded' : '✗ DATABASE_URL missing')"
```

### Frontend
Create a test page:
```tsx
// pages/test-env.tsx
export default function TestEnv() {
  return (
    <div>
      <p>Server URI: {process.env.NEXT_PUBLIC_SERVER_URI || '❌ Missing'}</p>
      <p>Stripe Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✓ Set' : '❌ Missing'}</p>
    </div>
  );
}
```

---

## Deployment Platform-Specific Notes

### Vercel (Frontend)
- Add env vars in: Project Settings → Environment Variables
- Variables are encrypted at rest
- Can set different values for Production/Preview/Development
- Use `.env.local` for local development (not committed)

### Railway (Backend)
- Add env vars in: Service → Variables tab
- Supports `.env` files and raw editor
- Variables are encrypted
- Automatic restart on variable change

### Render (Backend)
- Add env vars in: Dashboard → Environment
- Supports environment groups
- Can sync from .env file

### Heroku (Backend)
- Add env vars via CLI: `heroku config:set VAR=value`
- Or in Dashboard → Settings → Config Vars
- View all: `heroku config`

---

## Quick Copy Templates

### For Backend Deployment

```bash
# Copy and fill these in your deployment dashboard:
DATABASE_URL=
APP_NAME=Owl Learner
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
ADMIN_CLIENT_URL=
TEACHER_CLIENT_URL=
ORGANIZATION_CLIENT_URL=
USER_CLIENT_URL=
HASH_SECRET=
STRIPE_SECRET_KEY=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=
AWS_BUCKET=
```

### For Frontend Deployments

```bash
# Landing Page only:
NEXT_PUBLIC_SERVER_URI=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# All other dashboards:
NEXT_PUBLIC_SERVER_URI=
```

---

Need help with a specific service? Check the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed setup instructions.
