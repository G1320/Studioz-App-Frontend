import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { useUserContext } from '@core/contexts';
import { useRemoteProjects } from '@shared/hooks';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { RemoteProject, RemoteProjectStatus } from 'src/types/index';
import './styles/_projects-list-page.scss';

type FilterStatus = 'all' | RemoteProjectStatus;

export const ProjectsListPage: React.FC = () => {
  const { t, i18n } = useTranslation('remoteProjects');
  const { user } = useUserContext();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { projects, isLoading } = useRemoteProjects({
    customerId: user?._id,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  // Filter projects by status and search query
  const filteredProjects = projects.filter((project: RemoteProject) => {
    // Status filter
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }
    // Search filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      getItemName(project).toLowerCase().includes(query) ||
      getStudioName(project).toLowerCase().includes(query) ||
      getCustomerName(project).toLowerCase().includes(query)
    );
  });

  const getItemName = (project: RemoteProject): string => {
    if (project.itemName?.en) return i18n.language === 'he' ? project.itemName.he || project.itemName.en : project.itemName.en;
    if (typeof project.itemId === 'object' && project.itemId.name) {
      return i18n.language === 'he' ? project.itemId.name.he || project.itemId.name.en : project.itemId.name.en;
    }
    return t('remoteService');
  };

  const getStudioName = (project: RemoteProject): string => {
    if (project.studioName?.en) return i18n.language === 'he' ? project.studioName.he || project.studioName.en : project.studioName.en;
    if (typeof project.studioId === 'object' && project.studioId.name) {
      return i18n.language === 'he' ? project.studioId.name.he || project.studioId.name.en : project.studioId.name.en;
    }
    return t('studio');
  };

  const getCustomerName = (project: RemoteProject): string => {
    // First check the direct customerName field
    if (project.customerName) return project.customerName;
    // Then check the populated customerId object
    if (typeof project.customerId === 'object' && project.customerId.name) {
      return project.customerId.name;
    }
    return t('customer');
  };

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: t('allStatuses') },
    { value: 'requested', label: t('status.requested') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'in_progress', label: t('status.inProgress') },
    { value: 'delivered', label: t('status.delivered') },
    { value: 'revision_requested', label: t('status.revisionRequested') },
    { value: 'completed', label: t('status.completed') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'declined', label: t('status.declined') },
  ];

  if (!user) {
    return (
      <div className="projects-list">
        <div className="projects-list__empty">
          <AlertCircle />
          <h3>{t('loginRequired')}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-list">
      {/* Header */}
      <header className="projects-list__header">
        <div className="projects-list__header-content">
          <h1 className="projects-list__title">{t('myProjects')}</h1>
          <p className="projects-list__subtitle">{t('subtitle')}</p>
        </div>
        <div className="projects-list__header-actions">
          <button className="projects-list__new-button">
            <Plus />
            {t('newProject')}
          </button>
        </div>
      </header>

      {/* Filters */}
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
        <div className="projects-list__filter">
          <Filter />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="projects-list__loading">{t('common.loading')}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="projects-list__empty">
          <AlertCircle />
          <h3>{t('noProjects')}</h3>
          <p>{t('noProjectsHint')}</p>
          <button className="projects-list__empty-cta">
            {t('exploreStudios')}
          </button>
        </div>
      ) : (
        <div className="projects-list__grid">
          {filteredProjects.map((project: RemoteProject, idx: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/${i18n.language}/projects/${project._id}`}
                className="projects-list__card"
              >
                {/* Card Content */}
                <div className="projects-list__card-content">
                  <div className="projects-list__card-header">
                    <h3 className="projects-list__card-title">{project.title}</h3>
                    <span className="projects-list__card-price">
                      ₪{project.price.toLocaleString()}
                    </span>
                  </div>

                  <ProjectStatusBadge status={project.status} />

                  <div className="projects-list__card-meta">
                    <div className="projects-list__card-customer">
                      <User />
                      <span>{getCustomerName(project)}</span>
                    </div>
                    <div className="projects-list__card-service">
                      <CheckCircle2 />
                      <span>{getItemName(project)} • {getStudioName(project)}</span>
                    </div>
                    {project.deadline && (
                      <div className="projects-list__card-deadline">
                        <Clock />
                        <span>{t('due')}: {new Date(project.deadline).toLocaleDateString(i18n.language)}</span>
                      </div>
                    )}
                  </div>

                  <div className="projects-list__card-footer">
                    <span>
                      {project.createdAt && `${t('createdAt')} ${new Date(project.createdAt).toLocaleDateString(i18n.language)}`}
                    </span>
                    <span className="projects-list__card-link">
                      {t('viewProject')} <ArrowLeft />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
