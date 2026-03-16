# AI Product Generator 

## ✅ Project Setup Complete

Your project has been successfully pushed to GitHub and is ready for Vercel deployment.

## Backend Deployment (Vercel)

### Environment Variables to Set on Vercel:

```
PORT=5000
FRONTEND_URL=<your_frontend_vercel_url>
REPLICATE_API_TOKEN=<your_token>
REPLICATE_IMAGE_MODEL=black-forest-labs/flux-kontext-pro
RUNWAY_API_KEY=<your_api_key>
RUNWAY_BASE_URL=https://api.dev.runwayml.com/v1
RUNWAY_API_VERSION=2024-11-06
RUNWAY_IMAGE_TO_VIDEO_MODEL=gen4_turbo
RUNWAY_TEXT_TO_VIDEO_MODEL=gen4.5
```

### Replicate API Key:
- Go to: https://replicate.com/account/tokens
- Copy your API token

### Runway API Key:
- Go to: https://app.runwayml.com/api-keys
- Generate new API key

### Deploy Backend:
1. Connect your Vercel account to the GitHub repository
2. Create a new project on Vercel
3. Select the `/backend` folder as the root directory
4. Add all the environment variables listed above
5. Deploy!

## Frontend Deployment (Vercel)

### Environment Variables to Set on Vercel:

```
VITE_API_BASE_URL=<your_backend_vercel_url>
VITE_IMAGE_API_BASE_URL=<your_backend_vercel_url>
VITE_VIDEO_API_BASE_URL=<your_backend_vercel_url>
```

### Deploy Frontend:
1. In Vercel, create another project for the frontend
2. Select the `/frontend` folder as the root directory
3. Build command: `npm install && npm run build`
4. Add the environment variables above (use your deployed backend URL)
5. Deploy!

## Features

### Image Generator
- **Requires:** Image upload + Text prompt
- **Optional:** Reference URL
- Creates variations of product images using AI

### Video Generator
- **Requires:** Image upload + Text prompt + Duration
- Generates e-commerce videos from product images

## Important Notes

🔐 **Security:**
- `.env` files are NOT committed to GitHub (added to .gitignore)
- API keys are only stored in Vercel environment variables
- The `.env.example` file shows what variables are needed

📝 **Local Development:**
1. Copy `.env.example` to `.env` in the backend folder
2. Add your actual API keys
3. Never commit this file!

## Project Structure

```
ai-product-generator/
├── backend/          (Node.js Express API)
│   ├── controllers/
│   ├── routes/
│   ├── server.js
│   └── .env.example
├── frontend/         (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── vite.config.js
└── package.json
```

## Next Steps

1. ✅ GitHub Repository Created
2. ⏳ Deploy Backend on Vercel
3. ⏳ Deploy Frontend on Vercel
4. ⏳ Test the application

Good luck! 🚀
