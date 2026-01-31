import { useTranslation } from 'react-i18next';
import { RemoteProjectStatus } from 'src/types/index';
import './styles/_project-status-badge.scss';

interface ProjectStatusBadgeProps {
  status: RemoteProjectStatus;
  className?: string;
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const { t } = useTranslation('remoteProjects');

  const statusConfig: Record<
    RemoteProjectStatus,
    { label: string; variant: string }
  > = {
    requested: {
      label: t('status.requested', 'Pending Review'),
      variant: 'warning',
    },
    accepted: {
      label: t('status.accepted', 'Accepted'),
      variant: 'info',
    },
    in_progress: {
      label: t('status.inProgress', 'In Progress'),
      variant: 'info',
    },
    delivered: {
      label: t('status.delivered', 'Delivered'),
      variant: 'success',
    },
    revision_requested: {
      label: t('status.revisionRequested', 'Revision Requested'),
      variant: 'warning',
    },
    completed: {
      label: t('status.completed', 'Completed'),
      variant: 'success',
    },
    cancelled: {
      label: t('status.cancelled', 'Cancelled'),
      variant: 'error',
    },
    declined: {
      label: t('status.declined', 'Declined'),
      variant: 'error',
    },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: 'default',
  };

  return (
    <span
      className={`project-status-badge project-status-badge--${config.variant} ${className}`}
    >
      {config.label}
    </span>
  );
};

export default ProjectStatusBadge;
