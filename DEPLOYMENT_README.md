# Owl Learner LMS - Deployment Documentation

Complete deployment and management documentation for the Owl Learner Learning Management System.

## 📚 Documentation Overview

This repository includes comprehensive guides for deploying and managing your LMS:

### 🚀 [QUICK_START.md](./QUICK_START.md)
**Start here!** Get your LMS deployed in 30 minutes.
- 5-step deployment process
- Minimum required services
- Quick verification checklist
- Cost breakdown

### 📖 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
Complete deployment instructions with multiple hosting options.
- Detailed architecture overview
- Database setup (Vercel Postgres, Neon, Supabase, Railway)
- Backend deployment (Railway, Render, Heroku, DigitalOcean)
- Frontend deployment (Vercel)
- Third-party service setup (Stripe, AWS S3, Mux, SMTP)
- Custom domain configuration
- Security best practices

### 🗄️ [DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md)
Everything you need to know about managing your PostgreSQL database.
- Multiple database access methods (Prisma Studio, pgAdmin, DBeaver, psql)
- Common SQL queries for analytics and management
- Backup and restore procedures
- Database migrations
- Data seeding
- Performance optimization
- Troubleshooting

### 🔐 [ENV_VARIABLES_REFERENCE.md](./ENV_VARIABLES_REFERENCE.md)
Complete reference for all environment variables.
- Backend environment variables (18 total)
- Frontend environment variables (per app)
- How to get each service key
- Security best practices
- Copy-paste templates
- Platform-specific notes

---

## 🏗️ Architecture

### Backend
- **Framework**: NestJS (Node.js)
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: GraphQL Subscriptions
- **Auth**: JWT-based authentication

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State**: Jotai, React Hook Form
- **GraphQL Client**: Apollo Client

### Applications
1. **Landing Page** - Public-facing website for course browsing
2. **Admin Dashboard** - System administration and moderation
3. **Teacher Dashboard** - Course creation and management
4. **Organization Dashboard** - Multi-teacher organization management

---

## 🔧 Technology Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **PostgreSQL** - Relational database
- **Prisma** - Database ORM
- **GraphQL** - API query language

### Third-Party Services
- **Stripe** - Payment processing
- **AWS S3** - File storage (images, documents)
- **Mux** - Video hosting and streaming
- **SendGrid/Mailgun** - Email delivery
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting

---

## 📊 Database Schema

Your LMS includes these main entities:

**User Management:**
- Admin - System administrators
- Student - Course learners
- Teacher - Course instructors
- Organization - Multi-teacher entities

**Course System:**
- Course - Main course entity
- CourseSection - Course chapters
- CourseContent - Lectures/videos
- CourseAssignment - Homework/assignments
- CourseContentQuiz - Quizzes

**Learning Progress:**
- StudentCourse - Enrollment tracking
- StudentQuizPoint - Quiz scores
- StudentAssignmentPoint - Assignment grades
- CourseReview - Student reviews

**E-Commerce:**
- Invoice - Purchase records
- CourseSale - Sales tracking
- Coupon - Discount codes
- TeacherEarning - Revenue tracking
- PaymentInvoice - Payout requests

**Social Features:**
- Post - User posts
- Comment - Post comments
- PostLike - Post likes
- FollowingFollower - User connections

**Support:**
- Ticket - Support tickets
- TicketMessage - Ticket conversations

**System:**
- Category, SubCategory, Topic - Course categorization
- Notification - User notifications
- Token - Authentication tokens
- Upload - File references

For complete schema, see: [`/server/prisma/schema.prisma`](./server/prisma/schema.prisma)

---

## 🚀 Quick Command Reference

### Backend (Server)
```bash
# Install dependencies
cd server && npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Frontend (Each Client)
```bash
# Install dependencies
cd clients/landing-page && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

### Database Management
```bash
# Open Prisma Studio
npx prisma studio

# Connect with psql
psql "postgresql://user:pass@host:5432/db"

# Backup database
pg_dump -h host -U user -d database > backup.sql

# Restore database
psql -h host -U user -d database < backup.sql
```

---

## 🌐 Deployment Platforms

### Recommended Stack
- **Frontend**: Vercel (Free tier, unlimited projects)
- **Backend**: Railway ($5/month credit)
- **Database**: Railway PostgreSQL or Neon (Free tier)
- **Email**: SendGrid (Free tier: 100 emails/day)

### Alternative Stacks

**Budget Stack (Free/Minimal Cost):**
- Frontend: Vercel (Free)
- Backend: Render (Free tier with limitations)
- Database: Neon (Free tier: 0.5GB)
- Email: SendGrid (Free tier)
- Storage: Cloudflare R2 (10GB free)

