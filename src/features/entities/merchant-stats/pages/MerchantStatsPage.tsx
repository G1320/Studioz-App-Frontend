import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { BarChartIcon } from '@shared/components/icons';
import { useUserContext } from '@core/contexts';
import { useStudios } from '@shared/hooks';
import {
  DateRangePicker,
  ExportDropdown,
  StatsSubTabs,
  OverviewSection,
  StudioBreakdownSection,
  CustomerSection,
  ProjectionsSection,
  InsightsSection,
  type StatsSubTab,
  type DateRange
} from '../components';
import '../styles/_merchant-stats.scss';

const MerchantStatsPage: React.FC = () => {
  const { t, i18n } = useTranslation('merchantStats');
  const { user } = useUserContext();
  const { data: studios = [] } = useStudios();

  const [activeSubTab, setActiveSubTab] = useState<StatsSubTab>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf('month').toDate(),
    endDate: dayjs().endOf('month').toDate(),
    label: t('dateRange.thisMonth', 'החודש הנוכחי')
  });

  const getLocalizedName = useCallback((name: string | { en?: string; he?: string } | undefined): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[i18n.language as 'en' | 'he'] || name.he || name.en || '';
  }, [i18n.language]);

  const userStudios = useMemo(() => {
    if (!user?._id) return [];
    return studios.filter((studio) => studio.createdBy === user._id);
  }, [studios, user?._id]);

  const formatCurrency = useCallback((amount: number) => {
    if (amount >= 1000) {
      return `₪${(amount / 1000).toFixed(1)}k`.replace('.0k', 'k');
    }
    return `₪${amount.toLocaleString()}`;
  }, []);

  const studioName = getLocalizedName(userStudios[0]?.name) || t('header.defaultStudio', 'האולפן שלך');

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  const handleClientClick = useCallback((_clientId: string) => {
    setActiveSubTab('customers');
  }, []);

  const exportData = useMemo(
    () => ({
      dateRange,
      totalRevenue: 0,
      totalBookings: 0,
      avgPerBooking: 0,
      newClients: 0,
      topClients: [],
      revenueByPeriod: { monthly: [] as number[], weekly: [] as number[], daily: [] as number[] }
    }),
    [dateRange]
  );

  return (
    <div className="merchant-stats">
      <header className="merchant-stats__header">
        <div className="merchant-stats__title-row">
          <BarChartIcon className="merchant-stats__title-icon" />
          <h1 className="merchant-stats__title">{t('header.title', 'סטטיסטיקות')}</h1>
        </div>

        <div className="merchant-stats__controls">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <ExportDropdown data={exportData} studioName={studioName} />
        </div>
      </header>

      <StatsSubTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} />

      {activeSubTab === 'overview' && (
        <OverviewSection
          dateRange={dateRange}
          formatCurrency={formatCurrency}
          onClientClick={handleClientClick}
        />
      )}
      {activeSubTab === 'studios' && (
        <StudioBreakdownSection dateRange={dateRange} formatCurrency={formatCurrency} />
      )}
      {activeSubTab === 'customers' && (
        <CustomerSection dateRange={dateRange} formatCurrency={formatCurrency} />
      )}
      {activeSubTab === 'projections' && (
        <ProjectionsSection dateRange={dateRange} formatCurrency={formatCurrency} />
      )}
      {activeSubTab === 'insights' && (
        <InsightsSection dateRange={dateRange} formatCurrency={formatCurrency} />
      )}
    </div>
  );
};

export default MerchantStatsPage;
