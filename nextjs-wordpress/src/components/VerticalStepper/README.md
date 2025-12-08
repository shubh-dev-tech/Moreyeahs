# Vertical Stepper Component

A fixed vertical navigation stepper that highlights sections as you scroll and displays section titles.

## Features

- Fixed position on the left side of the page
- Automatically highlights the active section based on scroll position
- Shows the title of the active section
- Smooth scroll to sections on click
- Responsive design

## Usage

### 1. Add Section IDs to Your Blocks

In `BlockRenderer.tsx`, the `BLOCK_SECTION_IDS` mapping assigns IDs to specific blocks:

```typescript
const BLOCK_SECTION_IDS: Record<string, string> = {
  'acf/hero': 'hero',
  'acf/purpose-block': 'purpose',
  'acf/promo-block': 'operating-models',
  'acf/counter-block': 'counter',
  'acf/testimonial-block': 'testimonials',
  'acf/news-block': 'news',
  'acf/investor-block': 'investors',
};
```

### 2. Configure Stepper Sections

In your page (e.g., `page.tsx`), define which sections should appear in the stepper:

```typescript
const stepperSections = [
  { id: 'hero', title: 'Home' },
  { id: 'purpose', title: 'Purpose' },
  { id: 'operating-models', title: 'Operating Models' },
  { id: 'counter', title: 'Stats' },
  { id: 'testimonials', title: 'Testimonials' },
  { id: 'news', title: 'News' },
  { id: 'investors', title: 'Investors' },
];
```

### 3. Add the Component

```typescript
<VerticalStepper sections={stepperSections} />
```

## Customization

### Styling

Edit `styles.scss` to customize:

- Position: Change `left` value
- Colors: Modify dot and line colors
- Spacing: Adjust `gap` between dots
- Animation: Customize the `slideIn` animation

### Section Detection

The component detects the active section based on scroll position. It considers a section active when it's in the middle of the viewport.

## Example

```typescript
import VerticalStepper from '@/components/VerticalStepper';

export default function Page() {
  const sections = [
    { id: 'section-1', title: 'Introduction' },
    { id: 'section-2', title: 'Features' },
    { id: 'section-3', title: 'Contact' },
  ];

  return (
    <>
      <VerticalStepper sections={sections} />
      <main>
        <section id="section-1">...</section>
        <section id="section-2">...</section>
        <section id="section-3">...</section>
      </main>
    </>
  );
}
```
