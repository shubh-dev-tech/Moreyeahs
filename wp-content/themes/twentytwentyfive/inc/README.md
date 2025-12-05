# Theme Inc Directory

This directory contains modular PHP files for theme functionality.

## Files

### acf-blocks.php
**Main ACF blocks registration file**
- Registers all ACF custom blocks
- Centralized block management
- Easy to add new blocks

### Documentation

- **ACF_BLOCKS_README.md** - Complete guide for ACF blocks system
- **QUICK_START.md** - Quick 3-step guide to add blocks
- **MIGRATION_SUMMARY.md** - Details of the migration from functions.php

## Usage

All files in this directory are automatically loaded by `functions.php`:

```php
require_once get_template_directory() . '/inc/acf-blocks.php';
```

## Adding New Functionality

Create new PHP files in this directory and include them in `functions.php`:

```php
require_once get_template_directory() . '/inc/your-new-file.php';
```

## Current Blocks

- Promo Block
- Full Width Left Text Section
- Image Grid Hover
- Icon Text Grid

See `QUICK_START.md` for how to add more blocks.
