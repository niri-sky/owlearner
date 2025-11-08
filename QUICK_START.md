# Quick Start Guide - Owl Learner LMS

**Get your Learning Management System deployed in 30 minutes!**

This is a condensed guide for rapid deployment. For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## 📋 Prerequisites

- [x] GitHub account (for version control)
- [x] Vercel account (for frontend hosting) - Sign up at https://vercel.com
- [x] Railway account (for backend hosting) - Sign up at https://railway.app

---

## 🚀 5-Step Deployment Process

### Step 1: Set Up Database (5 minutes)

**Option A: Use Railway PostgreSQL (Easiest)**
1. Go to https://railway.app/dashboard
2. Click "New Project" → "Provision PostgreSQL"
3. Click on PostgreSQL → "Variables" tab
4. Copy the `DATABASE_URL` value
5. **Save this** - you'll need it soon!

**Option B: Use Neon (Free tier)**
1. Go to https://neon.tech
2. Create new project
3. Copy connection string from dashboard
4. **Save this** - you'll need it soon!

**Option C: Use Supabase (Free tier + extras)**
1. Go to https://supabase.com
2. Create new project (wait 2-3 minutes)
3. Settings → Database → **Connection pooling** tab
4. Copy the connection string (port 6543)
5. Replace `[YOUR-PASSWORD]` with your actual password
6. **Save this** - you'll need it soon!
7. **Detailed guide:** See [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)

---

### Step 2: Get Required API Keys (10 minutes)

**Minimum required services:**

#### A. SendGrid (Email - Free)
1. Sign up at https://sendgrid.com
2. Settings → API Keys → Create API Key → Full Access
3. Copy the key (starts with `SG.`)
4. Note: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_PORT=587`, `SMTP_USER=apikey`

#### B. Stripe (Payments)
1. Sign up at https://stripe.com
2. Dashboard → Developers → API keys
3. Copy **Secret key** (sk_test_xxx) and **Publishable key** (pk_test_xxx)

#### C. AWS S3 or Cloudflare R2 (File Storage)
**Quick option - AWS S3:**
1. Sign up at https://aws.amazon.com
2. S3 → Create bucket → Name it (e.g., "lms-files")
3. IAM → Users → Add user → Attach `AmazonS3FullAccess`
4. Security credentials → Create access key
5. Copy Access Key ID and Secret

#### D. Mux (Video Platform)
1. Sign up at https://mux.com (free $20 credit)
2. Settings → Access Tokens → Create new token
3. Copy Token ID and Token Secret

**💡 Tip:** Keep all these keys in a text file for easy copy-paste!

---

### Step 3: Deploy Backend to Railway (5 minutes)

1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository
5. Railway will detect NestJS automatically
6. **Important:** Click the service → Settings → Set Root Directory: `/server`
7. Add environment variables (click "Variables" tab):

```env
DATABASE_URL=<paste from Step 1>
APP_NAME=Owl Learner
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<your SendGrid key>
HASH_SECRET=<generate with: openssl rand -base64 32>
STRIPE_SECRET_KEY=<your Stripe secret key>
MUX_TOKEN_ID=<your Mux token ID>
MUX_TOKEN_SECRET=<your Mux token secret>
AWS_ACCESS_KEY=<your AWS access key>
AWS_SECRET_KEY=<your AWS secret key>
AWS_REGION=us-east-1
AWS_BUCKET=<your bucket name>
```

**Note:** Leave the client URLs empty for now - we'll add them in Step 5.

8. Click "Deploy"
9. Wait for deployment (2-3 minutes)
10. Click "Networking" → "Generate Domain"
11. **Copy your backend URL** (e.g., `https://your-app.up.railway.app`)

---

### Step 4: Initialize Database (2 minutes)

```bash
# On your local machine
cd server

# Set your database URL
export DATABASE_URL="<paste from Step 1>"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# (Optional) Seed initial data
npx prisma db seed
```

---

### Step 5: Deploy Frontend to Vercel (8 minutes)

You need to deploy 4 separate applications. We'll use Vercel CLI for speed.

#### Install Vercel CLI
```bash
npm i -g vercel
```

#### Deploy Landing Page
```bash
cd clients/landing-page
vercel

# During setup:
# - Set up and deploy? Yes
# - Which scope? Choose your account
# - Link to existing project? No
# - Project name? lms-landing-page
# - Which directory? ./ (press Enter)
# - Override settings? No
```

After deployment:
1. Go to https://vercel.com/dashboard
2. Select `lms-landing-page` project
3. Settings → Environment Variables → Add:
```
NEXT_PUBLIC_SERVER_URI=<your Railway backend URL>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your Stripe publishable key>
```
4. Copy the deployment URL (e.g., `https://lms-landing-page.vercel.app`)

#### Deploy Admin Dashboard
```bash
cd ../admin-dashboard
vercel
# Project name: lms-admin-dashboard
```
Add environment variable:
```
NEXT_PUBLIC_SERVER_URI=<your Railway backend URL>
```
Copy the deployment URL.

#### Deploy Teacher Dashboard
```bash
cd ../teacher-dashboard
vercel
# Project name: lms-teacher-dashboard
```
Add environment variable:
```
NEXT_PUBLIC_SERVER_URI=<your Railway backend URL>
```
Copy the deployment URL.

#### Deploy Organization Dashboard
```bash
cd ../organization-dashboard
vercel
# Project name: lms-organization-dashboard
```
Add environment variable:
```
NEXT_PUBLIC_SERVER_URI=<your Railway backend URL>
```
Copy the deployment URL.

