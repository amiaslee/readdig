
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import PageTitle from '../components/PageTitle';
import SearchInput from '../components/SearchInput';

import Loader from '../components/Loader';
import Image from '../components/Image';
import ArticleItem from '../components/Feeds/ArticleItem';
import { cleanHTML } from '../utils/sanitize';
import { search } from '../api/search';
import fetch from '../utils/fetch';

const Search = () => {
	const { t } = useTranslation();
	const [query, setQuery] = useState('');
	const [scope, setScope] = useState('all'); // Renamed from filterType to scope
	const [results, setResults] = useState({ feeds: [], articles: [] });
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);

	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const type = params.get('type'); // Content Category (RSS, Podcast, YouTube)

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const q = params.get('q');
		const urlScope = params.get('scope'); // Search Scope
		
		if (q) {
			setQuery(q);
		}
		// If scope is present in URL, use it
		if (urlScope) {
			setScope(urlScope);
		}
	}, [location.search]);

	useEffect(() => {
		const doSearch = async () => {
			if (!query.trim()) {
				setResults({ feeds: [], articles: [] });
				setSearched(false);
				return;
			}

			setLoading(true);
			try {
				let res;
				// Logic:
				// scope = 'all' | 'feed' -> call /search with q, scope, type
				// scope = 'stars' | 'recent-read' | 'recent-played' -> call /articles with type=scope, feedType=type
				
				if (scope === 'all' || scope === 'feed') {
					res = await search(query, scope, type);
					setResults(scope === 'feed' ? { feeds: res.data.feeds, articles: [] } : res.data);
				} else {
					// stars, recent-read, recent-played
					// API expects 'type' for the list type (stars, etc) and 'feedType' for category (rss, etc)
					res = await fetch('GET', '/articles', null, { q: query, type: scope, feedType: type });
					setResults({ feeds: [], articles: res.data });
				}
				setSearched(true);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		const timer = setTimeout(() => {
			doSearch();
		}, 500);

		return () => clearTimeout(timer);
	}, [query, scope, type]); // Add type to dependencies

	const scopeOptions = [
		{ value: 'all', label: t('All') },
		{ value: 'feed', label: t('Feeds') },
		{ value: 'stars', label: t('Stars') },
		{ value: 'recent-read', label: t('Recent Read') },
		{ value: 'recent-played', label: t('Recent Played') },
	];

	return (
		<div className="search-results">
			<PageTitle title={t('Search')} />
			<div className="filters">
				<div className="search">
					<SearchInput
						type="text"
						placeholder={t('Search')}
						value={query}
						onChange={(val) => setQuery(val)}
					/>
				</div>
					<div className="select">
						<Select
							className="select-container"
							classNamePrefix="select"
							placeholder={t('Scope')}
							isClearable={false}
							options={scopeOptions}
							value={scopeOptions.find((o) => o.value === scope)}
							onChange={(val) => setScope(val ? val.value : 'all')}
						/>
					</div>
			</div>

				{loading && (
					<div className="loading">
						<Loader />
					</div>
				)}

				{!loading && searched && (
					<div className="search-results-content">
						{results.feeds.length === 0 && results.articles.length === 0 && (
							<div className="no-content">
								{t('No results found')}
							</div>
						)}

							{[
								...results.feeds.map((f) => ({ ...f, _type: 'feed' })),
								...results.articles.map((a) => ({ ...a, _type: 'article' })),
							].map((item) => {
								if (item._type === 'feed') {
									const desc = cleanHTML(item.description);
									return (
										<Link
											className="article-item"
											key={item.id}
											to={`/feed/${item.id}`}
										>
											<div className="left">
												<div className="icon">
													<Image
														relative={true}
														src={`/images/feed/${item.id}?w=120&h=120`}
													/>
												</div>
											</div>
											<div className="right">
												<h4 title={item.title}>{item.title}</h4>
												{desc && <div className="desc">{desc}</div>}
												<div className="meta">
													<span className="feed">{t('Feed')}</span>
												</div>
											</div>
										</Link>
									);
								} else {
									return (
										<ArticleItem
											key={item.id}
											article={item}
											to={`/feed/${item.feedId}/article/${item.id}`}
										/>
									);
								}
							})}
					</div>
				)}
		</div>
	);
};

export default Search;
