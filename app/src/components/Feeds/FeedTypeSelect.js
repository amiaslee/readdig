import React from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import { feedTypeOptions } from '../../utils/options';

const FeedTypeSelect = ({ value, placeholder, onChange, options }) => {
	const { t } = useTranslation();
	// Use custom options if provided, otherwise use default feedTypeOptions
	const selectOptions = options 
		? options.map(({ value, label }) => ({ value, label: t(label) }))
		: feedTypeOptions.map(({ value, label }) => ({ value, label: t(label) }));

	return (
		<Select
			className="select-container"
			classNamePrefix="select"
			placeholder={placeholder || t('Select...')}
			isClearable={false}
			options={selectOptions}
			onChange={(val) => onChange(val ? val.value : 'all')}
			value={selectOptions.find((o) => o.value === value) || selectOptions[0]}
		/>
	);
};

export default FeedTypeSelect;
