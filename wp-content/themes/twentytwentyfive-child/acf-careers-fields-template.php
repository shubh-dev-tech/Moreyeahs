<?php
/**
 * ACF Field Group Template for Careers
 * 
 * This file provides the ACF field group configuration for the Careers custom post type.
 * You can use this to manually create the fields in ACF, or import it using ACF's import tool.
 * 
 * To use this:
 * 1. Go to Custom Fields > Tools in WordPress admin
 * 2. Click "Import Field Groups"
 * 3. Copy the JSON below and paste it into the import field
 * 4. Click "Import JSON"
 */

// ACF Field Group JSON for Careers
$careers_acf_fields = array(
    'key' => 'group_careers_details',
    'title' => 'Career Details',
    'fields' => array(
        // Background Image
        array(
            'key' => 'field_career_background_image',
            'label' => 'Background Image',
            'name' => 'background_image',
            'type' => 'image',
            'instructions' => 'Upload a background image for the job detail page header',
            'required' => 0,
            'return_format' => 'array',
            'preview_size' => 'medium',
            'library' => 'all',
        ),
        
        // Job Type
        array(
            'key' => 'field_career_job_type',
            'label' => 'Job Type',
            'name' => 'job_type',
            'type' => 'text',
            'instructions' => 'Enter the job type (e.g., Full Time, Part Time)',
            'required' => 0,
            'default_value' => '',
            'placeholder' => 'e.g., Full Time',
        ),
        
        // Department
        array(
            'key' => 'field_career_department',
            'label' => 'Department',
            'name' => 'department',
            'type' => 'text',
            'instructions' => 'Enter the department (e.g., Engineering, Product, Design)',
            'required' => 0,
            'default_value' => '',
            'placeholder' => 'e.g., Engineering',
        ),
        
        // Location / Job Preference
        array(
            'key' => 'field_career_location',
            'label' => 'Location / Job Preference',
            'name' => 'location',
            'type' => 'text',
            'instructions' => 'Enter the job location/preference (e.g., On-Site, Remote, Hybrid)',
            'required' => 0,
            'default_value' => '',
            'placeholder' => 'e.g., Remote',
        ),
        
        // Experience Level
        array(
            'key' => 'field_career_experience_level',
            'label' => 'Experience Level',
            'name' => 'experience_level',
            'type' => 'text',
            'instructions' => 'Enter the experience level (e.g., Intern, Fresher, Experienced)',
            'required' => 0,
            'default_value' => '',
            'placeholder' => 'e.g., Experienced',
        ),
        
        // Job Sections (Repeater)
        array(
            'key' => 'field_career_job_sections',
            'label' => 'Job Sections',
            'name' => 'job_sections',
            'type' => 'repeater',
            'instructions' => 'Add job sections like Overview, Responsibilities, Requirements, etc.',
            'required' => 0,
            'layout' => 'block',
            'button_label' => 'Add Section',
            'sub_fields' => array(
                // Section Heading
                array(
                    'key' => 'field_career_section_heading',
                    'label' => 'Section Heading',
                    'name' => 'section_heading',
                    'type' => 'text',
                    'instructions' => 'Enter the section heading (e.g., "Overview", "Responsibilities")',
                    'required' => 1,
                    'default_value' => '',
                    'placeholder' => 'e.g., Overview',
                ),
                
                // Section Content (Nested Repeater)
                array(
                    'key' => 'field_career_section_content',
                    'label' => 'Section Content',
                    'name' => 'section_content',
                    'type' => 'repeater',
                    'instructions' => 'Add paragraphs and bullet points for this section',
                    'required' => 0,
                    'layout' => 'block',
                    'button_label' => 'Add Content Block',
                    'sub_fields' => array(
                        // Paragraph
                        array(
                            'key' => 'field_career_paragraph',
                            'label' => 'Paragraph',
                            'name' => 'paragraph',
                            'type' => 'textarea',
                            'instructions' => 'Enter a paragraph of text (leave empty if only using bullet points)',
                            'required' => 0,
                            'rows' => 4,
                            'default_value' => '',
                        ),
                        
                        // Bullet Points (Nested Repeater)
                        array(
                            'key' => 'field_career_bullet_points',
                            'label' => 'Bullet Points',
                            'name' => 'bullet_points',
                            'type' => 'repeater',
                            'instructions' => 'Add bullet points for this content block',
                            'required' => 0,
                            'layout' => 'table',
                            'button_label' => 'Add Bullet Point',
                            'sub_fields' => array(
                                // Bullet Text
                                array(
                                    'key' => 'field_career_bullet_text',
                                    'label' => 'Bullet Text',
                                    'name' => 'bullet_text',
                                    'type' => 'text',
                                    'instructions' => 'Enter the bullet point text',
                                    'required' => 1,
                                    'default_value' => '',
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'careers',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => true,
    'description' => 'Fields for career/job postings',
);

// Uncomment the line below to programmatically register the field group
// acf_add_local_field_group($careers_acf_fields);

/**
 * Export as JSON for ACF Import Tool
 * Copy everything between the START and END markers
 */

/*
=== START ACF JSON EXPORT ===
<?php echo json_encode(array($careers_acf_fields), JSON_PRETTY_PRINT); ?>
=== END ACF JSON EXPORT ===
*/
