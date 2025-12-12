// Test the debug endpoint

async function testDebugEndpoint() {
    try {
        console.log('Testing debug endpoint...\n');
        
        const response = await fetch('http://localhost/moreyeahs-new/wp-json/wp/v2/test-navigation-transform');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('=== DEBUG ENDPOINT RESPONSE ===');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.function_exists) {
            console.log('\n✅ Function exists and is callable');
            
            if (data.transformed_data && data.transformed_data.regions && Array.isArray(data.transformed_data.regions)) {
                console.log('\n✅ Transformation successful!');
                console.log(`Number of regions: ${data.transformed_data.regions.length}`);
                
                data.transformed_data.regions.forEach((region, index) => {
                    console.log(`Region ${index + 1}: ${region.name} (${region.link || 'No link'})`);
                });
            } else {
                console.log('\n❌ Transformation failed or regions not properly structured');
            }
        } else {
            console.log('\n❌ Function does not exist');
        }
        
    } catch (error) {
        console.error('Error testing debug endpoint:', error.message);
    }
}

testDebugEndpoint();