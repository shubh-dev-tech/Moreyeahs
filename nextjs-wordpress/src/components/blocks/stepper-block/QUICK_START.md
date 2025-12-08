# Quick Start: Stepper Block

## Step 1: Add the Stepper Block
1. Add the "Stepper Block" to the top of your page
2. Choose "Auto-detect sections from page" mode
3. Save/publish

## Step 2: Add HTML Anchors to Your Blocks

For each block you want in the navigation:

1. **Click on the block** you want to add to navigation
2. **Look at the right sidebar** → Click "Advanced" to expand
3. **Find "HTML ANCHOR"** field
4. **Enter an ID** (no spaces):
   - Examples: `hero`, `operating_models`, `about_us`, `careers`
5. **Save the page**

## That's It!

The stepper will automatically:
- ✅ Find all blocks with HTML Anchors
- ✅ Extract their headings as labels
- ✅ Create clickable navigation
- ✅ Highlight the active section as you scroll

## Example HTML Anchors

| Block Type | Suggested Anchor | Label (auto-detected) |
|------------|------------------|----------------------|
| Hero/Slider | `hero` | "Champions Evolve" |
| Promo Block | `operating_models` | "Operating Models" |
| Purpose Block | `our_purpose` | "Our Purpose:" |
| Counter Block | `about_us` | "About us" |
| Testimonial | `careers` | "Careers" |
| News Block | `news` | "In the news" |
| Investor Block | `investors` | "Investors" |
| Navigation Next | `contact` | "Let's help you navigate" |

## Tips

- Use lowercase letters, numbers, hyphens, or underscores only
- No spaces allowed in HTML Anchors
- Make each anchor unique on the page
- The stepper will use the block's heading as the label
