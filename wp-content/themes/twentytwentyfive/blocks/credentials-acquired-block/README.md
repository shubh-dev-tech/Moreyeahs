# Credentials Acquired Block

A modern, responsive ACF block for displaying professional credentials and certifications with colored indicator dots.

## Features

- **Customizable Heading**: Main title for the credentials section
- **Background Color**: Customizable background color with gradient effect
- **Text Color**: Adjustable text color for optimal contrast
- **Repeatable Credentials**: Add unlimited credentials with individual dot colors
- **Responsive Design**: Optimized for all screen sizes
- **Hover Effects**: Interactive animations on credential items
- **Dark Theme**: Designed with a professional dark background

## Block Settings

### Main Settings
- **Heading**: The main title displayed at the top (default: "Credentials Acquired")
- **Background Color**: Section background color (default: #1a1a2e)
- **Text Color**: Color for all text elements (default: #ffffff)

### Credentials List (Repeater)
Each credential item includes:
- **Credential Title**: The name/title of the certification
- **Dot Color**: Color for the indicator dot (default: #00A3E0)

## Usage

1. Add the "Credentials Acquired Block" to your page/post
2. Set the main heading and color preferences
3. Add credentials using the repeater field:
   - Enter the credential title
   - Choose an appropriate dot color for visual categorization
4. Save and preview

## Styling

The block includes:
- Gradient background effect
- Smooth hover animations
- Responsive grid layout
- Staggered fade-in animations
- Professional typography

## Color Suggestions

Based on the design, consider these color schemes for different credential types:
- **Azure/Microsoft**: #00A3E0 (Blue)
- **AWS**: #FFD700 (Gold) or #32CD32 (Green)
- **Red Hat**: #8A2BE2 (Purple)
- **Google Cloud**: #4285F4 (Blue)
- **General**: #00A3E0 (Default Blue)

## Responsive Breakpoints

- **Desktop**: 2-column grid layout
- **Tablet** (768px): Single column with adjusted spacing
- **Mobile** (480px): Compact layout with smaller elements

## Block Alignment

Supports:
- Full width alignment
- Wide alignment
- Default alignment

## Example Data Structure

```php
$credentials_list = array(
    array(
        'credential_title' => 'Azure DevOps Engineer Expert',
        'dot_color' => '#00A3E0'
    ),
    array(
        'credential_title' => 'AWS Certified Solutions Architect - Professional',
        'dot_color' => '#32CD32'
    ),
    array(
        'credential_title' => 'Red Hat Certified System Administrator (RHCSA)',
        'dot_color' => '#8A2BE2'
    )
);
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- Graceful degradation for older browsers