# Database Management Guide

This guide explains how to manage, access, and interact with your PostgreSQL database for the Owl Learner LMS.

## Quick Access Methods

### 1. Prisma Studio (Easiest - Built-in GUI)

**Best for**: Quick data viewing and editing

```bash
# Navigate to server directory
cd server

# Start Prisma Studio
npx prisma studio
```

Opens at: `http://localhost:5555`

**Features**:
- Visual interface for all tables
- Create, read, update, delete records
- Filter and search functionality
- Relationship navigation

### 2. Using Database Provider Dashboards

#### Vercel Postgres
1. Go to https://vercel.com/dashboard
2. Select your project → Storage tab
3. Click on your database
4. Use "Query" tab to run SQL
5. Use "Data" tab to browse tables

#### Neon
1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Write and execute SQL queries
5. Browse tables in left sidebar

#### Supabase
1. Go to https://app.supabase.com
2. Select your project
3. Click "Table Editor" for visual editing
4. Click "SQL Editor" for custom queries

#### Railway
1. Go to https://railway.app/dashboard
2. Select your PostgreSQL service
3. Click "Query" tab
4. Run SQL commands directly

### 3. Desktop Database Tools

#### pgAdmin (PostgreSQL Official GUI)

**Download**: https://www.pgadmin.org/download/

**Setup**:
1. Install pgAdmin
2. Open application
3. Right-click "Servers" → Register → Server
4. General tab: Enter a name (e.g., "Owl Learner Production")
5. Connection tab:
   - Parse your DATABASE_URL: `postgresql://username:password@host:port/database`
   - Host: The host part from URL
   - Port: Usually 5432
   - Database: Database name from URL
   - Username: Username from URL
   - Password: Password from URL
6. Click "Save"

**Features**:
- Full PostgreSQL management
- Query tool with syntax highlighting
- Visual query builder
- Backup and restore
- Performance monitoring

#### DBeaver (Universal Database Tool)

**Download**: https://dbeaver.io/download/

**Setup**:
1. Install DBeaver
2. Click "New Database Connection" (plug icon)
3. Select "PostgreSQL"
4. Enter connection details from your DATABASE_URL
5. Test connection
6. Click "Finish"

**Features**:
- Multi-database support
- ER diagrams
- SQL editor with autocomplete
- Data export/import
- Schema comparison

#### TablePlus (Mac/Windows/Linux)

**Download**: https://tableplus.com/

**Setup**:
1. Install TablePlus
2. Click "Create a new connection"
3. Select PostgreSQL
4. Enter connection details
5. Test and save

**Features**:
- Beautiful, modern interface
- Fast and lightweight
- Multiple tabs
- SSH tunnel support
- Data filtering

### 4. Command Line (psql)

**For developers comfortable with terminal**

#### Installation

**Mac**:
```bash
brew install postgresql
```

**Ubuntu/Debian**:
```bash
sudo apt-get install postgresql-client
```

**Windows**:
Download from https://www.postgresql.org/download/windows/

#### Connect to Database

```bash
# Using full connection string
psql "postgresql://username:password@host:port/database"

# Or with individual parameters
psql -h host -p 5432 -U username -d database
```

#### Common Commands

```sql
-- List all tables
\dt

-- Describe a table structure
\d table_name

-- List all databases
\l

-- Switch database
\c database_name

-- View all users
SELECT * FROM "Student";

-- Count records
SELECT COUNT(*) FROM "Course";

-- Exit
\q
```

## Common Database Operations

### View All Students
```sql
SELECT id, name, email, "joinedAt", status 
FROM "Student" 
ORDER BY "joinedAt" DESC 
LIMIT 10;
```

### View All Courses
```sql
SELECT id, title, price, status, "createdAt"
FROM "Course"
ORDER BY "createdAt" DESC;
```

### View Course Enrollments
```sql
SELECT 
  s.name as student_name,
  c.title as course_title,
  sc.status,
  sc."createdAt" as enrolled_at
FROM "StudentCourse" sc
JOIN "Student" s ON sc."studentId" = s.id
JOIN "Course" c ON sc."courseId" = c.id
ORDER BY sc."createdAt" DESC;
```

### View Sales Analytics
```sql
SELECT 
  DATE(cs."createdAt") as sale_date,
  COUNT(*) as total_sales,
  SUM(cs.price) as total_revenue
FROM "CourseSale" cs
GROUP BY DATE(cs."createdAt")
ORDER BY sale_date DESC
LIMIT 30;
```

### View Teacher Earnings
```sql
SELECT 
  t.name as teacher_name,
  te.earn as total_earned,
  te.withdraw as total_withdrawn,
  (te.earn - te.withdraw) as current_balance
FROM "TeacherEarning" te
JOIN "Teacher" t ON te."teacherId" = t.id
ORDER BY te.earn DESC;
```

### Find Active Courses
```sql
SELECT 
  c.title,
  t.name as teacher_name,
  c.price,
  COUNT(sc.id) as enrollments
FROM "Course" c
JOIN "Teacher" t ON c."teacherId" = t.id
LEFT JOIN "StudentCourse" sc ON c.id = sc."courseId"
WHERE c.status = 'live'
GROUP BY c.id, c.title, t.name, c.price
ORDER BY enrollments DESC;
```

## Database Backup and Restore

### Backup Database

