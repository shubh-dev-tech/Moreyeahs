# Full Width Left Text Section - File Structure

## 📂 Complete File Organization

```
Full Width Left Text Section Block
│
├── WordPress Backend
│   ├── wp-content/themes/twentytwentyfive/
│   │   ├── functions.php
│   │   │   └── twentytwentyfive_register_acf_blocks() ✅ ADDED
│   │   │
│   │   └── blocks/
│   │       └── full-width-left-text-section.php ✅ CREATED
│   │
│   └── ACF Field Group (needs import)
│       └── nextjs-wordpress/wordpress-theme-files/
│           └── ACF_FIELD_GROUP_full_width_left_text_section.json
│
└── Next.js Frontend
    ├── src/components/blocks/
    │   ├── FullWidthLeftTextSection/ ✅ NEW FOLDER
    │   │   ├── index.tsx ✅ CREATED
    │   │   ├── styles.scss ✅ CREATED
    │   │   ├── README.md ✅ CREATED
    │   │   └── STRUCTURE.md (this file)
    │   │
    │   └── BlockRenderer.tsx ✅ UPDATED
    │
    └── src/styles/
        └── main.scss ✅ UPDATED (import added)
```

## 🎯 What Each File Does

### WordPress Files

**functions.php**
- Registers the ACF block type
- Defines block metadata (name, title, icon, category)
- Points to the block template file

**full-width-left-text-section.php**
- Block template that renders in WordPress editor
- Fetches ACF field values
- Outputs HTML with inline styles
- Used for WordPress preview

### Next.js Files

**index.tsx**
- React component for frontend rendering
- Receives data from WordPress API
- Uses Next.js Image component for optimization
- Implements proper TypeScript types

**styles.scss**
- BEM-style SCSS for the block
- Responsive design rules
- Hover effects and transitions
- Mobile-first approach

**README.md**
- Component documentation
- Field descriptions
- Usage instructions
- Styling guide

## 🔄 Data Flow

```
WordPress Editor
    ↓
ACF Fields (user input)
    ↓
WordPress REST API / GraphQL
    ↓
Next.js API Route
    ↓
BlockRenderer Component
    ↓
FullWidthLeftTextSection Component
    ↓
Rendered HTML + CSS
```

## 🎨 Component Structure

```tsx
<section className="full-width-left-text-section">
  <div className="__container">
    
    <div className="__content">
      <h2 className="__heading">...</h2>
      <p className="__subheading">...</p>
      <a className="__button">...</a>
      
      <div className="__case-studies">
        <p className="__case-studies-label">CASE STUDIES</p>
        
        <div className="__case-study">
          <h3 className="__case-study-heading">...</h3>
          <p className="__case-study-text">...</p>
          <a className="__case-study-link">...</a>
        </div>
        
        <div className="__case-study">...</div>
      </div>
    </div>
    
    <div className="__image">
      <Image className="__image-element" />
    </div>
  </div>
  
  <div className="__decoration --1"></div>
  <div className="__decoration --2"></div>
</section>
```

## 📦 Dependencies

- **WordPress:** ACF Pro plugin
- **Next.js:** next/image component
- **React:** TypeScript support
- **SCSS:** Sass preprocessor

## ✨ Features Implemented

- ✅ Organized folder structure
- ✅ BEM methodology for CSS
- ✅ TypeScript types
- ✅ Responsive design
- ✅ Next.js Image optimization
- ✅ Hover effects
- ✅ Decorative elements
- ✅ Mobile-first approach
- ✅ Accessibility considerations
- ✅ Documentation

## 🚀 Benefits of This Structure

1. **Maintainability:** All related files in one folder
2. **Scalability:** Easy to add more blocks following this pattern
3. **Clarity:** Clear separation of concerns
4. **Reusability:** Component can be easily moved or duplicated
5. **Documentation:** Self-documenting with README files
6. **Best Practices:** Follows React and Next.js conventions
