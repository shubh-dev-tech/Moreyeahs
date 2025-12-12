// Test the transformation logic locally

function transform_navigation_next_block_data(data) {
    console.log('transform_navigation_next_block_data called with data:', JSON.stringify(data, null, 2));
    
    // Transform regions
    if (data.regions && typeof data.regions === 'number') {
        const regions_count = data.regions;
        const regions = [];
        
        for (let i = 0; i < regions_count; i++) {
            const name_key = `regions_${i}_name`;
            const link_key = `regions_${i}_link`;
            
            if (data[name_key]) {
                const region = {
                    name: data[name_key]
                };
                
                if (data[link_key]) {
                    region.link = data[link_key];
                }
                
                regions.push(region);
            }
        }
        
        data.regions = regions;
        
        // Clean up flattened keys
        for (let i = 0; i < regions_count; i++) {
            delete data[`regions_${i}_name`];
            delete data[`regions_${i}_link`];
            delete data[`_regions_${i}_name`];
            delete data[`_regions_${i}_link`];
        }
    }
    
    console.log('transform_navigation_next_block_data result:', JSON.stringify(data, null, 2));
    return data;
}

// Test data from the API response
const testData = {
  "regions_0_name": "Europe",
  "_regions_0_name": "field_navigation_next_region_name",
  "regions_0_link": "#",
  "_regions_0_link": "field_navigation_next_region_link",
  "regions_1_name": "Asia Pacific",
  "_regions_1_name": "field_navigation_next_region_name",
  "regions_1_link": "#",
  "_regions_1_link": "field_navigation_next_region_link",
  "regions_2_name": "Americas",
  "_regions_2_name": "field_navigation_next_region_name",
  "regions_2_link": "#",
  "_regions_2_link": "field_navigation_next_region_link",
  "regions_3_name": "Middle East and Africa",
  "_regions_3_name": "field_navigation_next_region_name",
  "regions_3_link": "#",
  "_regions_3_link": "field_navigation_next_region_link",
  "regions": 4,
  "_regions": "field_navigation_next_regions",
  "heading": "Let's help you navigate your next 1",
  "_heading": "field_navigation_next_heading",
  "button_text": "CONTACT US",
  "_button_text": "field_navigation_next_button_text",
  "button_link": "#",
  "_button_link": "field_navigation_next_button_link"
};

console.log('=== TESTING TRANSFORMATION ===');
const result = transform_navigation_next_block_data(JSON.parse(JSON.stringify(testData)));
console.log('\n=== FINAL RESULT ===');
console.log(JSON.stringify(result, null, 2));