**Production Stack (Better Performance):**
- Frontend: Vercel Pro ($20/month)
- Backend: Railway or DigitalOcean ($20-50/month)
- Database: Vercel Postgres or AWS RDS ($50-100/month)
- Email: SendGrid Essentials ($19.95/month)
- Storage: AWS S3 (Pay per use)

---

## 📝 Environment Variables Summary

### Backend (18 variables)
Required: `DATABASE_URL`, `APP_NAME`, `SMTP_*` (4), Client URLs (4), `HASH_SECRET`, `STRIPE_SECRET_KEY`, `MUX_*` (2), `AWS_*` (4)

### Frontend
**Landing Page**: `NEXT_PUBLIC_SERVER_URI`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  
**Other Dashboards**: `NEXT_PUBLIC_SERVER_URI`

See [ENV_VARIABLES_REFERENCE.md](./ENV_VARIABLES_REFERENCE.md) for complete details.

---

## ✅ Pre-Deployment Checklist

### Required Accounts
- [ ] GitHub (version control)
- [ ] Vercel (frontend hosting)
- [ ] Railway or Render (backend hosting)
- [ ] Database provider (Neon, Railway, or Vercel Postgres)
- [ ] Stripe (payment processing)
- [ ] SendGrid or Mailgun (email)
- [ ] AWS or Cloudflare (file storage)
- [ ] Mux (video hosting)

### Required Information
- [ ] Database connection string
- [ ] SMTP credentials
- [ ] Stripe API keys (secret and publishable)
- [ ] AWS S3 credentials and bucket name
- [ ] Mux API credentials
- [ ] Hash secret (generate with: `openssl rand -base64 32`)

---

## 🔒 Security Considerations

### Environment Variables
- ✅ Use environment variables for all secrets
- ✅ Never commit `.env` files to Git
- ✅ Use different keys for development and production
- ✅ Rotate secrets periodically

### Database
- ✅ Use SSL connections in production
- ✅ Enable automatic backups
- ✅ Restrict database access by IP when possible
- ✅ Use strong passwords

### API Keys
- ✅ Use Stripe test keys during development
- ✅ Restrict API key permissions to minimum required
- ✅ Monitor API usage for anomalies
- ✅ Set up webhook signature verification

### Application
- ✅ Enable CORS only for trusted domains in production
- ✅ Implement rate limiting on sensitive endpoints
- ✅ Use HTTPS for all environments
- ✅ Keep dependencies updated

---

## 📈 Monitoring and Maintenance

### Health Checks
- Backend: `https://your-backend.railway.app/` (should return 404, not error)
- Database: Check connection in Prisma Studio
- Frontend: Check all 4 URLs load correctly

### Log Monitoring
- **Railway**: Dashboard → Service → Deployments → Logs
- **Vercel**: Dashboard → Project → Deployments → Function Logs
- **Database**: Check slow query logs

### Backup Schedule
- Daily automated backups (enabled by default on most providers)
- Weekly manual backup verification
- Monthly backup restore test

### Update Schedule
- Weekly: Check for security updates
- Monthly: Update dependencies
- Quarterly: Review and optimize database

---

## 🆘 Support Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [GraphQL Docs](https://graphql.org/learn/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)

### Community
- [NestJS Discord](https://discord.gg/nestjs)
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Slack](https://slack.prisma.io/)

### Service Support
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- Stripe: https://support.stripe.com/
- AWS: https://aws.amazon.com/support/

---

## 🎯 Getting Started

**New to deployment?**  
→ Start with [QUICK_START.md](./QUICK_START.md)

**Need detailed instructions?**  
→ Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Managing your database?**  
→ Check [DATABASE_MANAGEMENT.md](./DATABASE_MANAGEMENT.md)

**Looking for specific variables?**  
→ See [ENV_VARIABLES_REFERENCE.md](./ENV_VARIABLES_REFERENCE.md)

---

## 📞 Questions?

This documentation covers the most common scenarios and questions. If you encounter issues:

1. Check the troubleshooting sections in each guide
2. Review service provider documentation
3. Check application logs
4. Verify environment variables are set correctly
5. Ensure all migrations are applied

---

## 🎉 Success Metrics

After deployment, you should have:
- ✅ 4 live frontend applications
- ✅ 1 backend API running
- ✅ PostgreSQL database connected
- ✅ Email sending working
- ✅ File uploads functional
- ✅ Video streaming operational
- ✅ Payment processing enabled
- ✅ User registration and login working

**Congratulations on deploying your LMS! 🚀**

---

**Last Updated**: 2025-11-08  
**Version**: 1.0  
**Application**: Owl Learner LMS
