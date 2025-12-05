# Counter Block Setup Guide

This guide will help you set up the Counter Block in your WordPress + Next.js project.

## Files Created

### Next.js Files
- `src/components/blocks/counter-block/CounterBlock.tsx` - React component
- `src/components/blocks/counter-block/styles.scss` - Component styles
- `src/components/blocks/counter-block/acf.json` - ACF field configuration

### WordPress Files
- `wp-content/themes/twentytwentyfive/blocks/counter-block.php` - WordPress template
- `wp-content/themes/twentytwentyfive/acf-json/group_counter_block.json` - ACF field group

## Setup Steps

### 1. Register the Block in WordPress

Add this code to your theme's `functions.php` or `inc/acf-blocks.php`:

```php
// Register Counter Block
acf_register_block_type(array(
    'name'              => 'counter-block',
    'title'             => __('Counter Block'),
    'description'       => __('A block to display statistics and counters'),
    'render_template'   => get_template_directory() . '/blocks/counter-block.php',
    'category'          => 'formatting',
    'icon'              => 'chart-bar',
    'keywords'          => array('counter', 'stats', 'statistics', 'numbers'),
    'supports'          => array(
        'align' => false,
        'mode' => true,
        'jsx' => true
    ),
));
```

### 2. Import ACF Fields

1. Go to WordPress Admin → Custom Fields → Tools
2. Click "Import Field Groups"
3. Upload or paste the content from `acf-json/group_counter_block.json`
4. Click "Import"

### 3. Add Block to Next.js

Import and use the block in your Next.js pages:

```tsx
import CounterBlock from '@/components/blocks/counter-block/CounterBlock';

// Example usage
<CounterBlock 
  data={{
    heading: "About us",
    sub_heading: "A global leader in next-generation digital services and consulting",
    counters: [
      {
        number: "59",
        prefix: "",
        suffix: "",
        label: "countries where we have trusting clients"
      },
      {
        number: "19.7",
        prefix: "US$",
        suffix: "",
        label: "billion total revenue (LTM)"
      },
      {
        number: "24",
        prefix: "",
        suffix: "+",
        label: "million training (hours) conducted for employees, globally"
      }
    ]
  }}
/>
```

### 4. Add to GraphQL Query

If using GraphQL, add this fragment to your queries:

```graphql
fragment CounterBlockFields on AcfCounterBlock {
  heading
  subHeading
  counters {
    number
    prefix
    suffix
    label
  }
}
```

## Block Features

- Dynamic heading and sub-heading
- Repeater field for multiple counters
- Prefix support (e.g., US$, €)
- Suffix support (e.g., +, %)
- Responsive grid layout
- Fully customizable labels

## Usage in WordPress Editor

1. Create or edit a page/post
2. Click the "+" button to add a block
3. Search for "Counter Block"
4. Fill in the fields:
   - Heading (optional)
   - Sub Heading (optional)
   - Add counters with the "Add Counter" button
   - For each counter:
     - Number (required)
     - Prefix (optional)
     - Suffix (optional)
     - Label (optional)

## Styling

The block uses SCSS for styling. You can customize the styles in `styles.scss`:

- Colors
- Font sizes
- Spacing
- Grid layout
- Responsive breakpoints

## Example Data Structure

```json
{
  "heading": "About us",
  "sub_heading": "A global leader in next-generation digital services and consulting",
  "counters": [
    {
      "number": "59",
      "prefix": "",
      "suffix": "",
      "label": "countries where we have trusting clients"
    },
    {
      "number": "19.7",
      "prefix": "US$",
      "suffix": "",
      "label": "billion total revenue (LTM)"
    },
    {
      "number": "24",
      "prefix": "",
      "suffix": "+",
      "label": "million training (hours) conducted for employees, globally"
    }
  ]
}
```
