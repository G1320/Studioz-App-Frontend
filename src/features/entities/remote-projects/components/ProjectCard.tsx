import React from 'react';
import { useTranslation } from 'react-i18next';
import { RemoteProject } from 'src/types/index';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { useLanguageNavigate } from '@shared/hooks';
import {
  CalendarTodayIcon,
  DescriptionIcon,
  OfferIcon,
} from '@shared/components/icons';
import './styles/_project-card.scss';

interface ProjectCardProps {
  project: RemoteProject;
  variant?: 'list' | 'itemCard';
  onCreateNew?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'itemCard',
  onCreateNew,
}) => {
  const { t, i18n } = useTranslation('remoteProjects');
  const langNavigate = useLanguageNavigate();

  const handleCardClick = () => {
    if (variant === 'list') {
      langNavigate(`/projects/${project._id}`);
    }
  };

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    langNavigate(`/projects/${project._id}`);
  };

  const handleCreateNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreateNew) {
      onCreateNew();
    }
  };

  // Get item/service name
  const itemName =
    typeof project.itemId === 'object'
      ? project.itemId.name?.[i18n.language as 'en' | 'he'] || project.itemId.name?.en
      : project.itemName?.[i18n.language as 'en' | 'he'] || project.itemName?.en;

  // Get studio name
  const studioName =
    typeof project.studioId === 'object'
      ? project.studioId.name?.[i18n.language as 'en' | 'he'] || project.studioId.name?.en
      : project.studioName?.[i18n.language as 'en' | 'he'] || project.studioName?.en;

  // Format deadline
  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString(i18n.language === 'he' ? 'he-IL' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : project.estimatedDeliveryDays
      ? t('deliveryIn', { days: project.estimatedDeliveryDays })
      : null;

  const isClickable = variant === 'list';

  return (
    <article
      className={`project-card ${variant === 'itemCard' ? 'project-card--item-card' : ''}`}
      onClick={isClickable ? handleCardClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {/* Summary View */}
      <div className="project-card__summary">
        {/* Status Indicator */}
        <div className="project-card__status-indicator">
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Main Info */}
        <div className="project-card__summary-content">
          <div className="project-card__summary-header">
            <h3 className="project-card__title">{project.title}</h3>
            <span className="project-card__price">₪{project.price?.toLocaleString()}</span>
          </div>

          {(itemName || studioName) && (
            <p className="project-card__subtitle">
              {itemName}
              {studioName && ` · ${studioName}`}
            </p>
          )}

          <div className="project-card__summary-meta">
            {formattedDeadline && (
              <span className="project-card__meta-item">
                <CalendarTodayIcon className="project-card__meta-icon" />
                {formattedDeadline}
              </span>
            )}
            <span className="project-card__meta-item">
              <DescriptionIcon className="project-card__meta-icon" />
              {t('revisions', { count: project.revisionsIncluded - project.revisionsUsed })}
            </span>
          </div>
        </div>
      </div>

      {/* Details (always visible in itemCard variant) */}
      {variant === 'itemCard' && (
        <div className="project-card__details">
          {/* Brief preview */}
          {project.brief && (
            <div className="project-card__detail-row project-card__detail-row--brief">
              <span className="project-card__label">{t('brief')}:</span>
              <p className="project-card__brief">{project.brief}</p>
            </div>
          )}

          {/* Payment Status */}
          <div className="project-card__detail-row">
            <span className="project-card__label">{t('payment')}:</span>
            <span className="project-card__value">
              <OfferIcon className="project-card__detail-icon" />
              {project.depositPaid
                ? project.finalPaid
                  ? t('paymentStatus.fullyPaid')
                  : t('paymentStatus.depositPaid')
                : t('paymentStatus.pending')}
            </span>
          </div>

          {/* Revisions info */}
          <div className="project-card__detail-row">
            <span className="project-card__label">{t('revisionsUsed')}:</span>
            <span className="project-card__value">
              {project.revisionsUsed} / {project.revisionsIncluded}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      {variant === 'itemCard' && (
        <div className="project-card__actions">
          <button
            className="project-card__action-btn project-card__action-btn--primary"
            onClick={handleViewProject}
          >
            {t('viewProject')}
          </button>
          {onCreateNew && (
            <button
              className="project-card__action-btn project-card__action-btn--secondary"
              onClick={handleCreateNew}
            >
              {t('createNewProject')}
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default ProjectCard;
