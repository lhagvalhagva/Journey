# Emotional Minimalist Website UI

This is a code bundle for Emotional Minimalist Website UI. The original project is available at https://www.figma.com/design/KhmObah3T56pkM6WwRg9uu/Emotional-Minimalist-Website-UI.

## Setup

### 1. Dependencies суулгах

```bash
npm i
```

### 2. Firebase тохируулах

1. Firebase Console-д шинэ проект үүсгэх: https://console.firebase.google.com/
2. Authentication идэвхжүүлэх (Email/Password)
3. Firestore Database үүсгэх
4. Project Settings → General → Your apps → Web app → Config утгуудыг авна
5. `.env` файл үүсгэх (root directory):

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Firestore Security Rules тохируулах

Firebase Console → Firestore Database → Rules → Edit:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Нэвтэрсэн хэрэглэгч бүр read/write хийх боломжтой
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Journey data: нэвтэрсэн хэрэглэгч бүр read/write хийх боломжтой
    match /journeyData/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Анхаар:** `firestore.rules` файл project root-д байна. Firebase CLI ашиглан deploy хийх боломжтой.

### 4. Хэрэглэгч үүсгэх

Firebase Console → Authentication → Users → Add user:
- Email: (өөрийн email)
- Password: (нууц үг)

**Анхаар:** Нэвтэрсэн хэрэглэгч бүр Admin Panel-г удирдах боломжтой. Email эсвэл role шалгалт хийхгүй.

### 5. Development server ажиллуулах

```bash
npm run dev
```

## Vercel дээр Deploy хийх

### 1. GitHub/GitLab/Bitbucket дээр repository үүсгэх

1. GitHub дээр шинэ repository үүсгэх
2. Local project-оо push хийх:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Vercel дээр deploy хийх

**Сонголт A: Vercel Dashboard ашиглах**

1. [Vercel](https://vercel.com) дээр бүртгүүлэх/нэвтрэх
2. "Add New Project" → GitHub repository сонгох
3. Project Settings:
   - **Framework Preset**: Vite (автоматаар сонгогдоно)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. **Environment Variables** нэмэх:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. "Deploy" дарах

**Сонголт B: Vercel CLI ашиглах**

```bash
# Vercel CLI суулгах
npm i -g vercel

# Project root-д байрлаад
vercel

# Environment variables тохируулах
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID

# Production deploy
vercel --prod
```

### 3. Firebase Security Rules тохируулах

Deploy хийсний дараа Firebase Console-д:

1. Firestore Database → Rules
2. Дээрх security rules-г хуулж оруулах
3. Publish хийх

**Анхаар:** Production дээр CORS тохируулах хэрэгтэй бол:
- Firebase Console → Authentication → Settings → Authorized domains
- Vercel domain-ийг нэмэх (жишээ: `your-app.vercel.app`)

### 4. Custom Domain тохируулах (optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Custom domain нэмэх
3. DNS records тохируулах

## Features

- **Login System**: Нэвтэрсэн хэрэглэгч бүр Admin Panel-г удирдах боломжтой
- **Admin Panel**: Greetings болон unlock days удирдах (Ctrl+Shift+A)
- **Firestore Integration**: Бүх өгөгдөл Firebase Firestore дээр хадгалагдана
- **Real-time Updates**: Firestore-аас өгөгдөл уншиж, Admin Panel-аас удирдана
  # Journey
