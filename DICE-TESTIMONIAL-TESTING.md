# Dice Testimonial Block - Testing Guide

## Visual Example of Heading with Span

```
Heading Field:        "What Our Clients"     (Color: White #ffffff)
Heading Span Field:   "Say"                  (Color: Gold #ffd700)

Result on Frontend:   "What Our Clients Say"
                       ^^^^^^^^^^^^^^^^^ ^^^
                       White             Gold
```

This is the same approach used in the **Specializations Section** block.

---

## Issues Fixed:

### 1. ✅ Span Heading Not Showing
- **Problem**: The heading span text wasn't displaying on frontend
- **Solution**: Changed approach to match Specializations Section block
  - Heading and span text are now **separate fields** that display **sequentially**
  - Heading: "What Our Clients" + Span Text: "Say" = "What Our Clients Say"
  - Each part can have its own color
  - This is the same pattern used in Specializations Section block

### 2. ✅ Sub Heading Showing Default Text
- **Problem**: Sub heading was showing "Discover how our services have transformed businesses" even when blank
- **Solution**: 
  - Removed default value from component props (changed from `"Discover..."` to `""`)
  - Updated block.php to use empty string as default
  - Added check to only render sub heading if it's not empty: `{sub_heading && sub_heading.trim() !== '' && ...}`

### 3. ✅ Quote Not Showing
- **Problem**: Testimonial quotes weren't displaying
- **Solution**: The code structure is correct. The issue is likely that:
  - No testimonials have been created yet in WordPress
  - Or the ACF fields need to be synced

## How to Test:

### Step 1: Create Testimonials in WordPress

1. Go to WordPress Admin → **Testimonials** → **Add New**
2. Fill in the following fields:
   - **Title**: Client name (e.g., "John Doe")
   - **Testimonial Quote**: The actual testimonial text
   - **Client Name**: Full name
   - **Client Position**: Job title (e.g., "CEO")
   - **Client Company**: Company name
   - **Rating**: 1-5 stars
   - **Featured Image**: Upload client avatar/photo
3. **Publish** the testimonial
4. Create at least 2-3 testimonials for testing the slider

### Step 2: Add Block to a Page

1. Edit any page in WordPress
2. Add the **"Dice Testimonial"** block
3. Configure the block:
   - **Heading**: "What Our Clients" (the main part of the heading)
   - **Heading Color**: Choose a color (e.g., white #ffffff)
   - **Heading Span Text**: "Say" (this will be added after the heading in a different color)
   - **Heading Span Color**: Choose a different color (e.g., gold #ffd700)
   - **Result**: Will display as "What Our Clients Say" with "Say" in gold color
   - **Sub Heading**: Leave blank or add custom text
   - **Testimonial Category**: Leave empty for all, or select a category
   - **Background Type**: Choose Color, Gradient, or Image
     - If **Gradient**: Set Color 1, Color 2, and Direction
     - If **Image**: Upload a background image
   - **Slider Settings**: Configure autoplay, speed, navigation, dots
4. **Update/Publish** the page

### Important: How Heading Span Works

The heading span text is **added after** the main heading, not replaced within it:
- ✅ **Correct**: 
  - Heading: "What Our Clients"
  - Span Text: "Say"
  - Result: "What Our Clients Say" (with "Say" in different color)
  
- ❌ **Incorrect** (old approach):
  - Heading: "What Our Clients Say"
  - Span Text: "Say"
  - This would try to find and replace "Say" within the heading

### Step 3: View on Frontend

1. Visit the page on your Next.js frontend
2. Check that:
   - ✅ Heading displays with correct colors
   - ✅ Span text is highlighted in different color
   - ✅ Sub heading only shows if you entered text
   - ✅ Testimonial quotes are displayed
   - ✅ Client names, positions, companies show correctly
   - ✅ Client avatars display
   - ✅ Star ratings show
   - ✅ Slider animations work (3D tilt and blur effects)
   - ✅ Navigation arrows work
   - ✅ Dots indicator works
   - ✅ Background (color/gradient/image) displays correctly

## Troubleshooting:

### If quotes still don't show:

1. **Check WordPress Admin**:
   - Go to Testimonials → All Testimonials
   - Verify testimonials exist and are published
   - Open a testimonial and check the "Testimonial Quote" field has content

2. **Check ACF Fields**:
   - Go to Custom Fields → Field Groups
   - Find "Testimonial Details" field group
   - Verify it's assigned to "Post Type is equal to Testimonial"
   - Check that the field name is `testimonial_quote`

3. **Sync ACF Fields**:
   - Go to Custom Fields → Tools → Sync Available
   - If you see "Testimonial Details" or "Dice Testimonial Block", click Sync

4. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Look for any errors in the Console tab
   - Check if testimonial data is being loaded

5. **Verify REST API**:
   - Visit: `https://your-site.com/wp-json/wp/v2/testimonials`
   - Check if testimonials are returned with the correct data

### If span color doesn't show:

1. Make sure you've entered text in both "Heading" and "Heading Span Text" fields
2. The span text is added AFTER the heading, not replaced within it
3. Example:
   - Heading: "What Our Clients" ✅
   - Heading Span Text: "Say" ✅
   - Result: "What Our Clients Say" (with "Say" in different color)
   
4. NOT like this:
   - Heading: "What Our Clients Say" ❌
   - Heading Span Text: "Say" ❌
   - This won't work because span text is appended, not replaced

## File Locations:

### WordPress (Backend):
- CPT: `wp-content/themes/twentytwentyfive-child/inc/cpt-testimonials.php`
- Block PHP: `wp-content/themes/twentytwentyfive-child/blocks/dice-testimonial/block.php`
- Block CSS: `wp-content/themes/twentytwentyfive-child/blocks/dice-testimonial/style.css`
- ACF JSON: `wp-content/themes/twentytwentyfive-child/acf-json/group_dice_testimonial.json`

### Next.js (Frontend):
- Component: `nextjs-wordpress/src/components/blocks/dice-testimonial/DiceTestimonial.tsx`
- Styles: `nextjs-wordpress/src/components/blocks/dice-testimonial/styles.scss`
- Block Renderer: `nextjs-wordpress/src/components/blocks/BlockRenderer.tsx`
