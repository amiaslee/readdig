import { ParseFeedType, ParseArticleType } from './src/parsers/types.js';

console.log('Verifying Backend Changes...');

let passed = true;

// Test ParseFeedType
const type = ParseFeedType('youtube');
if (type === 'youtube') {
    console.log('PASS: ParseFeedType("youtube") returns "youtube"');
} else {
    console.error(`FAIL: ParseFeedType("youtube") returned "${type}"`);
    passed = false;
}

// Test ParseArticleType
const articleType = ParseArticleType('youtube');
if (articleType === 'video') {
    console.log('PASS: ParseArticleType("youtube") returns "video"');
} else {
    console.error(`FAIL: ParseArticleType("youtube") returned "${articleType}"`);
    passed = false;
}

if (passed) {
    console.log('All backend verification tests passed.');
    process.exit(0);
} else {
    console.error('Some backend verification tests failed.');
    process.exit(1);
}
