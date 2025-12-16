/**
 * Test media ID 155
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';

async function testMedia155() {
    console.log('🔍 Testing media ID 155...\n');

    try {
        // Test media endpoint
        const mediaResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media/155`);
        
        if (mediaResponse.ok) {
            const media = await mediaResponse.json();
            console.log('✅ Media 155 found:');
            console.log('Title:', media.title.rendered);
            console.log('URL:', media.source_url);
            console.log('Alt text:', media.alt_text);
            console.log('MIME type:', media.mime_type);
            console.log('Width:', media.media_details?.width);
            console.log('Height:', media.media_details?.height);
        } else {
            console.log('❌ Media 155 not found:', mediaResponse.status);
        }

        // Also check all media to see what's available
        console.log('\n📸 All media:');
        const allMediaResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media?per_page=20`);
        
        if (allMediaResponse.ok) {
            const allMedia = await allMediaResponse.json();
            allMedia.forEach(media => {
                console.log(`ID ${media.id}: ${media.title.rendered} - ${media.source_url}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testMedia155();