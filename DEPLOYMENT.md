# Deployment & Security Checklist

## ✅ Completed Hardening Steps

### 1. Environment Configuration
- [x] Replaced hardcoded localhost URLs with environment variables
- [x] Added NODE_ENV support for production/development
- [x] Implemented environment variable validation on server startup
- [x] JWT_SECRET validation (required in all environments)

### 2. Security Headers & Cookies
- [x] Enabled `httpOnly` on JWT cookies (prevents XSS)
- [x] Enabled `sameSite=Strict` on cookies (prevents CSRF)
- [x] Enabled `secure` flag in production (HTTPS-only)
- [x] Set cookie expiration to 24 hours

### 3. CORS Configuration
- [x] CORS now accepts CLIENT_URL from environment
- [x] Production mode restricts to single origin
- [x] Development allows localhost origins

### 4. Ownership & Access Control
- [x] Users can only view their own reports
- [x] Users can only download their own resume PDFs
- [x] Users can only run mock interviews on their own reports
- [x] Proper 404 responses when accessing unauthorized resources

### 5. File Upload Security
- [x] PDF MIME type validation on upload
- [x] File size limit (3MB)
- [x] Secure error handling (no sensitive data leakage)

### 6. Error Handling
- [x] Database errors don't expose connection strings in production
- [x] No sensitive data in error responses
- [x] Graceful failure with appropriate HTTP status codes

### 7. Documentation
- [x] Backend/.env.example with all required keys
- [x] Frontend/.env.example with API URL
- [x] DEPLOYMENT.md with checklist and instructions

---

## ⚠️ Required for Production Deployment

### Before Going Live:
1. **Set environment variables on your hosting platform:**
   ```
   NODE_ENV=production
   PORT=3000
   CLIENT_URL=https://yourdomain.com
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/interview-ai
   JWT_SECRET=[generate 32+ random characters]
   GOOGLE_GENAI_API_KEY=your-api-key
   ```

2. **Generate a strong JWT_SECRET:**
   ```bash
   # macOS/Linux:
   openssl rand -hex 32
   
   # Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
   ```

3. **Frontend environment setup:**
   - Create `.env.production` with: `VITE_API_URL=https://your-api-domain.com`
   - Build: `npm run build`
   - Deploy `dist/` folder

4. **Backend deployment:**
   - Use `npm start` (not `npm run dev`)
   - Ensure MongoDB is accessible from your hosting platform
   - Verify all required env vars are set

5. **Security validation:**
   - [ ] CORS origin is your actual domain (not localhost)
   - [ ] MongoDB has authentication enabled
   - [ ] JWT_SECRET is strong and unique
   - [ ] NODE_ENV is set to "production"
   - [ ] All API calls use HTTPS
   - [ ] Google Gemini API key is valid

6. **Pre-launch smoke tests:**
   - [ ] Register a new user
   - [ ] Login with that user
   - [ ] Upload a resume and generate report
   - [ ] Generate report with self-description only
   - [ ] Download PDF report
   - [ ] Run mock interview
   - [ ] Logout

---

## 📋 Security Features Implemented

- ✅ JWT authentication with secure cookies
- ✅ Token blacklist for logout
- ✅ Protected routes with middleware
- ✅ User ownership validation on all resources
- ✅ CORS restrictions
- ✅ Environment-driven secrets
- ✅ XSS protection (httpOnly cookies)
- ✅ CSRF protection (sameSite=Strict)
- ✅ HTTPS enforcement in production
- ✅ File type validation (PDF only)
- ✅ Safe error handling (no connection string leaks)

---

## 🚀 Deployment Commands

**Frontend:**
```bash
npm install
npm run build
# Deploy dist/ folder to static hosting
```

**Backend:**
```bash
npm install
NODE_ENV=production npm start
# Or use process manager (PM2, systemd, etc.)
```

---

## 🔗 Environment Variable Mapping

| Variable | Frontend | Backend | Purpose |
|---|---|---|---|
| `VITE_API_URL` | ✅ | — | Backend API domain |
| `CLIENT_URL` | — | ✅ | Frontend domain for CORS |
| `NODE_ENV` | — | ✅ | Production safety checks |
| `PORT` | — | ✅ | Server port |
| `MONGO_URI` | — | ✅ | Database connection |
| `JWT_SECRET` | — | ✅ | Token signing key |
| `GOOGLE_GENAI_API_KEY` | — | ✅ | Gemini AI access |

