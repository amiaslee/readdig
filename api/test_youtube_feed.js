import { ParseFeed } from './src/parsers/feed.js';

console.log('Testing YouTube feed parsing...');

const testUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ';

ParseFeed(testUrl)
    .then((result) => {
        console.log('Feed parsed successfully!');
        console.log('Feed type:', result.type);
        console.log('Feed title:', result.title);
        console.log('Number of items:', result.items.length);
        
        if (result.type === 'youtube') {
            console.log('✓ SUCCESS: Feed type is correctly set to "youtube"');
            process.exit(0);
        } else {
            console.error('✗ FAIL: Feed type is', result.type, 'but expected "youtube"');
            process.exit(1);
        }
    })
    .catch((err) => {
        console.error('✗ FAIL: Error parsing feed:', err.message);
        process.exit(1);
    });
