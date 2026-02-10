# Testimonials Setup Guide

## Overview
The dice-testimonial-block has been configured to fetch dynamic testimonial data from WordPress Custom Post Type (CPT) instead of using static data.

## WordPress Setup

### 1. Install the Testimonials CPT Plugin

Copy the `testimonials-cpt.php` file to your WordPress installation:

**Option A: As a Plugin**
1. Copy `testimonials-cpt.php` to `/wp-content/plugins/testimonials-cpt/testimonials-cpt.php`
2. Activate the plugin in WordPress Admin → Plugins

**Option B: In Theme Functions**
1. Copy the code from `testimonials-cpt.php` (excluding the plugin header) to your theme's `functions.php` file

### 2. Required Plugin: Advanced Custom Fields (ACF)

The testimonials CPT uses ACF for custom fields. Make sure ACF is installed and activated:
- Install ACF Pro or ACF Free from WordPress.org
- The testimonials-cpt.php file will automatically register the required fields

### 3. Add Testimonials in WordPress Admin

1. Go to WordPress Admin → Testimonials
2. Click "Add New Testimonial"
3. Fill in the fields:
   - **Title**: Client name (fallback if ACF client_name is empty)
   - **Content**: Testimonial quote (fallback if ACF quote is empty)
   - **Quote**: Main testimonial text (ACF field)
   - **Client Name**: Full name of the client
   - **Client Position**: Job title or position
   - **Client Company**: Company name
   - **Client Avatar**: Upload client photo
   - **Rating**: 1-5 star rating (defaults to 5)

## API Endpoint

The testimonials are fetched from: `/wp-json/wp/v2/testimonials`

### Sample API Response
```json
[
  {
    "id": 123,
    "title": {
      "rendered": "John Doe"
    },
    "content": {
      "rendered": "<p>Great service!</p>"
    },
    "acf": {
      "quote": "Working with this team was amazing!",
      "client_name": "John Doe",
      "client_position": "CEO",
      "client_company": "Tech Corp",
      "client_avatar": {
        "url": "https://example.com/avatar.jpg",
        "alt": "John Doe",
        "sizes": {
          "thumbnail": "https://example.com/avatar-150x150.jpg"
        }
      },
      "rating": 5
    }
  }
]
```

## Frontend Implementation

### Files Modified:
- `src/lib/wpFetch.ts` - Added `getTestimonials()` function
- `src/components/DiceTestimonialWrapper.tsx` - New wrapper component
- `src/app/layout.tsx` - Updated to use dynamic testimonials

### Data Transformation:
The wrapper component transforms WordPress data to match the DiceTestimonial component format:
- Uses ACF `quote` field, falls back to post content, then title
- Uses ACF `client_name` field, falls back to post title
- Includes all ACF fields (position, company, avatar, rating)
- Filters out testimonials with empty quotes

### Error Handling:
- Returns `null` if no testimonials found (component won't render)
- Graceful error handling with try/catch
- Safe fallbacks for missing data

## Customization

### Styling Configuration:
You can modify the testimonial appearance in `DiceTestimonialWrapper.tsx`:

```typescript
const testimonialData = {
  heading: "What Our Clients Say",
  heading_span_text: "About Us", 
  heading_span_color: "#ffd700",
  sub_heading: "Don't just take our word for it",
  background_type: 'gradient',
  gradient_color_1: '#0a0f1c',
  gradient_color_2: '#1a1f3c',
  text_color: '#ffffff',
  accent_color: '#ffd700'
};
```

### Fetch Parameters:
Modify the fetch parameters in `DiceTestimonialWrapper.tsx`:

```typescript
const wpTestimonials = await getTestimonials({ 
  per_page: 10,        // Number of testimonials to fetch
  status: 'publish',   // Only published testimonials
  orderby: 'date',     // Order by date
  order: 'desc'        // Newest first
});
```

## Testing

1. Add at least one testimonial in WordPress Admin
2. Make sure the testimonial is published
3. Visit your Next.js site - the testimonials should appear above the footer
4. If no testimonials appear, check the browser console for error messages

## Troubleshooting

### No Testimonials Showing:
1. Check if testimonials exist in WordPress Admin
2. Verify testimonials are published (not draft)
3. Check browser console for API errors
4. Verify WordPress REST API is accessible: `yoursite.com/wp-json/wp/v2/testimonials`

### ACF Fields Not Showing:
1. Make sure ACF plugin is installed and activated
2. Check if the field group is assigned to the testimonial post type
3. Re-save the testimonials-cpt.php file or reactivate the plugin

### API Errors:
1. Check WordPress REST API permissions
2. Verify CORS settings if Next.js and WordPress are on different domains
3. Check WordPress error logs for server-side issues