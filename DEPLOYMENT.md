# NIOT Oceanic Monitor - Vercel Deployment Guide

## Overview

This application is configured for deployment on Vercel with:

- **Frontend**: Angular 17 static site (hosted on Vercel)
- **Backend**: Serverless API functions (hosted on Vercel)
- **Demo Mode**: All data uses mock oceanographic data for instant functionality

## Deployment Steps

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Create a GitHub Repository

The easiest way to deploy to Vercel is through GitHub:

1. **Create a GitHub Account** (if you don't have one):
   - Go to https://github.com/signup

2. **Create a New Repository**:
   - Name: `niot-oceanic-monitor` (or your preferred name)
   - Make it **Public**
   - Do NOT initialize with README (you already have one)

3. **Push Your Code to GitHub**:

```bash
cd c:\Users\minim\OneDrive\Desktop\niot-final-fixed_3\niot-final-fixed

git init
git add .
git commit -m "Initial NIOT Oceanic Monitor deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/niot-oceanic-monitor.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit https://vercel.com

2. **Sign Up / Log In**:
   - Click "Sign Up" or "Log In"
   - Choose "GitHub" as the authentication method
   - Authorize Vercel to access your GitHub account

3. **Import Your Project**:
   - Click "Add New..." → "Project"
   - Select your `niot-oceanic-monitor` repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Click "Deploy"

4. **Wait for Deployment**:
   - Vercel will build and deploy automatically
   - You'll see a unique URL like: `https://niot-oceanic-monitor.vercel.app`

#### Option B: Using Vercel CLI

```bash
vercel

# Follow the prompts:
# 1. Enter your Vercel credentials
# 2. Link to your GitHub project
# 3. Confirm project settings
# 4. Deploy!
```

### Step 4: Configure Custom Domain (Optional)

If you have a custom domain:

1. Go to your project settings on Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Project Structure

```
project-root/
├── api/                          # Serverless API routes
│   ├── index.js                 # API root endpoint
│   ├── health.js               # Health check endpoint
│   ├── stations.js             # Get all stations
│   ├── stations/[key].js       # Get single station by key
│   └── stations/[key]/
│       └── pressure-history.js # Get pressure history
│
├── frontend/                    # Angular application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── proxy.conf.json
│
├── backend/                     # Local backend (reference only)
├── vercel.json                  # Vercel configuration
├── .vercelignore               # Files to exclude from deployment
└── README.md
```

## API Endpoints

All endpoints are available at your Vercel domain:

- **Root**: `https://your-app.vercel.app/api/`
- **Health Check**: `https://your-app.vercel.app/api/health`
- **All Stations**: `https://your-app.vercel.app/api/stations`
- **Single Station**: `https://your-app.vercel.app/api/stations/CHENNAI_AWS`
- **Pressure History**: `https://your-app.vercel.app/api/stations/CHENNAI_AWS/pressure-history`

### Example Requests

```bash
# Get all stations
curl https://your-app.vercel.app/api/stations

# Get MUMBAI_AWS station data
curl https://your-app.vercel.app/api/stations/MUMBAI_AWS

# Get pressure history for a station
curl https://your-app.vercel.app/api/stations/VIZAG_AWS/pressure-history
```

## Available Stations

- CHENNAI_AWS (Chennai, India)
- MUMBAI_AWS (Mumbai, India)
- VIZAG_AWS (Visakhapatnam, India)
- KOCHI_AWS (Kochi, India)
- ANDAMAN_AWS (Andaman Islands, India)

## Features in Demo Mode

✅ Real-time oceanographic data from 5 coastal stations  
✅ Air temperature, humidity, pressure monitoring  
✅ Wind speed, direction, and gust measurements  
✅ Solar radiation (shortwave & longwave) data  
✅ Rainfall and battery voltage monitoring  
✅ GPS signal strength tracking  
✅ Interactive dashboard with:

- Station selector
- Live data cards
- Air pressure trend chart
- Wind speed monitor
- Wind compass rose
- Station network map

## Troubleshooting

### Build Fails

**Error**: "frontend/dist/niot-frontend not found"

**Solution**: The Angular build creates output in `dist/niot-frontend/`. If this fails:

1. Test locally: `cd frontend && npm run build`
2. Check Angular version compatibility
3. Review build logs on Vercel dashboard

### API Returns 404

**Error**: "Cannot find module"

**Solution**:

1. Ensure `api/` folder exists in project root
2. Check file naming (Vercel is case-sensitive on Linux)
3. Rebuild: push changes to GitHub → Vercel auto-deploys

### CORS Issues

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: All API endpoints include CORS headers. If issues persist:

1. Check browser console for exact error
2. Ensure you're using the correct domain
3. Clear browser cache and try again

### Slow Cold Starts

**Note**: First request to serverless functions may take 5-10 seconds. Subsequent requests are faster.

## Production Deployment Tips

1. **Environment Variables**: For real database connectivity:
   - Create `.env.production` file
   - Add secrets in Vercel dashboard
   - Update `api/` handlers to use environment variables

2. **Database Integration**:
   - Replace mock data with real SQL Server queries
   - Update connection strings in API handlers
   - Test all endpoints before deploying

3. **Monitoring**:
   - Enable Vercel Analytics
   - Monitor function execution times
   - Set up error alerts

4. **Performance**:
   - Enable caching for static assets
   - Optimize API response sizes
   - Consider adding CDN

## Rollback/Updates

To update your deployment:

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main

# Vercel automatically rebuilds and deploys!
```

## Support

For Vercel support: https://vercel.com/support
For Angular issues: https://angular.io/guide/deployment

---

**Deployed Successfully?** 🎉

Share your live URL and start monitoring oceanic weather in real-time!
