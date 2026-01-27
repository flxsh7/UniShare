# UniShare Deployment Checklist

## Pre-Deployment
- [x] Test all features locally
- [x] Database schema deployed to Supabase
- [x] All environment variables documented
- [ ] Git repository initialized
- [ ] Code pushed to GitHub

## Backend Deployment (Railway)
- [ ] Create Railway account
- [ ] Create new project from GitHub
- [ ] Configure root directory: `server`
- [ ] Set start command: `npm start`
- [ ] Add all environment variables
- [ ] Generate domain
- [ ] Test backend health endpoint
- [ ] Save backend URL

## Frontend Deployment (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure root directory: `client`
- [ ] Set build command: `npm run build`
- [ ] Add environment variables:
  - VITE_CLERK_PUBLISHABLE_KEY
  - VITE_API_URL (Railway URL)
- [ ] Deploy
- [ ] Save frontend URL

## Post-Deployment Configuration
- [ ] Update CORS in backend with Vercel URL
- [ ] Push CORS update to GitHub
- [ ] Update Clerk dashboard with production URLs
- [ ] Test sign up/sign in
- [ ] Test file upload
- [ ] Test file download
- [ ] Test admin features

## Production Testing
- [ ] Create test account
- [ ] Upload test document
- [ ] Filter and search
- [ ] Download document
- [ ] Delete document
- [ ] Check error handling
- [ ] Monitor Railway logs
- [ ] Monitor Vercel logs

## Optional Enhancements
- [ ] Set up custom domain
- [ ] Configure error tracking
- [ ] Add analytics
- [ ] Set up monitoring
- [ ] Create database backups

## URLs to Save
- Frontend: ___________________________
- Backend: ___________________________
- Database: (Supabase - already configured)
- Clerk Dashboard: https://dashboard.clerk.com
