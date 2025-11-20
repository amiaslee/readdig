export function ParseFeedType(feedType) {
	let publicationType;
	if (!feedType) {
		return publicationType;
	}
	if (feedType.toLowerCase().trim() === 'rss') {
		publicationType = 'rss';
	}
	if (feedType.toLowerCase().trim() === 'podcast') {
		publicationType = 'podcast';
	}
	if (feedType.toLowerCase().trim() === 'youtube') {
		publicationType = 'youtube';
	}
	return publicationType;
}

export function ParseArticleType(feedType) {
	let articleType;
	if (!feedType) {
		return articleType;
	}
	if (feedType.toLowerCase().trim() === 'rss') {
		articleType = 'article';
	}
	if (feedType.toLowerCase().trim() === 'podcast') {
		articleType = 'episode';
	}
	if (feedType.toLowerCase().trim() === 'youtube') {
		articleType = 'article'; // YouTube uses 'article' type with YouTube info in attachments
	}
	return articleType;
}
