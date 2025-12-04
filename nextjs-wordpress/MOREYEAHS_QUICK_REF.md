# Moreyeahs Heading Test Block - Quick Reference

## Block Info
- **Name:** `acf/moreyeahs-heading-test`
- **Title:** Moreyeahs Heading Test
- **Category:** Formatting
- **Icon:** Heading

## Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| heading | Text | Yes | - |
| subheading | Text | No | - |
| text_color | Color | No | #000000 |
| background_color | Color | No | transparent |
| alignment | Radio | No | center |

## Installation

```bash
# 1. Copy PHP template
cp wordpress-theme-files/blocks/moreyeahs-heading-test.php your-theme/blocks/

# 2. Import ACF fields
WordPress Admin → Custom Fields → Tools → Import
Upload: ACF_FIELD_GROUPS.json

# 3. Test
Add block in WordPress → Fill fields → Publish → View in Next.js
```

## Usage in WordPress

```
1. Click "+" to add block
2. Search "Moreyeahs Heading Test"
3. Fill fields:
   - Heading: "Your Title"
   - Subheading: "Your subtitle"
   - Text Color: Pick color
   - Background: Pick color
   - Alignment: Choose left/center/right
4. Publish
```

## Component Props

```typescript
interface MoreyeahsHeadingTestBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    text_color?: string;
    background_color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}
```

## Files

### Next.js
- `src/components/blocks/MoreyeahsHeadingTestBlock.tsx`
- `src/components/blocks/BlockRenderer.tsx` (updated)

### WordPress
- `wordpress-theme-files/blocks/moreyeahs-heading-test.php`
- `wordpress-theme-files/functions.php` (updated)
- `wordpress-theme-files/ACF_FIELD_GROUPS.json` (updated)

## Quick Examples

### Hero Style
```
Heading: "Welcome!"
Subheading: "Start your journey"
Text: #ffffff
Background: #2563eb
Align: center
```

### Section Header
```
Heading: "Our Services"
Subheading: "What we offer"
Text: #1f2937
Background: #f3f4f6
Align: left
```

### Call-out
```
Heading: "Limited Offer!"
Subheading: "Save 50%"
Text: #dc2626
Background: #fef2f2
Align: center
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Block not in WordPress | Check functions.php, verify blocks/ folder |
| Not rendering in Next.js | Check BlockRenderer import |
| Fields not showing | Import ACF field group |
| Colors not working | Check hex format (#000000) |

## Documentation

- **Setup:** `MOREYEAHS_HEADING_TEST_BLOCK.md`
- **Examples:** `MOREYEAHS_BLOCK_EXAMPLE.md`
- **Complete:** `MOREYEAHS_BLOCK_COMPLETE.md`

---

**Quick Start:** Copy files → Import ACF → Test in WordPress → View in Next.js ✅
