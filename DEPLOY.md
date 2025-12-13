# Vercel Deploy Заавар

## Хурдан Deploy (5 минут)

### 1. GitHub дээр repository үүсгэх

```bash
# Local project-д
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Vercel дээр deploy

1. [vercel.com](https://vercel.com) дээр бүртгүүлэх/нэвтрэх
2. "Add New..." → "Project" сонгох
3. GitHub repository-г сонгох
4. **Environment Variables** нэмэх (6 утга):

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

5. "Deploy" дарах

### 3. Firebase тохируулах

Deploy хийсний дараа:

1. **Firebase Console** → Authentication → Settings → Authorized domains
2. Vercel domain нэмэх: `your-app.vercel.app`
3. **Firestore Rules** тохируулах (firestore.rules файл дээрх утгууд)

## Vercel CLI ашиглах

```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Environment variables
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production

# Production deploy
vercel --prod
```

## Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Domain нэмэх
3. DNS records тохируулах (Vercel зааварчилгаа дагах)

## Troubleshooting

**Build алдаа:**
- Environment variables шалгах
- `npm run build` local дээр ажиллуулах

**Firebase permissions алдаа:**
- Firestore rules шалгах
- Authorized domains шалгах

**CORS алдаа:**
- Firebase Console → Authentication → Settings → Authorized domains
- Vercel domain нэмэх
