# Block Updates Summary

## Overview
Updated 5 WordPress/Next.js blocks with new customization options for height control and gradient direction.

## Blocks Updated

### 1. Domain Enables Section
### 2. Specializations Section
### 3. Services Section
### 4. Fits Together Section
### 5. FAQ Section

## New Features Added

### Height Control
- **Field Name**: `section_height`
- **Type**: Text input
- **Default**: `auto`
- **Options**: Any valid CSS height value (e.g., `100vh`, `800px`, `auto`)
- **Description**: Allows you to set custom height for each section

### Gradient Direction Options
- **Field Name**: `gradient_direction`
- **Type**: Select dropdown
- **Options**:
  - `to right` - Left to Right
  - `to left` - Right to Left
  - `to bottom` - Top to Bottom ⭐
  - `to top` - Bottom to Top ⭐
  - `45deg` - Diagonal (45°)
  - `135deg` - Diagonal (135°)
- **Default**: `to bottom` (for most blocks)

## Files Modified

### ACF JSON Files (WordPress)
1. `wp-content/themes/twentytwentyfive-child/acf-json/group_domain_enables_section.json`
2. `wp-content/themes/twentytwentyfive-child/acf-json/group_specializations_section.json`
3. `wp-content/themes/twentytwentyfive-child/acf-json/group_services_section.json`
4. `wp-content/themes/twentytwentyfive-child/acf-json/group_fits_together_section.json`
5. `wp-content/themes/twentytwentyfive-child/acf-json/group_faq_section.json`

### Next.js ACF JSON Files
1. `nextjs-wordpress/src/components/blocks/domain-enables-section/acf.json`
2. `nextjs-wordpress/src/components/blocks/specializations-section/acf.json`
3. `nextjs-wordpress/src/components/blocks/services-section/acf.json`
4. `nextjs-wordpress/src/components/blocks/fits-together-section/acf.json`
5. `nextjs-wordpress/src/components/blocks/faq-section/acf.json`

### React/TypeScript Components
1. `nextjs-wordpress/src/components/blocks/domain-enables-section/DomainEnablesSection.tsx`
2. `nextjs-wordpress/src/components/blocks/specializations-section/SpecializationsSection.tsx`
3. `nextjs-wordpress/src/components/blocks/services-section/ServicesSection.tsx`
4. `nextjs-wordpress/src/components/blocks/fits-together-section/FitsTogetherSection.tsx`
5. `nextjs-wordpress/src/components/blocks/faq-section/FaqSection.tsx`

## How to Use

### In WordPress Admin:

1. **Edit a page** with any of these blocks
2. **Find the block settings** in the right sidebar
3. **Set Section Height**:
   - Enter `auto` for automatic height
   - Enter `100vh` for full viewport height
   - Enter `800px` for fixed pixel height
   - Any valid CSS height value works

4. **Choose Gradient Direction** (when Background Type is "Gradient"):
   - Select from dropdown options
   - **Top to Bottom** and **Bottom to Top** are the new additions
   - Preview changes in real-time

### Background Options Available:

Each block now supports:
- ✅ **Solid Color** - Single background color
- ✅ **Gradient** - Two-color gradient with direction control
- ✅ **Background Image** - Upload custom image

### FAQ Section Special Features:

The FAQ section already had these features, but now includes:
- ✅ Gradient direction control
- ✅ Height control
- ✅ Background color option
- ✅ Background image option
- ✅ Color gradient with customizable direction

## Technical Implementation

### Component Updates:
- Added `section_height` prop to all components
- Added `gradient_direction` prop to gradient background logic
- Updated `getBackgroundStyle()` functions to include height in base styles
- Maintained backward compatibility with existing content

### Style Application:
```typescript
const baseStyle: React.CSSProperties = {
  minHeight: section_height === 'auto' ? 'auto' : section_height,
  height: section_height === 'auto' ? 'auto' : section_height,
};

// Gradient with direction
background: `linear-gradient(${gradient_direction}, ${gradient_start}, ${gradient_end})`
```

## Next Steps

1. **Sync ACF Fields**: In WordPress admin, go to Custom Fields and sync the field groups
2. **Test Each Block**: Edit pages and test the new height and gradient direction options
3. **Clear Cache**: Clear WordPress and Next.js caches if needed
4. **Rebuild**: Run `npm run build` in the Next.js directory if in production

## Notes

- All changes are backward compatible
- Existing blocks will use default values (`auto` height, `to bottom` direction)
- No content migration needed
- Fields appear conditionally based on background type selection
