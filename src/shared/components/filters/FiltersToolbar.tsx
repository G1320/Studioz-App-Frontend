import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './styles/_filters-toolbar.scss';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface FilterDropdown {
  label: string;
  paramKey: string;
  options: DropdownOption[];
  placeholder?: string;
  defaultValue?: string;
}

interface FiltersToolbarProps {
  filters: FilterDropdown[];
  className?: string;
  onFiltersChange?: (params: Record<string, string>) => void;
}

export const FiltersToolbar: React.FC<FiltersToolbarProps> = ({ filters, className = '', onFiltersChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (paramKey: string, value: string, defaultValue?: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value || (defaultValue && value === defaultValue)) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }

    setSearchParams(params, { replace: true });
    onFiltersChange?.(Object.fromEntries(params.entries()));
  };

  const getSelectedValue = (paramKey: string, defaultValue?: string) => {
    return searchParams.get(paramKey) ?? defaultValue ?? '';
  };

  return (
    <section className={`filters-toolbar ${className}`}>
      {filters.map((filter) => {
        const { label, paramKey, options, placeholder = 'All', defaultValue } = filter;
        const selectId = `${paramKey}-filter`;
        const value = getSelectedValue(paramKey, defaultValue);

        return (
          <div className="filters-toolbar__filter" key={paramKey}>
            <label className="filters-toolbar__label" htmlFor={selectId}>
              {label}
            </label>
            <div className="filters-toolbar__control">
              <select
                id={selectId}
                className="filters-toolbar__select"
                value={value}
                onChange={(event) => handleChange(paramKey, event.target.value, defaultValue)}
              >
                <option value={defaultValue || ''}>{placeholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </section>
  );
};