#### Using pg_dump (Command Line)
```bash
# Full database backup
pg_dump -h host -U username -d database > backup_$(date +%Y%m%d).sql

# With password prompt
PGPASSWORD=your_password pg_dump -h host -U username database > backup.sql

# Compressed backup
pg_dump -h host -U username database | gzip > backup.sql.gz
```

#### Using pgAdmin
1. Right-click on your database
2. Select "Backup..."
3. Choose filename and format
4. Click "Backup"

#### Using Provider Tools
- **Vercel**: Automatic backups (no action needed)
- **Neon**: Automatic point-in-time recovery
- **Supabase**: Dashboard → Database → Backups
- **Railway**: Dashboard → Database → Backups

### Restore Database

#### Using psql
```bash
# Restore from backup file
psql -h host -U username -d database < backup.sql

# From compressed backup
gunzip < backup.sql.gz | psql -h host -U username -d database
```

#### Using pgAdmin
1. Right-click on your database
2. Select "Restore..."
3. Choose backup file
4. Click "Restore"

## Database Migrations

### Create New Migration

When you modify the Prisma schema:

```bash
cd server

# Create migration
npx prisma migrate dev --name describe_your_changes

# Example: Add new field to Student model
npx prisma migrate dev --name add_phone_to_student
```

### Apply Migrations to Production

```bash
# Deploy pending migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### View Migration Status

```bash
# Check which migrations have been applied
npx prisma migrate status
```

### Reset Database (Development Only!)

```bash
# ⚠️ WARNING: This deletes all data!
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script
```

## Seeding Initial Data

Your project includes a seed script for initial data.

### Run Seed Script

```bash
cd server

# Run the seed
npx prisma db seed
```

### Modify Seed Data

Edit: `/workspace/server/prisma/seed.ts`

```typescript
// Example: Add admin user
await prisma.admin.create({
  data: {
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    status: "active"
  }
});
```

## Database Security Best Practices

### 1. Use Environment Variables
Never hardcode database credentials:
```bash
# Good
DATABASE_URL="${DATABASE_URL}"

# Bad
DATABASE_URL="postgresql://user:pass@host/db"
```

### 2. Use Connection Pooling
For serverless environments (Vercel, Railway):
```
postgresql://user:pass@host/db?pgbouncer=true&connection_limit=1
```

### 3. Restrict Database Access
- Whitelist only necessary IPs
- Use SSL/TLS connections
- Create read-only users for reporting

### 4. Regular Backups
- Enable automatic backups on your provider
- Test restore process periodically
- Keep backups in multiple locations

### 5. Monitor Database Performance
```sql
-- Find slow queries
SELECT 
  query, 
  calls, 
  mean_exec_time, 
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Connection Timeout
```bash
# Increase connection timeout
DATABASE_URL="postgresql://user:pass@host/db?connect_timeout=30"
```

### Too Many Connections
```bash
# Use connection pooling
DATABASE_URL="postgresql://user:pass@host/db?connection_limit=5&pool_timeout=20"
```

### SSL Required
```bash
# Add SSL mode
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

### Migration Failed
```bash
# Mark migration as applied (if you manually fixed it)
npx prisma migrate resolve --applied migration_name

# Mark as rolled back
npx prisma migrate resolve --rolled-back migration_name
```

## Database Schema Reference

Your database includes these main entities:

- **Users**: Admin, Student, Teacher, Organization
- **Courses**: Course, CourseSection, CourseContent
- **Learning**: StudentCourse, QuizPoint, AssignmentPoint
- **Commerce**: Invoice, CourseSale, Coupon
- **Social**: Post, Comment, Like, Follow
- **Support**: Ticket, TicketMessage
- **Payments**: TeacherEarning, OrganizationEarning, PaymentInvoice
- **Media**: Upload (file references)
- **Notifications**: Notification, SenderReceiver

For detailed schema, see: `/workspace/server/prisma/schema.prisma`

## Useful SQL Queries

### Dashboard Statistics
```sql
-- Total users
SELECT 
  'Students' as type, COUNT(*) as count FROM "Student"
UNION ALL
SELECT 'Teachers', COUNT(*) FROM "Teacher"
UNION ALL
SELECT 'Organizations', COUNT(*) FROM "Organization";

-- Revenue this month
SELECT SUM(price) as monthly_revenue
FROM "Invoice"
WHERE "orderedAt" >= DATE_TRUNC('month', CURRENT_DATE);

-- Popular courses
SELECT 
  c.title,
  COUNT(sc.id) as enrollments,
  AVG(cr.rating) as avg_rating
FROM "Course" c
LEFT JOIN "StudentCourse" sc ON c.id = sc."courseId"
LEFT JOIN "CourseReview" cr ON sc.id = cr."studentCourseId"
GROUP BY c.id, c.title
ORDER BY enrollments DESC
LIMIT 10;
```

### Data Cleanup
```sql
-- Delete unverified users older than 30 days
DELETE FROM "Student"
WHERE verified = false 
AND "joinedAt" < NOW() - INTERVAL '30 days';

-- Remove expired tokens
DELETE FROM "Token"
WHERE "createdAt" < NOW() - INTERVAL '24 hours';
```

## Getting Help

- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Studio**: https://www.prisma.io/studio
- **Database Provider Support**: Check your provider's documentation

---

**Pro Tip**: For production, always test database operations in a development/staging environment first!
