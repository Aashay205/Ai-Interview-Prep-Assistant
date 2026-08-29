# Complete Deployment Guide

## Phase 1: Pre-Deployment Preparation (Local)

### 1. Generate Production Secrets

**Windows PowerShell:**
```powershell
# Generate JWT_SECRET
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
Write-Host "JWT_SECRET: $secret"
```

**macOS/Linux:**
```bash
openssl rand -hex 32
```

**Save these values** - you'll need them when setting up your hosting platform.

### 2. Prepare Environment Files

**Backend - Create `.env` file:**
```
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-frontend-domain.com
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-ai
JWT_SECRET=your-generated-secret-here
GOOGLE_GENAI_API_KEY=your-api-key-here
```

**Frontend - Create `.env.production` file:**
```
VITE_API_URL=https://your-backend-api-domain.com
```

### 3. Local Testing

Before deploying, test the production build locally:

```bash
# Build frontend
cd Frontend
npm run build
npm run preview  # Preview production build locally

# In another terminal, start backend
cd Backend
NODE_ENV=production npm start
```

Test all features:
- [ ] Register new user
- [ ] Login
- [ ] Upload resume and generate report
- [ ] Generate report with self-description only
- [ ] View report page
- [ ] Download PDF
- [ ] Run mock interview
- [ ] Logout

---

## Phase 2: Backend Deployment

### Option A: Deploy to Heroku (Easiest)

**Prerequisites:**
- Heroku account (free tier available)
- Heroku CLI installed

**Steps:**

```bash
# 1. Login to Heroku
heroku login

# 2. Create a new app
heroku create your-app-name

# 3. Add MongoDB addon (free tier)
heroku addons:create mongolab:sandbox --app your-app-name

# 4. Set environment variables
heroku config:set NODE_ENV=production --app your-app-name
heroku config:set JWT_SECRET=your-secret --app your-app-name
heroku config:set GOOGLE_GENAI_API_KEY=your-api-key --app your-app-name
heroku config:set CLIENT_URL=https://your-frontend-domain.com --app your-app-name

# 5. Deploy from Backend directory
cd Backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main

# 6. Check logs
heroku logs --tail --app your-app-name
```

**After Deployment:**
- Heroku provides URL: `https://your-app-name.herokuapp.com`
- Use this as your `VITE_API_URL` in frontend

---

### Option B: Deploy to Render (Recommended - Free)

**Prerequisites:**
- Render account (https://render.com)
- GitHub account with code pushed

**Steps:**

```bash
# 1. Push code to GitHub
cd Backend
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to https://render.com/dashboard
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `interview-ai-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for better uptime)

6. Add environment variables in Render dashboard:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secret
   GOOGLE_GENAI_API_KEY=your-api-key
   CLIENT_URL=https://your-frontend-domain.com
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/interview-ai
   ```

7. Deploy and copy the URL: `https://your-app-name.onrender.com`

---

### Option C: Deploy to Railway.app

