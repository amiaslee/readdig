import fetch from '../utils/fetch';

export const search = (query, scope, type) => {
	const params = { q: query };
	if (scope && scope !== 'all') {
		params.scope = scope;
	}
	if (type && type !== 'all') {
		params.type = type;
	}
	return fetch('GET', '/search', null, params);
};
