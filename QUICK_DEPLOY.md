# 🚀 Quick Deployment Checklist

## Pre-Deployment (Do This First!)

### Local Preparation
- [ ] Generate JWT_SECRET
- [ ] Create `.env` file with all required variables
- [ ] Create `.env.production` file for frontend
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Run full user flow tests locally

### Security Checklist
- [ ] Verify `NODE_ENV=production` is set
- [ ] Confirm `JWT_SECRET` is 32+ characters
- [ ] Check `CLIENT_URL` is your actual domain (not localhost)
- [ ] Confirm MongoDB has authentication enabled
- [ ] Verify Google Gemini API key is valid
- [ ] All API calls will use HTTPS

---

## Backend Deployment

### Choose Your Platform:

#### ⭐ Recommended: Render.com (Free, Easy)
- [ ] Push code to GitHub
- [ ] Create account at render.com
- [ ] New Web Service → Connect GitHub
- [ ] Set `npm start` as start command
- [ ] Add environment variables
- [ ] Deploy and get URL

#### 🟢 Alternative: Heroku
- [ ] Install Heroku CLI
- [ ] `heroku login`
- [ ] `heroku create your-app-name`
- [ ] Add MongoDB addon: `heroku addons:create mongolab:sandbox`
- [ ] Set environment variables with `heroku config:set`
- [ ] `git push heroku main`

#### 🔵 Alternative: Railway.app
- [ ] Connect GitHub account
- [ ] New Project from GitHub repo
- [ ] Set environment variables in dashboard
- [ ] Auto-deploys on push

#### 🖥️ Self-Hosted (VPS)
- [ ] SSH to server
- [ ] Clone repo, `npm install`
- [ ] Create `.env` file
- [ ] `npm install -g pm2`
- [ ] `pm2 start server.js --name "interview-ai-backend"`
- [ ] Set up Nginx reverse proxy for HTTPS

**After Backend Deployed:**
- [ ] Copy backend URL
- [ ] Use this URL as `VITE_API_URL` for frontend

---

## Frontend Deployment

### Choose Your Platform:

#### ⭐ Recommended: Vercel (Free, Easiest)
- [ ] Push code to GitHub
- [ ] Login at vercel.com
- [ ] Import project
- [ ] Set Root Directory to `Frontend`
- [ ] Add `VITE_API_URL` environment variable
- [ ] Auto-deploys on every push to main

#### 🟢 Alternative: Netlify
- [ ] Push code to GitHub
- [ ] Login at netlify.com
- [ ] New site from Git
- [ ] Build command: `npm run build`
- [ ] Publish directory: `Frontend/dist`
- [ ] Add environment variables
- [ ] Deploy

#### 🔵 Alternative: GitHub Pages
- [ ] Build: `cd Frontend && npm run build`
- [ ] Deploy: `npx gh-pages -d dist`
- [ ] Enable in GitHub repository settings

#### 🖥️ Self-Hosted
- [ ] Build: `npm run build`
- [ ] Upload `dist/` folder to server
- [ ] Configure Nginx/Apache
- [ ] Enable HTTPS with Let's Encrypt

---

## After Deployment

### Immediate Tests (Do This!)
- [ ] Open frontend URL in browser
- [ ] **Register**: Create new account
- [ ] **Login**: Login with credentials
- [ ] **Upload**: Upload resume and generate report
- [ ] **Alternative**: Generate report with self-description only
- [ ] **Report**: View the generated report
- [ ] **Download**: Download PDF resume
- [ ] **Interview**: Run mock interview and submit answer
- [ ] **Logout**: Logout successfully

### Verify Security
- [ ] Frontend URL starts with `https://`
- [ ] Backend URL starts with `https://`
- [ ] CORS errors do NOT appear in console
- [ ] Network requests go to correct backend domain

### Troubleshooting
| Problem | Solution |
|---|---|
| Blank page | Check browser console (F12), verify VITE_API_URL |
| API 404 errors | Check VITE_API_URL is correct, verify backend is running |
| CORS errors | Verify CLIENT_URL matches frontend domain in backend |
| MongoDB connection fails | Check MONGO_URI, verify your IP is whitelisted |
| 401 Unauthorized | Check JWT_SECRET is consistent |
| Token not saving | Check cookies are httpOnly, secure flag in production |

---

## Platform-Specific URLs

After deployment, you'll have:

```
Frontend (e.g., Vercel):  https://your-app.vercel.app
Backend (e.g., Render):   https://your-api.onrender.com

Or if custom domain:
Frontend:  https://app.yourdomain.com
Backend:   https://api.yourdomain.com
```

Update frontend `.env.production`:
```
VITE_API_URL=https://your-api.onrender.com
```

---

## Environment Variables Quick Ref

**Backend needs:**
```
NODE_ENV=production
PORT=3000 (usually auto-set by hosting)
CLIENT_URL=https://your-frontend-url
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-32-char-secret
GOOGLE_GENAI_API_KEY=your-api-key
```

**Frontend needs:**
```
VITE_API_URL=https://your-backend-url
```

---

## Recommended Deployment Flow

1. **Backend First**
   - Deploy backend to Render/Heroku
   - Get backend URL
   - Test backend with Postman/curl

2. **Then Frontend**
   - Set `VITE_API_URL` to backend URL
   - Deploy frontend to Vercel
   - Test user flow in browser

3. **Monitor**
   - Check backend logs daily
   - Monitor error rates
   - Backup database weekly

---

## Still Have Questions?

1. Read [DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md) for detailed instructions
2. Read [DEPLOYMENT.md](DEPLOYMENT.md) for security checklist
3. Check platform documentation:
   - Vercel: https://vercel.com/docs
   - Render: https://render.com/docs
   - Heroku: https://devcenter.heroku.com/

