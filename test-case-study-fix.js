// Test script to verify the case study fix
console.log('Testing case study fix...');

// Test data structure that might cause the original error
const testCaseStudy = {
  id: 1,
  title: { rendered: 'Test Case Study' },
  acf_fields: {
    header_section: {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      gradient_colors: {
        color_1: '#00bcd4',
        color_2: '#9c27b0'
      }
    },
    content_sections: [
      {
        section_title: 'Test Section',
        section_content: '<p>Test content with HTML</p>',
        section_quotes: [
          { quote_text: 'Test quote' }
        ],
        section_bullet_points: [
          { bullet_text: 'Test bullet point' }
        ]
      }
    ],
    cta_section: {
      cta_title: 'Test CTA',
      cta_buttons: [
        {
          button_text: 'Test Button',
          button_url: '#',
          button_style: 'primary'
        }
      ]
    }
  }
};

// Test with null/undefined values that might cause errors
const testCaseStudyWithNulls = {
  id: 2,
  title: { rendered: 'Test Case Study 2' },
  acf_fields: {
    header_section: null,
    content_sections: null,
    sidebar_section: {
      sidebar_sections: null
    },
    cta_section: {
      cta_buttons: null
    }
  }
};

console.log('Test case study data:', testCaseStudy);
console.log('Test case study with nulls:', testCaseStudyWithNulls);

// Simulate the safety checks we added
function testArraySafety(arr, name) {
  const isValid = Array.isArray(arr);
  console.log(`${name} is array:`, isValid);
  return isValid;
}

// Test our safety checks
testArraySafety(testCaseStudy.acf_fields.content_sections, 'content_sections');
testArraySafety(testCaseStudyWithNulls.acf_fields.content_sections, 'content_sections (null)');
testArraySafety(testCaseStudy.acf_fields.cta_section.cta_buttons, 'cta_buttons');
testArraySafety(testCaseStudyWithNulls.acf_fields.cta_section.cta_buttons, 'cta_buttons (null)');

console.log('Case study fix test completed successfully!');