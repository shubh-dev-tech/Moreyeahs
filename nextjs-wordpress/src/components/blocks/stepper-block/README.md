# Stepper Block

A sticky/fixed vertical navigation stepper that automatically highlights the active section as you scroll.

## Features

- **Auto-Detection Mode**: Automatically finds all sections with IDs on your page
- **Manual Mode**: Manually define steps and section IDs
- **Fixed Position**: Stays on the left side of the screen while scrolling
- **Automatic Numbering**: Steps are numbered automatically (1, 2, 3, etc.)
- **Auto-Highlight**: Automatically highlights the current section as you scroll
- **Smooth Scroll**: Click any step to smoothly scroll to that section
- **Responsive**: Hides on tablets and mobile (< 1024px)

## Usage in WordPress

### Auto-Detection Mode (Recommended)

1. Add the "Stepper Block" to your page (usually at the top)
2. Select "Auto-detect sections from page" mode
3. Add an "HTML Anchor" to each block you want in the navigation:
   - Edit any block (Promo, Purpose, Counter, etc.)
   - Click "Advanced" in the right sidebar
   - Find the "HTML ANCHOR" field
   - Enter a unique ID (e.g., `operating_models`, `hero_slider`)
4. The stepper will automatically:
   - Find all blocks with HTML Anchors
   - Extract their headings as labels
   - Create navigation links

### Manual Mode

1. Add the "Stepper Block" to your page
2. Select "Manual entry" mode
3. Click "Add Step" for each section
4. For each step:
   - **Label**: Enter a custom name (e.g., "Operating Models")
   - **Section ID**: Enter the ID to link to (e.g., `operating_models`)

## Adding HTML Anchors to Blocks

Use WordPress's built-in HTML Anchor feature:

1. Edit any block (Promo Block, Purpose Block, etc.)
2. In the right sidebar, click "Advanced" to expand it
3. Find the "HTML ANCHOR" field
4. Enter a unique ID without spaces (e.g., `operating_models`, `hero_slider`, `about_us`)
5. The block will now have that ID and appear in the auto-detected stepper

**Note:** The HTML Anchor field is a standard WordPress feature available in the Advanced panel of every block.

### Common Section ID Examples

- `hero_slider` - Hero/slider section
- `core_capabilities` - Core capabilities
- `operating_models` - Operating models
- `talent_transformations` - Talent section
- `about_us` - About us section
- `investors` - Investors section
- `careers` - Careers section
- `contact_us` - Contact section

## Styling

- Fixed on the left side, vertically centered
- Vertical line connects all steps
- Active step has:
  - Highlighted background box
  - White accent bar on the left
  - Visible label text
- Inactive steps show only numbers
- Hover on inactive steps shows label at 70% opacity

## ACF Fields

- **Stepper Mode** (Radio):
  - Auto-detect sections from page (recommended)
  - Manual entry
- **Steps** (Repeater - only shown in manual mode):
  - **Label** (Text): Custom name for the step
  - **Section ID** (Text): The HTML ID of the section to scroll to
- **Background Color** (Color Picker): Default transparent

## Benefits of Auto-Detection

- No need to manually enter each step
- Automatically stays in sync with your page content
- Uses WordPress's built-in HTML Anchor feature
- Just add anchors to blocks and they appear in navigation
- Easier to maintain and update

## Troubleshooting

**Q: I don't see the HTML Anchor field**
A: Make sure you've clicked "Advanced" in the block's right sidebar to expand that section.

**Q: The stepper isn't detecting my blocks**
A: Make sure you've entered an HTML Anchor (in the Advanced panel) for each block you want to appear in the navigation.
