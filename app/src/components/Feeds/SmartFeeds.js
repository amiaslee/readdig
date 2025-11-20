import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Total from '../Total';
import FeedTypeSelect from './FeedTypeSelect';
import { getTotals } from '../../api/total';

import { ReactComponent as StarIcon } from '../../images/icons/star-outline.svg';
import { ReactComponent as NewsIcon } from '../../images/icons/newspaper-variant-outline.svg';
import { ReactComponent as CircleIcon } from '../../images/icons/record-circle-outline.svg';
import { ReactComponent as PlayCircleIcon } from '../../images/icons/play-circle-outline.svg';
import { ReactComponent as RSSIcon } from '../../images/icons/rss-box.svg';
import { ReactComponent as SearchIcon } from '../../images/icons/magnify.svg';



const SmartFeeds = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const location = useLocation();
	const history = useHistory();
	const totals = useSelector((state) => state.totals || {});

	// Get current category from URL or default to 'all'
	const searchParams = new URLSearchParams(location.search);
	const urlType = searchParams.get('type');
	// Priority: URL type > 'all' (don't use localStorage as fallback)
	const currentType = urlType || 'all';

	useEffect(() => {
		const fetchData = async () => {
			await getTotals(dispatch, currentType);
		};
		fetchData();
	}, [dispatch, currentType]);

	// Save category preference to localStorage
	useEffect(() => {
		if (currentType) {
			localStorage.setItem('preferredCategory', currentType);
		}
	}, [currentType]);

	const buildLink = (path) => {
		// If currentType is 'all', don't add type parameter
		if (currentType === 'all') {
			return path;
		}
		return `${path}?type=${currentType}`;
	};

	const handleCategoryChange = (value) => {
		// FeedTypeSelect returns null when cleared, treat it as 'all'
		const newType = value || 'all';
		const currentPath = location.pathname;
		
		// If on folder or feed page, navigate to Primary with the new category
		const isOnFolderOrFeed = currentPath.startsWith('/folder') || currentPath.startsWith('/feed');
		
		let newPath;
		if (isOnFolderOrFeed) {
			// Navigate to Primary page with category
			newPath = newType === 'all' ? '/' : `/?type=${newType}`;
		} else {
			// Stay on current page with new category
			if (newType === 'all') {
				newPath = currentPath; // No type parameter for 'all'
			} else {
				newPath = `${currentPath}?type=${newType}`;
			}
		}
		
		history.push(newPath);
		// Note: useEffect will automatically refresh totals when currentType changes
	};

	const categoryOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'rss', label: 'RSS' },
		{ value: 'podcast', label: 'Podcast' },
		{ value: 'youtube', label: 'YouTube' },
	];

	return (
		<>
			<div className="category-selector">
				<FeedTypeSelect
					value={currentType}
					placeholder={t('All')}
					onChange={handleCategoryChange}
					options={categoryOptions}
				/>
			</div>
			<ul className="menu-list">
				<li
					className={classNames({
						active: location.pathname === '/' || location.pathname.startsWith('/article'),
					})}
				>
					<Link to={buildLink('/')} title={t('Primary')}>
						<div className="icon">
							<NewsIcon />
						</div>
						<div className="title">{t('Primary')}</div>
						<Total value={totals.primary || 0} />
					</Link>
				</li>
				<li
					className={classNames({
						active: location.pathname.startsWith('/stars'),
					})}
				>
					<Link to={buildLink('/stars')} title={t('Stars')}>
						<div className="icon">
							<StarIcon />
						</div>
						<div className="title">{t('Stars')}</div>
						<Total value={totals.star || 0} />
					</Link>
				</li>
				<li
					className={classNames({
						active: location.pathname.startsWith('/recent-read'),
					})}
				>
					<Link 
						to={buildLink('/recent-read')} 
						title={t('Recent Read')}
					>
						<div className="icon">
							<CircleIcon />
						</div>
						<div className="title">
							{t('Recent Read')}
						</div>
						<Total value={totals.recentRead || 0} />
					</Link>
				</li>
				{currentType === 'podcast' && (
					<li
						className={classNames({
							active: location.pathname.startsWith('/recent-played'),
						})}
					>
						<Link 
							to={buildLink('/recent-played')} 
							title={t('Recent Played')}
						>
							<div className="icon">
								<PlayCircleIcon />
							</div>
							<div className="title">
								{t('Recent Played')}
							</div>
							<Total value={totals.recentPlayed || 0} />
						</Link>
					</li>
				)}
				<li
					className={classNames({
						active: location.pathname === '/search',
					})}
				>
					<Link to="/search" title={t('Search')}>
						<div className="icon">
							<SearchIcon />
						</div>
						<div className="title">{t('Search')}</div>
					</Link>
				</li>
				<li
					className={classNames({
						active: location.pathname.startsWith('/library'),
					})}
				>
					<Link to={buildLink('/library')} title={t('Library')}>
						<div className="icon">
							<RSSIcon />
						</div>
						<div className="title">{t('Library')}</div>
					</Link>
				</li>
			</ul>
		</>
	);
};

export default SmartFeeds;
