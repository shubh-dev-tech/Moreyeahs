# Standalone Next.js Homepage

This is a standalone Next.js application that replicates your homepage without any WordPress dependencies. It's designed to be deployed on Vercel or any other hosting platform that supports Next.js.

## Features

- ✅ No WordPress dependencies
- ✅ Static data structure
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Ready for Vercel deployment
- ✅ TypeScript support
- ✅ SCSS styling

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your images:**
   - Place your images in the `public/images/` directory
   - Update the image paths in `src/data/staticData.ts`

3. **Customize content:**
   - Edit `src/data/staticData.ts` to match your actual content
   - Update site name, descriptions, and other metadata

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

This app is configured for static export, so it can be deployed to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Customization

### Content
Edit `src/data/staticData.ts` to update:
- Site name and branding
- Navigation menu
- Homepage content blocks
- Footer links and information

### Styling
- Global styles: `src/app/globals.scss`
- Component styles: Individual `.scss` files next to components

### Images
- Add images to `public/images/`
- Update image references in `staticData.ts`
- Recommended sizes: 600x400px for content blocks

## Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.scss       # Global styles
├── components/
│   ├── blocks/            # Content blocks
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   └── VerticalStepper.tsx # Navigation stepper
└── data/
    └── staticData.ts      # All site content
```

## Performance

- Static generation for fast loading
- Image optimization with Next.js Image component
- Minimal JavaScript bundle
- SEO-friendly markup

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Progressive enhancement