**Prerequisites:**
- Railway account (https://railway.app)
- GitHub connected

**Steps:**

1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set environment variables in Railway dashboard
5. Railway auto-detects `package.json` and runs `npm start`
6. Copy provided URL for frontend configuration

---

### Option D: Self-Hosted (VPS/Server)

**Prerequisites:**
- Linux server with Node.js 18+
- MongoDB instance (cloud or local)
- PM2 for process management

**Steps:**

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Clone repository
git clone https://github.com/your-username/interview-ai.git
cd interview-ai/Backend

# 3. Install dependencies
npm install

# 4. Create .env file
nano .env
# Add all environment variables

# 5. Install PM2 globally
sudo npm install -g pm2

# 6. Start with PM2
pm2 start server.js --name "interview-ai-backend"
pm2 save
pm2 startup

# 7. Setup Nginx reverse proxy (optional but recommended)
# This provides SSL/HTTPS support
```

**Nginx configuration example:**
```nginx
server {
    listen 443 ssl;
    server_name your-api-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Phase 3: Frontend Deployment

### Option A: Deploy to Vercel (Easiest)

**Prerequisites:**
- Vercel account (https://vercel.com)
- GitHub connected

**Steps:**

```bash
# 1. Push code to GitHub
cd Frontend
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to https://vercel.com/dashboard
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** Frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. Add environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

7. Deploy (automatic on push to main)

**Result:** Your app is live at `https://your-app.vercel.app`

---

### Option B: Deploy to Netlify

**Prerequisites:**
- Netlify account (https://netlify.com)
- GitHub connected

**Steps:**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `Frontend/dist`

5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

6. Deploy (automatic on push)

---

### Option C: Deploy to GitHub Pages (Free but limited)

**Note:** Only works if backend is on separate domain.

```bash
cd Frontend

# 1. Update vite.config.js
# Add: base: '/interview-ai/'

# 2. Build
npm run build

# 3. Deploy to gh-pages branch
npm install --save-dev gh-pages
npx gh-pages -d dist
```

Then enable GitHub Pages in repository settings.

---

### Option D: Self-Hosted (Nginx/Apache)

```bash
# 1. Build the app
cd Frontend
npm run build

# 2. Upload dist/ folder to your server
scp -r dist/ user@your-server:/var/www/your-app

# 3. Configure Nginx
```

**Nginx configuration:**
```nginx
server {
    listen 443 ssl;
    server_name your-frontend-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-frontend-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-frontend-domain.com/privkey.pem;

    root /var/www/your-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \.js$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## Phase 4: Post-Deployment Validation

### 1. Smoke Tests

```bash
# Test backend health
curl https://your-backend-domain.com/api/auth/me
# Should return 401 (no token)

# Test CORS
curl -i -X OPTIONS https://your-backend-domain.com/api/auth/register \
  -H "Origin: https://your-frontend-domain.com"
# Should include CORS headers
```

### 2. Full User Flow Test

1. Open frontend URL in browser
2. **Register**: Create new account
   - ✓ Form validation works
   - ✓ Success message appears
3. **Login**: Login with credentials
   - ✓ Redirects to home page
   - ✓ Can access protected routes
4. **Upload Resume**:
   - ✓ Resume upload works
   - ✓ Success feedback appears
5. **Generate Report**:
   - ✓ AI report generates
   - ✓ Report displays correctly
6. **Mock Interview**:
   - ✓ Can answer questions
   - ✓ Feedback appears
7. **Download PDF**:
   - ✓ PDF downloads successfully
8. **Logout**:
   - ✓ Token is invalidated
   - ✓ Redirects to login

### 3. Security Checks

```bash
# Check HTTPS is enforced
curl -i https://your-frontend-domain.com
# Should not have security warnings

# Check environment variables are set
# (Only on your server/hosting platform)
```

---

## Phase 5: Monitoring & Maintenance

### Backend Monitoring

**For Heroku:**
```bash
heroku logs --tail
```

**For self-hosted:**
```bash
pm2 logs interview-ai-backend
```

### Key Metrics to Monitor

- [ ] API response times (target: < 500ms)
- [ ] Error rate (target: < 0.1%)
- [ ] Database connections
- [ ] Memory usage
- [ ] API rate limits (if configured)

### Backup Strategy

```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/interview-ai" \
  --out ./backup

# Restore from backup
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/interview-ai" \
  ./backup/interview-ai
```

---

## Troubleshooting

### Frontend Issues

**Blank page after deployment:**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Check network tab - API calls should go to backend domain

**API 404 errors:**
- Verify `VITE_API_URL` matches backend domain
- Check backend is running and accessible

### Backend Issues

**MongoDB connection fails:**
```
Error: MONGO_URI is required
```
- Verify `MONGO_URI` is set in environment
- Check MongoDB cluster allows connections from your IP

**CORS errors:**
```
Access-Control-Allow-Origin: ...
```
- Verify `CLIENT_URL` matches frontend domain exactly
- Check both HTTP and HTTPS versions

**JWT errors:**
```
Error: JWT_SECRET is required
```
- Verify `JWT_SECRET` is set
- Ensure it's the same secret used when token was created

### Database Issues

**Connection timeout:**
- Check MongoDB cluster network access
- Verify connection string includes your IP
- Test connection locally first

**Out of storage:**
- MongoDB Atlas free tier has 512MB limit
- Monitor usage, upgrade if needed

---

## Quick Reference: Environment Variables

| Variable | Where | Value |
|---|---|---|
| `NODE_ENV` | Backend | `production` |
| `PORT` | Backend | `3000` (or hosting default) |
| `CLIENT_URL` | Backend | `https://your-frontend-domain.com` |
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | 32+ character random string |
| `GOOGLE_GENAI_API_KEY` | Backend | Your Gemini API key |
| `VITE_API_URL` | Frontend | `https://your-backend-domain.com` |

---

## Next Steps After Deployment

1. **Monitor** the application for errors
2. **Collect feedback** from initial users
3. **Plan features** for v2
4. **Set up CI/CD** for automatic deployments
5. **Add analytics** to track usage

---

## Getting Help

If you encounter issues:

1. Check backend logs: `heroku logs --tail` or `pm2 logs`
2. Check browser console (F12 → Console tab)
3. Verify all environment variables are set
4. Test API endpoints directly with Postman/curl
5. Check the DEPLOYMENT.md file for security checklist