---

### Step 6: Update Backend with Frontend URLs (2 minutes)

1. Go back to Railway dashboard
2. Open your backend service
3. Click "Variables" tab
4. Add/update these variables:
```env
ADMIN_CLIENT_URL=https://lms-admin-dashboard.vercel.app
TEACHER_CLIENT_URL=https://lms-teacher-dashboard.vercel.app
ORGANIZATION_CLIENT_URL=https://lms-organization-dashboard.vercel.app
USER_CLIENT_URL=https://lms-landing-page.vercel.app
```
5. Save changes (Railway will auto-redeploy)

---

## ✅ Verification Checklist

- [ ] Backend is running (visit `https://your-backend.railway.app` - should see "Cannot GET /")
- [ ] Landing page loads (visit your landing page URL)
- [ ] Admin dashboard loads
- [ ] Teacher dashboard loads
- [ ] Organization dashboard loads
- [ ] Can register a new user
- [ ] Received verification email
- [ ] Can login successfully

---

## 🎉 You're Live!

Your LMS is now deployed! Here are your URLs:

- **Landing Page**: https://lms-landing-page.vercel.app
- **Admin Dashboard**: https://lms-admin-dashboard.vercel.app
- **Teacher Dashboard**: https://lms-teacher-dashboard.vercel.app
- **Organization Dashboard**: https://lms-organization-dashboard.vercel.app
- **Backend API**: https://your-app.up.railway.app

---

## 📱 Next Steps

### 1. Set Up Custom Domains (Optional)

In Vercel dashboard for each project:
1. Settings → Domains
2. Add custom domain:
   - Landing: `yourdomain.com`
   - Admin: `admin.yourdomain.com`
   - Teacher: `teacher.yourdomain.com`
   - Org: `org.yourdomain.com`

Update backend environment variables with new URLs!

### 2. Create Admin Account

```bash
# Connect to your database using Prisma Studio
cd server
export DATABASE_URL="<your database URL>"
npx prisma studio

# Or use SQL:
INSERT INTO "Admin" (name, email, password, role, status) 
VALUES ('Admin', 'admin@yourdomain.com', 'hashed-password', 'admin', 'active');
```

**Note:** Hash the password first using bcrypt.

### 3. Configure Stripe Webhooks

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.railway.app/webhooks/stripe`
3. Select events: `payment_intent.succeeded`
4. Copy webhook secret and add to backend env: `STRIPE_WEBHOOK_SECRET`

### 4. Test Complete Flow

1. Register as student
2. Browse courses
3. Add to cart
4. Complete test payment (use test card: `4242 4242 4242 4242`)
5. Verify course access

### 5. Enable Production Mode

**Stripe:**
- Switch from test keys to live keys
- Update both backend (`STRIPE_SECRET_KEY`) and frontend (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)

**Email:**
- Verify your domain with SendGrid
- Request production access (if on free tier)

---

## 🛠️ Managing Your Application

### Access Database
```bash
# Option 1: Prisma Studio (GUI)
cd server
export DATABASE_URL="<your database URL>"
npx prisma studio

# Option 2: Railway Dashboard
# Go to Railway → PostgreSQL service → Data tab
```

See [DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md) for detailed instructions.

### View Logs

**Backend (Railway):**
- Dashboard → Your service → "Deployments" tab → Click on deployment

**Frontend (Vercel):**
- Dashboard → Your project → "Deployments" tab → Click on deployment → "Logs"

### Update Code

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel and Railway will auto-deploy!
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Expected Cost (Low Traffic) |
|---------|-----------|----------------------------|
| Vercel (4 apps) | ✅ Free | $0/month |
| Railway | $5 credit/month | $5-10/month |
| Database (Neon/Railway) | ✅ Free tier | $0-5/month |
| SendGrid | 100 emails/day | $0/month |
| Stripe | ✅ Free (2.9% + $0.30 per transaction) | $0 + transaction fees |
| AWS S3 | 5GB free | $1-5/month |
| Mux | $20 credit | $5-20/month |
| **Total** | | **$10-40/month** |

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check database is running (Railway/Neon dashboard)
- Run `npx prisma migrate deploy` again

### "CORS error"
- Verify NEXT_PUBLIC_SERVER_URI has correct backend URL
- Check backend has `app.enableCors()` in main.ts

### "Emails not sending"
- Test SMTP credentials
- Check SendGrid account is verified
- Look for emails in spam folder

### "File upload fails"
- Verify AWS credentials
- Check S3 bucket permissions
- Enable CORS on S3 bucket

### "Videos not playing"
- Verify Mux credentials
- Check video upload completed in Mux dashboard
- Ensure video is in "ready" state

---

## 📚 Additional Resources

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md)** - Database access and management
- **[ENV_VARIABLES_REFERENCE.md](./ENV_VARIABLES_REFERENCE.md)** - All environment variables explained

---

## 🆘 Need Help?

**Common issues:**
1. Check environment variables are set correctly
2. Verify all services are running (Railway/Vercel dashboards)
3. Check logs for error messages
4. Ensure database migrations are applied

**Can't find the answer?**
- Check the detailed deployment guide
- Review service provider documentation
- Check service status pages

---

## 🎓 You're Ready!

Your Learning Management System is now live and ready to onboard students and teachers. Start by:
1. Creating admin account
2. Adding categories and topics
3. Inviting teachers
4. Creating first course
5. Testing student enrollment

**Happy teaching! 🚀**
