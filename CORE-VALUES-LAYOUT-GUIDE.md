# Core Values Block - Layout Guide

## Updated Layout Structure

The block now supports **8 core values** arranged in 3 rows:

```
┌─────────────────────────────────────────────────────────────┐
│  Row 1: 4 Blocks (Equal Width)                              │
├──────────┬──────────┬──────────┬──────────┐                 │
│ Value 1  │ Value 2  │ Value 3  │ Value 4  │                 │
│ Humility │Integrity │Team      │Account-  │                 │
│          │          │Spirit    │ability   │                 │
└──────────┴──────────┴──────────┴──────────┘                 │
                                                               │
┌─────────────────────────────────────────────────────────────┐
│  Row 2: 1 Block + Team Image + 1 Block                      │
├──────────┬──────────────────────────────┬──────────┐        │
│ Value 5  │      Team Image (2x)         │ Value 6  │        │
│Continue  │                              │Gratitude │        │
│Evolve    │                              │          │        │
└──────────┴──────────────────────────────┴──────────┘        │
                                                               │
┌─────────────────────────────────────────────────────────────┐
│  Row 3: 1 Block + Center Content + 1 Block                  │
├──────────┬──────────────────────────────┬──────────┐        │
│ Value 7  │  Push Beyond Boundaries      │ Value 8  │        │
│ Loyalty  │  (Center Text Content)       │Inclusion │        │
│          │                              │          │        │
└──────────┴──────────────────────────────┴──────────┘        │
```

## Field Configuration

### Values (Repeater Field)
- **Min**: 1 value
- **Max**: 8 values
- **Recommended**: 8 values for complete layout

### Value Order in WordPress:
1. **Value 1** → Row 1, Position 1 (Top-left)
2. **Value 2** → Row 1, Position 2
3. **Value 3** → Row 1, Position 3
4. **Value 4** → Row 1, Position 4 (Top-right)
5. **Value 5** → Row 2, Left side (before image)
6. **Value 6** → Row 2, Right side (after image)
7. **Value 7** → Row 3, Left side (before center content)
8. **Value 8** → Row 3, Right side (after center content)

## Responsive Behavior

### Desktop (>1024px)
- **Row 1**: 4 columns (equal width)
- **Row 2**: 1 column + 2 columns (image) + 1 column
- **Row 3**: 1 column + 2 columns (center) + 1 column

### Tablet (768px - 1024px)
- **Row 1**: 2 columns (2x2 grid)
- **Row 2**: Stacked (Value 5, Image, Value 6)
- **Row 3**: Stacked (Value 7, Center Content, Value 8)

### Mobile (<768px)
- **All Rows**: Single column (stacked vertically)
- Order: Value 1-4, Value 5, Image, Value 6, Value 7, Center Content, Value 8

## Background Image

The background image is now properly configured with:
- **Fixed attachment** for parallax effect
- **Semi-transparent overlay** (92% white) for readability
- **Cover sizing** to fill the entire section
- **Center positioning** for optimal display

### To Add Background Image:
1. In WordPress block settings
2. Scroll to "Background Image (Optional)"
3. Upload or select an image
4. The image will appear behind all content with a white overlay

## Example Content

Based on your reference image:

**Row 1 (4 blocks):**
1. **Humility** - We remain grounded and open to learning...
2. **Integrity** - We act with honesty, transparency...
3. **Team Spirit** - We believe success is a collective achievement...
4. **Accountability** - We remain grounded and open to learning...

**Row 2 (1 + Image + 1):**
5. **Continuously Evolve & Improve** - We are dedicated to our people...
6. **Gratitude & Appreciation** - We believe in recognizing every effort...

**Row 3 (1 + Center + 1):**
7. **Loyalty** - We are dedicated to our people, clients, and mission...
8. **Inclusion & Diversity** - We believe diverse perspectives make us...

**Center Content:**
- **Heading**: Push Beyond Boundaries
- **Description**: We challenge the ordinary, question limits, and pursue bold ideas with courage...

## Grid Proportions

### Row 1
```css
grid-template-columns: repeat(4, 1fr);
/* Each block: 25% width */
```

### Row 2
```css
grid-template-columns: 1fr 2fr 1fr;
/* Left block: 25% | Image: 50% | Right block: 25% */
```

### Row 3
```css
grid-template-columns: 1fr 2fr 1fr;
/* Left block: 25% | Center: 50% | Right block: 25% */
```

## Styling Notes

- **Cards**: White background with shadow and hover effect
- **Team Image**: Rounded corners, 3:1 aspect ratio on desktop
- **Center Content**: White background card with padding
- **Spacing**: 40px between rows, 30px between cards
- **Background**: Optional image with 92% white overlay

## Testing Checklist

- [ ] Add 8 values in WordPress
- [ ] Upload team image
- [ ] Set center heading and description
- [ ] Upload background image (optional)
- [ ] Test on desktop (>1024px)
- [ ] Test on tablet (768-1024px)
- [ ] Test on mobile (<768px)
- [ ] Verify background image appears
- [ ] Check hover effects on cards
- [ ] Verify scroll animations work

## Troubleshooting

### Background Image Not Showing?
1. Check if image is uploaded in ACF field
2. Verify image URL is correct
3. Clear browser cache
4. Check if overlay is too opaque (adjust in CSS)

### Layout Breaking?
1. Ensure you have exactly 8 values
2. Check responsive breakpoints
3. Clear Next.js build cache
4. Verify CSS is compiled

### Cards Not Aligned?
1. Check grid-template-columns in CSS
2. Verify all cards have content
3. Test with different content lengths
4. Check for custom CSS conflicts
