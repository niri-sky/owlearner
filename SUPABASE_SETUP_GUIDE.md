# Supabase Setup Guide for Owl Learner LMS

## 🎯 Quick Answer

**You DON'T need SQL files!** This project uses **Prisma ORM**, which automatically generates and runs all SQL migrations for you. You just need to:

1. Get Supabase connection string
2. Set it as `DATABASE_URL`
3. Run `npx prisma migrate dev` or `npx prisma db push`
4. Done! ✅

---

## 📋 Step-by-Step Setup

### Step 1: Create Supabase Project (3 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: `owl-learner-lms` (or your choice)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (includes 500MB database, 2GB bandwidth)
6. Click "Create new project"
7. Wait 2-3 minutes for provisioning

### Step 2: Get Database Connection String (1 minute)

1. In your Supabase project dashboard
2. Click **Settings** (gear icon in left sidebar)
3. Click **Database**
4. Scroll to **Connection string** section
5. Select **Connection pooling** tab (important for serverless!)
6. Mode: **Transaction**
7. Copy the connection string

**It will look like:**
```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Replace `[YOUR-PASSWORD]` with your actual database password!**

### Step 3: Set Environment Variable

#### For Local Development

Create or edit `/workspace/server/.env`:

```bash
cd /workspace/server

# Create .env file if it doesn't exist
cat > .env << 'EOF'
# Supabase Database
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Other variables (add as needed)
APP_NAME="Owl Learner"
HASH_SECRET="your-secret-key"
# ... etc
EOF
```

**Or manually:**
```bash
# Edit .env file
nano /workspace/server/.env

# Add this line:
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

#### For Production (Railway/Render/etc.)

