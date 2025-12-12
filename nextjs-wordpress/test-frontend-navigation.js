// Test if the Navigation Next Block is rendering on the frontend

async function testFrontendNavigation() {
    try {
        console.log('Testing Navigation Next Block on frontend...\n');
        
        // Test the home page
        const response = await fetch('http://localhost:3001/');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        console.log('=== FRONTEND TEST RESULTS ===');
        
        // Check if the navigation-next-block class exists
        if (html.includes('navigation-next-block')) {
            console.log('✅ Navigation Next Block CSS class found in HTML');
        } else {
            console.log('❌ Navigation Next Block CSS class NOT found in HTML');
        }
        
        // Check for region names
        const regions = ['Europe', 'Asia Pacific', 'Americas', 'Middle East and Africa'];
        let foundRegions = 0;
        
        regions.forEach(region => {
            if (html.includes(region)) {
                console.log(`✅ Region "${region}" found in HTML`);
                foundRegions++;
            } else {
                console.log(`❌ Region "${region}" NOT found in HTML`);
            }
        });
        
        // Check for heading and button
        if (html.includes('Let\'s help you navigate your next') || html.includes('Let&#x27;s help you navigate your next')) {
            console.log('✅ Navigation heading found in HTML');
        } else {
            console.log('❌ Navigation heading NOT found in HTML');
        }
        
        if (html.includes('CONTACT US')) {
            console.log('✅ Contact button found in HTML');
        } else {
            console.log('❌ Contact button NOT found in HTML');
        }
        
        console.log(`\n=== SUMMARY ===`);
        console.log(`Regions found: ${foundRegions}/${regions.length}`);
        
        if (foundRegions === regions.length && html.includes('navigation-next-block')) {
            console.log('🎉 Navigation Next Block appears to be rendering correctly!');
        } else {
            console.log('⚠️  Navigation Next Block may not be rendering properly');
        }
        
    } catch (error) {
        console.error('Error testing frontend:', error.message);
    }
}

testFrontendNavigation();