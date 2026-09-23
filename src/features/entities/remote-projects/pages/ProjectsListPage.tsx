import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  User,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Calendar,
  Images
} from 'lucide-react';
import { useUserContext } from '@core/contexts';
import { useSocket } from '@core/contexts/SocketContext';
import { useRemoteProjects } from '@shared/hooks';
import { useLanguageNavigate } from '@shared/hooks/utils/useLangNavigation';
import { EmptyState, ViewModeToggle, PageHeader, type ViewMode } from '@shared/components';
import { WorkIcon } from '@shared/components/icons';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { getProjectDisplayNames, projectMatchesSearch } from '../utils/projectListUtils';
import { RemoteProject, RemoteProjectStatus } from 'src/types/index';
import './styles/_projects-list-page.scss';

type FilterStatus = 'all' | RemoteProjectStatus;
type SortField = 'created' | 'deadline';
type SortDirection = 'asc' | 'desc';
const PROJECTS_VIEW_MODE_KEY = 'projects-view-mode';
const DEFAULT_SORT_FIELD: SortField = 'created';
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';

function projectSortTime(project: RemoteProject, field: SortField): number | null {
  const raw = field === 'deadline' ? project.deadline : project.createdAt;
  if (!raw) return null;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? null : time;
}

export const ProjectsListPage: React.FC = () => {
  const { t, i18n } = useTranslation('remoteProjects');
  const { user } = useUserContext();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.localStorage.getItem(PROJECTS_VIEW_MODE_KEY) === 'list' ? 'list' : 'grid'
  );

  const langNavigate = useLanguageNavigate();

  const { projects, isLoading, isFetching, isPlaceholderData, refetch } = useRemoteProjects({
    participantId: user?._id,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const socket = useSocket();

  const refetchProjects = useCallback(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket) return;

    const onStatusUpdate = () => {
      refetchProjects();
    };

    socket.on('project:status', onStatusUpdate);
    return () => {
      socket.off('project:status', onStatusUpdate);
    };
  }, [socket, refetchProjects]);

  const nameFallbacks = useMemo(
    () => ({
      item: t('remoteService'),
      studio: t('studio'),
      customer: t('customer')
    }),
    [t]
  );
  const getNames = (project: RemoteProject) => getProjectDisplayNames(project, i18n.language, nameFallbacks);
  const ViewProjectArrow = i18n.dir() === 'rtl' ? ArrowLeft : ArrowRight;

  // Status is filtered by the API. Search applies to the currently loaded status page.
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredProjects = useMemo(() => {
    const matched = projects.filter((project: RemoteProject) =>
      projectMatchesSearch(project, normalizedSearch, i18n.language, nameFallbacks)
    );

    return [...matched].sort((a, b) => {
      const aTime = projectSortTime(a, sortField);
      const bTime = projectSortTime(b, sortField);
      if (aTime == null && bTime == null) return 0;
      if (aTime == null) return 1;
      if (bTime == null) return -1;
      return sortDirection === 'desc' ? bTime - aTime : aTime - bTime;
    });
  }, [projects, normalizedSearch, i18n.language, nameFallbacks, sortField, sortDirection]);

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: t('allStatuses') },
    { value: 'requested', label: t('status.requested') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'in_progress', label: t('status.inProgress') },
    { value: 'delivered', label: t('status.delivered') },
    { value: 'revision_requested', label: t('status.revisionRequested') },
    { value: 'completed', label: t('status.completed') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'declined', label: t('status.declined') }
  ];

  const sortFieldOptions: { value: SortField; label: string }[] = [
    { value: 'created', label: t('sort.byCreated') },
    { value: 'deadline', label: t('sort.byDeadline') }
  ];
  const sortDescLabel = sortField === 'deadline' ? t('sort.latestFirst') : t('sort.newestFirst');
  const sortAscLabel = sortField === 'deadline' ? t('sort.earliestFirst') : t('sort.oldestFirst');

  const hasActiveFilters = statusFilter !== 'all' || Boolean(normalizedSearch);
  const showFilters = Boolean(user) && (projects.length > 0 || hasActiveFilters);
  const hasResults = Boolean(user) && filteredProjects.length > 0;
  const isChangingStatus = isFetching && isPlaceholderData;

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setSortField(DEFAULT_SORT_FIELD);
    setSortDirection(DEFAULT_SORT_DIRECTION);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    window.localStorage.setItem(PROJECTS_VIEW_MODE_KEY, mode);
  };

  return (
    <div className="projects-list">
      <PageHeader icon={<WorkIcon />} title={t('myProjects')}>
        {user ? (
          <button type="button" className="page-header__cta" onClick={() => langNavigate('/search')}>
            <Plus size={16} />
            {t('newProject')}
          </button>
        ) : null}
      </PageHeader>

      {showFilters && (
        <div className="projects-list__filters">
          <div className="projects-list__search">
            <Search />
            <input
              type="text"
              className="projects-list__search-input"
              placeholder={t('searchProjects')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="projects-list__sort">
            <div className="projects-list__filter projects-list__filter--sort">
              <Calendar />
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                aria-label={t('sort.label')}
              >
                {sortFieldOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="projects-list__direction" role="group" aria-label={t('sort.label')}>
              <button
                type="button"
                className={`projects-list__direction-btn${sortDirection === 'desc' ? ' projects-list__direction-btn--active' : ''}`}
                onClick={() => setSortDirection('desc')}
                aria-label={sortDescLabel}
                aria-pressed={sortDirection === 'desc'}
                title={sortDescLabel}
              >
                <ArrowDown />
              </button>
              <button
                type="button"
                className={`projects-list__direction-btn${sortDirection === 'asc' ? ' projects-list__direction-btn--active' : ''}`}
                onClick={() => setSortDirection('asc')}
                aria-label={sortAscLabel}
                aria-pressed={sortDirection === 'asc'}
                title={sortAscLabel}
              >
                <ArrowUp />
              </button>
            </div>
          </div>
          <div className="projects-list__filter">
            <Filter />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <ViewModeToggle
            value={viewMode}
            onChange={handleViewModeChange}
            label={t('view.label')}
            gridLabel={t('view.grid')}
            listLabel={t('view.list')}
            className="projects-list__view-toggle"
          />
        </div>
      )}

      {/* Content */}
      {isLoading || isChangingStatus ? (
        <div className="projects-list__loading">{t('common.loading')}</div>
      ) : !hasResults && hasActiveFilters ? (
        <EmptyState
          icon="🔎"
          title={t('noResults')}
          subtitle={t('noResultsHint')}
          actionLabel={t('clearFilters')}
          onAction={clearFilters}
        />
      ) : !hasResults ? (
        <EmptyState
          icon="🎵"
          title={t('noProjects')}
          subtitle={t('noProjectsHint')}
          actionLabel={t('exploreStudios')}
          onAction={() => langNavigate('/')}
        />
      ) : (
        <div className={`projects-list__grid projects-list__grid--${viewMode}`}>
          {filteredProjects.map((project: RemoteProject, idx: number) => {
            const names = getNames(project);
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/${i18n.language}/projects/${project._id}`} className="projects-list__card">
                  <div className="projects-list__card-artwork">
                    {project.artworkUrl ? <img src={project.artworkUrl} alt="" /> : <Images aria-hidden="true" />}
                  </div>
                  {/* Card Content */}
                  <div className="projects-list__card-content">
                    <div className="projects-list__card-header">
                      <h3 className="projects-list__card-title">{project.title}</h3>
                      <span className="projects-list__card-price">₪{project.price.toLocaleString()}</span>
                    </div>

                    <ProjectStatusBadge status={project.status} />

                    <div className="projects-list__card-meta">
                      <div className="projects-list__card-customer">
                        <User />
                        <span>{names.customer}</span>
                      </div>
                      <div className="projects-list__card-service">
                        <CheckCircle2 />
                        <span>
                          {names.item} • {names.studio}
                        </span>
                      </div>
                      {project.deadline && (
                        <div className="projects-list__card-deadline">
                          <Clock />
                          <span>
                            {t('due')}: {new Date(project.deadline).toLocaleDateString(i18n.language)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="projects-list__card-footer">
                      <span>
                        {project.createdAt &&
                          `${t('createdAt')} ${new Date(project.createdAt).toLocaleDateString(i18n.language)}`}
                      </span>
                      <span className="projects-list__card-link">
                        {t('viewProject')} <ViewProjectArrow />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
