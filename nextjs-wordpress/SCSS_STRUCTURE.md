# SCSS Structure Documentation

## Overview
The CSS has been converted to SCSS with a modular structure for better maintainability and organization.

## File Structure

```
src/styles/
├── main.scss                    # Main entry point (imports all other files)
├── _variables.scss              # Color, font, and layout variables
├── _mixins.scss                 # Reusable mixins (responsive, transitions, etc.)
├── _fonts.scss                  # Font-face declarations
├── _reset.scss                  # CSS reset and base styles
├── _layout.scss                 # Layout utilities (container, site-wrapper)
├── _animations.scss             # Keyframe animations
├── _accessibility.scss          # Accessibility styles
└── components/
    ├── _header.scss             # Header and navigation styles
    ├── _mobile-menu.scss        # Mobile menu and hamburger styles
    ├── _footer.scss             # Footer styles
    ├── _hero.scss               # Hero section styles
    ├── _posts.scss              # Post grid and post card styles
    ├── _post-single.scss        # Single post page styles
    ├── _page.scss               # Page content and not-found styles
    └── _slider.scss             # Slider component styles
```

## Usage

The main SCSS file is imported in `src/app/globals.scss`:

```scss
@import '../styles/main.scss';
```

## Variables

All design tokens are centralized in `_variables.scss`:

- **Colors**: `$color-primary`, `$color-text`, `$color-text-light`, `$color-border`, `$color-bg`, `$color-bg-alt`
- **Fonts**: `$font-sans`, `$font-tungsten`
- **Layout**: `$max-width`, `$spacing`
- **Breakpoints**: `$breakpoint-mobile` (768px), `$breakpoint-tablet` (1024px)

## Mixins

Reusable mixins in `_mixins.scss`:

- `@include mobile { ... }` - Mobile styles (max-width: 768px)
- `@include tablet { ... }` - Tablet styles (769px - 1024px)
- `@include desktop { ... }` - Desktop styles (min-width: 1025px)
- `@include transition($properties...)` - Transition helper
- `@include flex-center` - Flexbox centering

## Example Usage

```scss
.my-component {
  color: $color-primary;
  padding: $spacing;
  @include transition(all 0.3s ease);

  @include mobile {
    padding: calc($spacing / 2);
  }

  &__element {
    @include flex-center;
    background: $color-bg-alt;
  }
}
```

## Benefits

1. **Modular**: Each component has its own file
2. **Maintainable**: Easy to find and update specific styles
3. **Reusable**: Variables and mixins reduce code duplication
4. **Scalable**: Easy to add new components
5. **BEM Naming**: Uses BEM methodology with SCSS nesting
