# MoreYeahs Production Deployment Guide

## 🎯 Overview
This guide will help you deploy your Next.js site to **moreyeahs.in** while keeping local development running on **localhost:3000**.

---

## 🖥️ Local Development Setup (Already Configured)

Your local environment is configured to run on:
- **Next.js:** http://localhost:3000
- **WordPress:** http://localhost/moreyeahs-new
- **Environment File:** `.env.local`

### To Run Locally:
```bash
cd C:\xampp\htdocs\moreyeahs-new\nextjs-wordpress
npm run dev
```

---

## 🚀 Production Deployment to moreyeahs.in

### Option 1: Deploy to Vercel (Recommended - Free & Easy)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy from Your Project
```bash
cd C:\xampp\htdocs\moreyeahs-new\nextjs-wordpress
vercel
```

Follow the prompts:
- **Set up and deploy:** Yes
- **Which scope:** Your account
- **Link to existing project:** No
- **Project name:** moreyeahs (or your preference)
- **Directory:** ./ (current directory)
- **Override settings:** No

#### Step 4: Add Environment Variables in Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**:

```
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_WORDPRESS_URL=https://moreyeahs.com
WORDPRESS_REST_API_URL=https://moreyeahs.com/wp-json
NEXT_PUBLIC_SITE_URL=https://moreyeahs.in
NEXT_PUBLIC_SITE_NAME=MoreYeahs
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
REVALIDATE_TIME=3600
JWT_AUTH_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALLOWED_ORIGIN=https://moreyeahs.in
ENABLE_AUTH_MIDDLEWARE=false
```

#### Step 5: Configure Custom Domain (moreyeahs.in)

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `moreyeahs.in`
4. Click **Add**

#### Step 6: Update DNS Settings

Go to your domain registrar (where you bought moreyeahs.in) and add these DNS records:

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

**DNS Propagation:** May take 24-48 hours

#### Step 7: Redeploy
```bash
vercel --prod
```

---

### Option 2: Deploy to Other Hosting (VPS/Cloud)

If you want to use a VPS or cloud server (DigitalOcean, AWS, etc.):

#### Requirements:
- Ubuntu/Debian server with Node.js 18+
- Nginx or Apache as reverse proxy
- PM2 for process management
- SSL certificate (Let's Encrypt)

#### Quick Setup:
```bash
# On your server
git clone <your-repo>
cd nextjs-wordpress
npm install
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "moreyeahs" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name moreyeahs.in www.moreyeahs.in;

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

#### SSL Setup:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d moreyeahs.in -d www.moreyeahs.in
```

---

## 🔄 Updating Your Site

### Local Development:
```bash
# Just save your files - Next.js hot reloads automatically
```

### Production (Vercel):
```bash
# Option 1: Auto-deploy via Git
git add .
git commit -m "Your changes"
git push origin main

# Option 2: Manual deploy
vercel --prod
```

### Production (VPS):
```bash
# On server
git pull
npm install
npm run build
pm2 restart moreyeahs
```

---

## 🔍 Troubleshooting

### Site Can't Be Reached

1. **Check DNS Propagation:**
   ```bash
   nslookup moreyeahs.in
   ```

2. **Verify Deployment:**
   - Check Vercel dashboard for deployment status
   - Check build logs for errors

3. **WordPress API Connection:**
   - Ensure https://moreyeahs.com/wp-json is accessible
   - Check CORS settings in WordPress

### Common Issues:

**Images not loading:**
- Check `next.config.js` has `moreyeahs.in` in remotePatterns
- Verify image URLs in WordPress point to correct domain

**API errors:**
- Verify WordPress REST API is enabled
- Check WordPress permalink settings
- Test API: `https://moreyeahs.com/wp-json/wp/v2/posts`

**Environment variables not working:**
- Redeploy after adding env vars in Vercel
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

---

## 📊 Current Configuration

### Local (.env.local)
- Next.js: http://localhost:3000
- WordPress: http://localhost/moreyeahs-new

### Production (.env.production)
- Next.js: https://moreyeahs.in
- WordPress: https://moreyeahs.com

---

## 🆘 Need Help?

1. **Vercel Docs:** https://vercel.com/docs
2. **Next.js Docs:** https://nextjs.org/docs
3. **DNS Checker:** https://dnschecker.org

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at https://moreyeahs.in
- [ ] All pages render correctly
- [ ] Images load properly
- [ ] WordPress content displays
- [ ] Navigation works
- [ ] Forms submit (if any)
- [ ] SSL certificate is active
- [ ] Local development still works at localhost:3000

---

**Your setup is now configured for:**
- ✅ Local development on localhost:3000
- ✅ Production deployment on moreyeahs.in
- ✅ Both environments run independently
