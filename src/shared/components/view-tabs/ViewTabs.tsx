import './_view-tabs.scss';

export interface ViewTabItem<T extends string = string> {
  key: T;
  label: string;
}

export interface ViewTabsProps<T extends string = string> {
  tabs: ViewTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
  'aria-label'?: string;
}

export function ViewTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  'aria-label': ariaLabel
}: ViewTabsProps<T>) {
  return (
    <div className={`view-tabs ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`view-tabs__tab ${isActive ? 'view-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
