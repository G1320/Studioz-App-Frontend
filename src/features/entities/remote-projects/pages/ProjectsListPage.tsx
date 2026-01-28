import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useRemoteProjects } from '@shared/hooks';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { RemoteProject, RemoteProjectStatus } from 'src/types/index';
import './styles/_projects-list-page.scss';

type FilterStatus = 'all' | RemoteProjectStatus;

export const ProjectsListPage: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { user } = useUserContext();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const { projects, isLoading, error } = useRemoteProjects({
    customerId: user?._id,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  if (!user) {
    return (
      <div className="projects-list__empty">
        {t('remoteProjects.loginRequired', 'Please log in to view your projects')}
      </div>
    );
  }

  const getItemName = (project: RemoteProject): string => {
    if (project.itemName?.en) return project.itemName.en;
    if (typeof project.itemId === 'object' && project.itemId.name?.en) return project.itemId.name.en;
    return t('remoteProjects.remoteService', 'Remote Service');
  };

  const getStudioName = (project: RemoteProject): string => {
    if (project.studioName?.en) return project.studioName.en;
    if (typeof project.studioId === 'object' && project.studioId.name?.en) return project.studioId.name.en;
    return t('remoteProjects.studio', 'Studio');
  };

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: t('remoteProjects.allStatuses', 'All Statuses') },
    { value: 'requested', label: t('remoteProjects.status.requested', 'Pending Review') },
    { value: 'accepted', label: t('remoteProjects.status.accepted', 'Accepted') },
    { value: 'in_progress', label: t('remoteProjects.status.inProgress', 'In Progress') },
    { value: 'delivered', label: t('remoteProjects.status.delivered', 'Delivered') },
    { value: 'revision_requested', label: t('remoteProjects.status.revisionRequested', 'Revision Requested') },
    { value: 'completed', label: t('remoteProjects.status.completed', 'Completed') },
    { value: 'cancelled', label: t('remoteProjects.status.cancelled', 'Cancelled') },
    { value: 'declined', label: t('remoteProjects.status.declined', 'Declined') },
  ];

  return (
    <div className="projects-list">
      <div className="projects-list__header">
        <h1 className="projects-list__title">
          {t('remoteProjects.myProjects', 'My Projects')}
        </h1>
        <select
          className="projects-list__filter"
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

      {isLoading ? (
        <div className="projects-list__loading">
          {t('common.loading', 'Loading...')}
        </div>
      ) : error ? (
        <div className="projects-list__error">
          {t('remoteProjects.loadError', 'Failed to load projects')}
        </div>
      ) : projects.length === 0 ? (
        <div className="projects-list__empty">
          <p>{t('remoteProjects.noProjects', 'No projects found')}</p>
          <p className="projects-list__empty-hint">
            {t('remoteProjects.browseServices', 'Browse studios to find remote services')}
          </p>
        </div>
      ) : (
        <ul className="projects-list__items">
          {projects.map((project: RemoteProject) => (
            <li key={project._id} className="projects-list__item">
              <Link
                to={`/${i18n.language}/projects/${project._id}`}
                className="projects-list__item-link"
              >
                <div className="projects-list__item-header">
                  <h3 className="projects-list__item-title">{project.title}</h3>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <div className="projects-list__item-details">
                  <span className="projects-list__item-service">
                    {getItemName(project)}
                  </span>
                  <span className="projects-list__item-separator">•</span>
                  <span className="projects-list__item-studio">
                    {getStudioName(project)}
                  </span>
                </div>
                <div className="projects-list__item-meta">
                  <span className="projects-list__item-price">
                    {project.price.toLocaleString()} ILS
                  </span>
                  {project.deadline && (
                    <>
                      <span className="projects-list__item-separator">•</span>
                      <span className="projects-list__item-deadline">
                        {t('remoteProjects.due', 'Due')}: {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsListPage;