Add the `DATABASE_URL` environment variable in your hosting dashboard:
- **Railway**: Dashboard → Service → Variables → Add Variable
- **Render**: Dashboard → Environment → Add Environment Variable
- **Vercel**: (Backend can't run on Vercel)

### Step 4: Generate Prisma Client (30 seconds)

```bash
cd /workspace/server

# Install dependencies (if not already done)
npm install

# Generate Prisma Client from schema
npx prisma generate
```

This reads your `schema.prisma` and generates TypeScript types.

### Step 5: Create Database Tables (1 minute)

You have **two options**:

#### Option A: Using Prisma Migrate (Recommended for Production)

```bash
cd /workspace/server

# Create and apply migrations
npx prisma migrate dev --name initial_setup
```

**What this does:**
- Creates a `migrations` folder with SQL
- Runs the SQL to create all tables
- Tracks migration history

**You'll see output like:**
```
Applying migration `20241108000000_initial_setup`
✔ Generated Prisma Client
```

#### Option B: Using Prisma DB Push (Quick for Development)

```bash
cd /workspace/server

# Push schema directly to database
npx prisma db push
```

**What this does:**
- Creates all tables immediately
- No migration files created
- Good for rapid prototyping
- **Use this if you just want to test quickly!**

**You'll see output like:**
```
🚀  Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

### Step 6: Verify Tables Were Created (30 seconds)

#### Method 1: Using Prisma Studio (Visual GUI)

```bash
cd /workspace/server
npx prisma studio
```

Opens browser at `http://localhost:5555` where you can see all tables!

#### Method 2: Using Supabase Table Editor

1. Go to your Supabase dashboard
2. Click **Table Editor** (table icon in sidebar)
3. You should see all your tables:
   - Admin
   - Student
   - Teacher
   - Organization
   - Course
   - Invoice
   - CourseSale
   - TeacherEarning
   - ... and many more (50+ tables total!)

#### Method 3: Using SQL Editor

1. In Supabase dashboard, click **SQL Editor**
2. Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see **50+ tables** listed!

### Step 7: Seed Initial Data (Optional, 1 minute)

```bash
cd /workspace/server

# Run seed script to populate initial data
npx prisma db seed
```

**What this does:**
- Runs `/workspace/server/prisma/seed.ts`
- Creates sample data (if configured)
- Good for testing

**Check the seed file first:**
```bash
cat /workspace/server/prisma/seed.ts
```

If you see actual seed data, run it. If it's empty, skip this step.

### Step 8: Test Connection from Your App

```bash
cd /workspace/server

# Start the backend server
npm run start:dev
```

**You should see:**
```
[Nest] 12345  - Application successfully started
[Nest] 12345  - GraphQL playground: http://localhost:4000/graphql
```

**No database errors = Success! ✅**

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"

**Possible causes:**

**1. Wrong connection string**
- Double-check you copied the full string
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Check for typos

**2. Forgot to use Connection Pooling**
- Go to Supabase → Settings → Database
- Use the **Connection pooling** tab (not "Connection string")
- Mode: Transaction
- Port should be **6543** (not 5432)

**3. IP whitelist** (unlikely with Supabase)
- Supabase allows all IPs by default
- Check if you have any firewall rules

**Fix:**
```bash
# Test connection manually
psql "postgresql://postgres.xxxxx:password@host:6543/postgres"

# If that works, your DATABASE_URL is correct
```

### Error: "SSL connection required"

Add `?sslmode=require` to your connection string:

```env
DATABASE_URL="postgresql://postgres.xxxxx:password@host:6543/postgres?sslmode=require"
```

### Error: "Prisma schema not found"

Make sure you're in the right directory:

```bash
cd /workspace/server

# Should see schema.prisma
ls prisma/schema.prisma
```

### Error: "Password authentication failed"

Your password is wrong! Get a new one:

1. Supabase Dashboard → Settings → Database
2. Click **Reset Database Password**
3. Copy new password
4. Update your `DATABASE_URL`

### Error: "Too many connections"

You're using direct connection instead of pooling:

**Wrong (Direct Connection - Port 5432):**
```
postgresql://postgres:password@host:5432/postgres
```

**Correct (Connection Pooling - Port 6543):**
```
postgresql://postgres:password@host:6543/postgres
```

Use the **Connection pooling** string from Supabase!

### Tables not appearing in Supabase Table Editor

**Check if they were created:**
```bash
npx prisma studio
```

If you see tables in Prisma Studio but not in Supabase, refresh the page.

**Or check with SQL:**
```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM "Student";
```

If this works, tables exist!

---

## 🎨 Supabase Features You Can Use

### 1. Table Editor (Visual Database)

- View all data visually
- Add/edit/delete records
- Filter and search
- No SQL needed!

**Access:** Supabase Dashboard → Table Editor

### 2. SQL Editor

- Run custom queries
- Create functions
- Manage indexes
- Export results

**Access:** Supabase Dashboard → SQL Editor

**Useful queries:**

```sql
-- Count all students
SELECT COUNT(*) FROM "Student";

-- View recent course sales
SELECT * FROM "CourseSale" ORDER BY "createdAt" DESC LIMIT 10;

-- Check teacher earnings
SELECT 
  t.name,
  te.earn,
  te.withdraw,
  (te.earn - te.withdraw) as available
FROM "Teacher" t
LEFT JOIN "TeacherEarning" te ON t.id = te."teacherId";
```

### 3. Database Backups

**Automatic backups** (Free plan):
- Daily backups for 7 days
- Point-in-time recovery

**Manual backup:**
1. Dashboard → Settings → Database
2. Scroll to "Backups"
3. Click "Backup now"

### 4. Database Logs

Monitor all queries:
1. Dashboard → Logs
2. Select "Postgres Logs"
3. See all SQL queries in real-time

### 5. Connection Pooler

Already using it! Prevents connection limits on serverless deployments.

---

## 📊 Expected Database Structure

After running migrations, you'll have these tables:

**User Management:**
- `Admin` - System administrators
- `Student` - Course learners  
- `Teacher` - Course instructors
- `Organization` - Multi-teacher organizations
- `SenderReceiver` - Notification user references
- `Token` - Auth tokens

**Courses:**
- `Course` - Main course table
- `CourseSection` - Course chapters
- `CourseContent` - Lectures/videos
- `CourseContentLink` - Resource links
- `CourseContentQuiz` - Quiz questions
- `CourseResourse` - Downloadable resources
- `CourseAssignment` - Homework
- `CourseReview` - Student reviews

**Learning Progress:**
- `StudentCourse` - Enrollments
- `StudentQuizPoint` - Quiz scores
- `StudentAssignmentPoint` - Assignment grades
- `QuestionAndAnswer` - Q&A for lectures

**E-Commerce:**
- `Invoice` - Purchase records
- `CourseSale` - Individual sales
- `Coupon` - Discount codes
- `CouponUsed` - Used coupon tracking

**Earnings:**
- `TeacherEarning` - Teacher balance
- `OrganizationEarning` - Organization balance
- `PaymentInvoice` - Withdrawal requests

**Social:**
- `Post` - User posts
- `Comment` - Comments (nested)
- `PostLike` - Post likes
- `FollowingFollower` - User connections
- `Link` - Social media links

**Support:**
- `Ticket` - Support tickets
- `TicketMessage` - Ticket conversations

**Other:**
- `Category`, `SubCategory`, `Topic` - Course categorization
- `Notification` - User notifications
- `Todo` - Admin todos
- `Upload` - File references

**Total: 50+ tables!**

---

## 🔐 Security Best Practices

### 1. Use Connection Pooling

✅ Always use the **pooled connection** (port 6543)

```
postgresql://user:pass@host:6543/postgres  ✅ Pooled
postgresql://user:pass@host:5432/postgres  ❌ Direct
```

### 2. Environment Variables Only

❌ Never hardcode connection strings:
```typescript
// BAD
const url = "postgresql://postgres:password@...";
```

✅ Always use environment variables:
```typescript
// GOOD
const url = process.env.DATABASE_URL;
```

### 3. Strong Database Password

Use Supabase's generated password or:
```bash
# Generate strong password
openssl rand -base64 32
```

### 4. Enable Row Level Security (Optional)

For extra security with direct Supabase client access:

```sql
-- In Supabase SQL Editor
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;

-- Create policies as needed
```

**Note:** Your app uses Prisma, so RLS isn't required. It's useful if you add Supabase client-side SDK later.

### 5. Regular Backups

Enable automatic backups:
1. Supabase Dashboard → Settings → Database
2. Backups section → Enable daily backups

---

## 💰 Supabase Pricing

### Free Tier (Perfect for Development/MVP)
- ✅ 500 MB database
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users
- ✅ 500 MB file storage
- ✅ Unlimited API requests
- ✅ Daily backups (7 days retention)

### When to Upgrade (Pro - $25/month)
- Need > 500 MB database (gets 8 GB)
- Need > 2 GB bandwidth (gets 50 GB)
- Want more backup retention (14 days)
- Need point-in-time recovery

**For most MVPs, free tier is plenty!**

---

## 🚀 Complete Setup Commands (Copy-Paste)

```bash
# 1. Navigate to server folder
cd /workspace/server

# 2. Install dependencies (if needed)
npm install

# 3. Create .env file with Supabase URL
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
APP_NAME="Owl Learner"
HASH_SECRET="change-this-to-random-string"
EOF

# 4. Generate Prisma Client
npx prisma generate

# 5. Create database tables
npx prisma db push

# 6. (Optional) Seed data
npx prisma db seed

# 7. Open Prisma Studio to verify
npx prisma studio

# 8. Start backend server
npm run start:dev
```

**That's it! Your database is ready! 🎉**

---

## 📝 Next Steps After Database Setup

1. **Start Backend:**
   ```bash
   cd /workspace/server
   npm run start:dev
   ```

2. **Create Admin User:**
   - Use Prisma Studio: `npx prisma studio`
   - Or Supabase Table Editor
   - Add a record to `Admin` table (hash password first!)

3. **Deploy Backend:**
   - See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Railway, Render, or Heroku
   - Add `DATABASE_URL` to deployment env vars

4. **Connect Frontend:**
   - Set `NEXT_PUBLIC_SERVER_URI` in frontend apps
   - Deploy to Vercel

5. **Test Complete Flow:**
   - Register as student
   - Create course as teacher
   - Purchase course
   - Verify in database

---

## 🆘 Still Having Issues?

### Check Connection String Format

**Correct format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Example:**
```
postgresql://postgres.abcd1234:myP@ssw0rd!@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Common mistakes:**
- Missing password
- Wrong port (should be 6543 for pooling)
- Special characters in password not URL-encoded
- Extra spaces

### URL Encode Special Characters in Password

If password has special characters like `@`, `#`, `%`:

```bash
# Example password: P@ssw0rd!
# URL encoded: P%40ssw0rd%21

DATABASE_URL="postgresql://postgres.abcd:P%40ssw0rd%21@host:6543/postgres"
```

**Character encoding:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `!` → `%21`
- `$` → `%24`

### Test Connection Manually

```bash
# Try connecting with psql
psql "postgresql://postgres.xxxxx:password@host:6543/postgres"

# If it works, your connection string is correct!
# If not, check password and host
```

### View Prisma SQL Queries

```bash
# Enable query logging
DATABASE_URL="..." npx prisma db push --print-queries

# This shows the SQL being executed
```

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Connection Pooling**: https://supabase.com/docs/guides/database/connection-pooling

---

## ✅ Success Checklist

- [ ] Created Supabase project
- [ ] Copied connection pooling string (port 6543)
- [ ] Set `DATABASE_URL` in `.env`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push` or `npx prisma migrate dev`
- [ ] Verified tables in Prisma Studio or Supabase Table Editor
- [ ] Backend server starts without errors
- [ ] Can query data via GraphQL

**All checked? You're ready to go! 🚀**
