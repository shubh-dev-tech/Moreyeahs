# Dual Menu Implementation Guide (Infosys Style)

## Overview
The header now supports TWO separate menus like the Infosys website:
1. **Primary Menu** - Horizontal navigation links (visible on desktop only)
2. **Burger Menu** - Hamburger button that opens a slide-in panel (visible on all devices)

## Features

### 1. Hamburger Button
- **Design**: Three horizontal lines (hamburger icon)
- **Location**: Top right corner of the header
- **Animation**: Transforms into an X when menu is open
- **Responsive**: Only visible on mobile devices (< 768px)

### 2. Slide-in Menu Panel
- **Animation**: Slides in from right to left
- **Background**: Light gray (#f5f5f5) with subtle backdrop blur
- **Width**: 90% of screen width (max 400px)
- **Close Button**: X icon in top right corner of the panel

### 3. Dynamic Menu Items
- **Data Source**: WordPress menu from "primary" location
- **Styling**: Clean, modern design with proper spacing
- **Hover Effects**: Subtle background color change on hover

### 4. Submenu Support (2nd Level Menu)
- **Toggle Icon**: Plus (+) icon that rotates to X when open
- **Animation**: Smooth expand/collapse with max-height transition
- **Indentation**: Submenus are indented for visual hierarchy
- **Nested Support**: Supports multiple levels of submenus

## How It Works

### Menu Structure
```
Primary Menu Item 1
Primary Menu Item 2
  ├─ Submenu Item 2.1
  ├─ Submenu Item 2.2
  └─ Submenu Item 2.3
      └─ Sub-submenu Item 2.3.1
Primary Menu Item 3
```

### User Interaction
1. Click hamburger button → Menu slides in from right
2. Click menu item → Navigate to page and close menu
3. Click + icon next to menu item → Expand submenu
4. Click X button or overlay → Close menu

## Customization

### Colors
Edit in `globals.css`:
- Menu background: `.mobile-menu__nav { background-color: #f5f5f5; }`
- Link color: `.mobile-menu__link { color: #333; }`
- Hover color: `.mobile-menu__link:hover { color: var(--color-primary); }`

### Animations
- Slide duration: `.mobile-menu__nav { transition: transform 0.3s ... }`
- Submenu expand: `.mobile-menu__submenu { transition: max-height 0.3s ... }`

### Sizing
- Menu width: `.mobile-menu__nav { max-width: 400px; }`
- Breakpoint: `@media (max-width: 768px)`

## WordPress Setup

### Creating TWO Menus in WordPress

#### Menu 1: Primary Menu (Desktop Horizontal Links)
1. Go to **Appearance → Menus**
2. Create a new menu called "Primary Menu"
3. Add 3-5 main navigation items (e.g., Navigate your next, Infosys Knowledge Institute, Investors, Careers)
4. Keep it simple - no submenus needed
5. Assign to **Primary Menu** location
6. Save menu

#### Menu 2: Secondary Menu (Burger Menu Content)
1. Go to **Appearance → Menus**
2. Create a new menu called "Secondary Menu" or "Full Navigation"
3. Add all your navigation items with full hierarchy
4. Create submenus by dragging items to the right
5. Assign to **Secondary Menu** location
6. Save menu

**Note**: If you only create a Primary Menu, the burger button will show the Primary Menu content. If you create both, the burger button will show the Secondary Menu.

### Adding Submenus
1. Drag menu items slightly to the right to create hierarchy
2. Items indented under a parent become submenus
3. Can nest multiple levels deep

## Technical Details

### Components
- **Header.tsx**: Main header component with desktop and mobile menu
- **MobileMenu.tsx**: Mobile menu component with hamburger button and slide-in panel

### Key Features
- Body scroll lock when menu is open
- Click outside to close
- Keyboard accessible
- Smooth animations
- Responsive design

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- CSS transitions and transforms
