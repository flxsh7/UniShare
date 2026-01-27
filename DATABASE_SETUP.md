# Database Setup Guide

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your UniShare project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the Schema

1. Copy the entire contents of `server/src/database/schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** button (or press Ctrl+Enter)

## Step 3: Verify Setup

After running the schema, you should see:
- ✅ 3 tables created: `departments`, `semesters`, `documents`
- ✅ 5 default departments inserted (CSE, ECE, EE, ME, CE)
- ✅ 40 semesters created (8 semesters × 5 departments)

## Step 4: Verify in Supabase

1. Go to **Table Editor** in Supabase
2. You should see the three tables listed
3. Click on `departments` - you should see 5 rows
4. Click on `semesters` - you should see 40 rows

## Troubleshooting

**If you get an error about UUID extension:**
- This is normal on first run, the script handles it

**If tables already exist:**
- The script uses `IF NOT EXISTS` so it's safe to run multiple times

**If you need to reset the database:**
```sql
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
```
Then run the schema.sql again.

## Next Steps

Once the database is set up, you can start the application!
