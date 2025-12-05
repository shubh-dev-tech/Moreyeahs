# Icon Text Grid - Quick Start 🚀

## ✅ What's Done

- ✅ Component created with TypeScript
- ✅ Styles imported in main.scss
- ✅ Registered in BlockRenderer
- ✅ WordPress block files created
- ✅ ACF field group JSON ready

## 🎯 What You Need To Do

### 1. Import ACF Fields (2 minutes)

1. Go to WordPress Admin → **Custom Fields** → **Tools**
2. Click **Import** tab
3. Copy contents from: `nextjs-wordpress/wordpress-theme-files/ACF_FIELD_GROUP_icon_text_grid.json`
4. Paste and click **Import JSON**

### 2. Test in WordPress (3 minutes)

1. Edit any page
2. Click **+** → Search "Icon Text Grid"
3. Add 2-3 items:
   - Text: "Service offerings"
   - Icon: Upload a small PNG (60x60px)
   - Link: Any URL
4. Publish

### 3. Test in Next.js (1 minute)

1. Restart dev server if running:
   ```bash
   npm run dev
   ```
2. Visit the page you edited
3. Verify:
   - Grid displays
   - Icons rotate on hover
   - Sections are clickable
   - Responsive on mobile

## 🎨 Features

- **Flexible:** Add 1-12 items dynamically
- **Interactive:** 360° icon rotation on hover
- **Responsive:** Auto-adjusts from mobile to desktop
- **Accessible:** Keyboard navigation included

## 📱 Responsive Behavior

- **Mobile (<480px):** Single column
- **Tablet (480-768px):** Auto-fit grid
- **Desktop (768px+):** Multi-column grid

## 🔧 Customization

### Change Colors
Edit `styles.scss`:
```scss
.icon-text-grid__item {
  background: #ffffff;  // Card background
  border-color: #e0e0e0;  // Border color
  
  &:hover {
    border-color: #000000;  // Hover border
  }
}
```

### Change Icon Size
```scss
.icon-text-grid__icon-wrapper {
  width: 60px;   // Change this
  height: 60px;  // And this
}
```

### Change Animation Speed
```scss
@keyframes rotate360 {
  // Change duration in hover state
}

.icon-text-grid__item:hover .icon-text-grid__icon {
  animation: rotate360 0.6s ease-in-out;  // Change 0.6s
}
```

## 🐛 Troubleshooting

**Styles not loading?**
- Restart Next.js dev server
- Clear `.next` folder
- Check browser console

**Block not appearing?**
- Verify ACF field group imported
- Check WordPress admin → Custom Fields

**Icons not rotating?**
- Check browser console for JS errors
- Verify script.js is loading in WordPress

## 📚 Documentation

- **Full Setup:** `SETUP.md` (WordPress)
- **Next.js Details:** `NEXTJS_SETUP.md`
- **Component Docs:** `README.md`

---

**Ready to go!** 🎉 Just import the ACF fields and start using the block.
