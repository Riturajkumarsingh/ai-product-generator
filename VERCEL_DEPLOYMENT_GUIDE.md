# 🚀 Complete Vercel Deployment Guide

## Step-by-Step Instructions for Deploying to Vercel

---

## 🎯 Overview

You will deploy TWO separate projects to Vercel:
1. **Backend** - Node.js/Express API
2. **Frontend** - React + Vite

---

## 📋 Before You Start

✅ Have these ready:
- GitHub account (repository already pushed)
- Vercel account (free at https://vercel.com)
- Replicate API Key (get from https://replicate.com/account/tokens)
- Runway API Key (get from https://app.runwayml.com/api-keys)

---

## 🔵 STEP 1: Deploy Backend to Vercel

### 1.1 Create New Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: `ai-product-generator`
4. Click **"Import"**

### 1.2 Configure Backend

Set these options in the import dialog:

| Setting | Value |
|---------|-------|
| Framework | Node.js |
| **Root Directory** | **`/backend`** ⭐ |
| Build Command | (leave empty) |
| Environment | Select |

### 1.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `REPLICATE_API_TOKEN` | Your actual API token |
| `REPLICATE_IMAGE_MODEL` | `black-forest-labs/flux-kontext-pro` |
| `RUNWAY_API_KEY` | Your actual API key |
| `RUNWAY_BASE_URL` | `https://api.dev.runwayml.com/v1` |
| `RUNWAY_API_VERSION` | `2024-11-06` |
| `RUNWAY_IMAGE_TO_VIDEO_MODEL` | `gen4_turbo` |
| `RUNWAY_TEXT_TO_VIDEO_MODEL` | `gen4.5` |
| `FRONTEND_URL` | Leave empty (update later) |

### 1.4 Deploy

Click **"Deploy"** and wait (2-3 minutes)

Once complete, you'll see your backend URL:
```
https://your-backend-name.vercel.app
```

### 1.5 Verify Backend

Open in browser:
```
https://your-backend-name.vercel.app/api/health
```

Should return:
```json
{ "ok": true }
```

✅ If you see this, backend is working!

---

## 🟢 STEP 2: Deploy Frontend to Vercel

### 2.1 Create New Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository again
4. Click **"Import"**

### 2.2 Configure Frontend

Set these options:

| Setting | Value |
|---------|-------|
| Framework | Vite |
| **Root Directory** | **`/frontend`** ⭐ |
| Build Command | `npm install && npm run build` |
| Output Directory | `dist` |

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend-name.vercel.app` |
| `VITE_IMAGE_API_BASE_URL` | `https://your-backend-name.vercel.app` |
| `VITE_VIDEO_API_BASE_URL` | `https://your-backend-name.vercel.app` |

**Use your actual backend URL from Step 1.4!**

### 2.4 Deploy

Click **"Deploy"** and wait (2-3 minutes)

Your frontend URL:
```
https://your-frontend-name.vercel.app
```

---

## 🔄 STEP 3: Complete Backend Configuration

Now that frontend is deployed, update backend with frontend URL:

### 3.1 Update Backend Environment

1. Go to **Backend Project** in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Update `FRONTEND_URL` to:
   ```
   https://your-frontend-name.vercel.app
   ```

### 3.2 Redeploy Backend

1. Click **"Deployments"** tab
2. Find your latest deployment
3. Click menu (...) → **"Redeploy"**

Wait for redeploy to complete.

---

## ✅ STEP 4: Test Everything

### Test 1: Health Check
```
https://your-backend-name.vercel.app/api/health
→ Should return { "ok": true }
```

### Test 2: Frontend Loads
```
https://your-frontend-name.vercel.app
→ Should show the AI Product Generator interface
```

### Test 3: Image Generation
1. Upload an image
2. Write a prompt
3. Click "Generate Images"
4. Wait 30-60 seconds
5. Images should appear

### Test 4: Video Generation
1. Upload image(s)
2. Write a prompt
3. Adjust duration
4. Click "Generate Video"
5. Wait 2-5 minutes
6. Video should appear

---

## 📊 Your Deployment URLs

After successful deployment:

```
Frontend: https://your-frontend-name.vercel.app
Backend:  https://your-backend-name.vercel.app
API:      https://your-backend-name.vercel.app/api
```

Share the **Frontend URL** with anyone to use your app!

---

## 🔐 Security

✅ API keys stored only in Vercel environment variables
✅ `.env` files are in `.gitignore` (not on GitHub)
✅ CORS configured properly
✅ Backend listens on all interfaces (0.0.0.0)

---

## 🐛 Troubleshooting

### Problem: 502 Bad Gateway
**Check:**
- API keys are valid and active
- Environment variables are set correctly
- Replicate/Runway services are online

### Problem: CORS Error
**Check:**
- `VITE_API_BASE_URL` matches backend URL
- `FRONTEND_URL` in backend matches frontend URL
- Clear browser cache (Ctrl+Shift+Delete)

### Problem: Generation takes too long
**This is normal:**
- Images: 30-60 seconds
- Videos: 2-5 minutes
- Just wait!

### Problem: "Cannot find module"
**Solution:**
- Redeploy project
- Check all dependencies in package.json
- Check Node version compatibility

---

## 📞 Getting Help

1. Check Vercel deployment logs (go to project → Deployments → click deployment)
2. Verify all environment variables are set
3. Test health endpoint: `/api/health`
4. Check API key validity on Replicate/Runway websites

---

## 🎓 Architecture

```
┌─────────────────────────────────────────────────┐
│           Your Vercel Deployment                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend Project          Backend Project      │
│  ┌──────────────────┐      ┌──────────────────┐ │
│  │ React + Vite     │      │ Express.js       │ │
│  │ dist/ folder     │      │ Node.js          │ │
│  │ Port: varies     │      │ Port: 5000       │ │
│  └──────────────────┘      └──────────────────┘ │
│         ↕                         ↕              │
│    Vercel CDN            Vercel Serverless      │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ API Calls (fetch/axios)
    ┌─────────────────────┐
    │ Replicate (Images)  │
    │ Runway (Videos)     │
    └─────────────────────┘
```

---

## 📝 Next Steps After Deployment

1. ✅ Test all features
2. ✅ Share frontend URL with friends
3. ✅ Monitor API usage and costs
4. ✅ Set up GitHub sync for auto-deployment

---

**Congratulations! Your app is now live! 🎉**

Last Updated: March 2026
