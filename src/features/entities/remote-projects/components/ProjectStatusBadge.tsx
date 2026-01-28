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
  const { t } = useTranslation('common');

  const statusConfig: Record<
    RemoteProjectStatus,
    { label: string; variant: string }
  > = {
    requested: {
      label: t('remoteProjects.status.requested', 'Pending Review'),
      variant: 'warning',
    },
    accepted: {
      label: t('remoteProjects.status.accepted', 'Accepted'),
      variant: 'info',
    },
    in_progress: {
      label: t('remoteProjects.status.inProgress', 'In Progress'),
      variant: 'info',
    },
    delivered: {
      label: t('remoteProjects.status.delivered', 'Delivered'),
      variant: 'success',
    },
    revision_requested: {
      label: t('remoteProjects.status.revisionRequested', 'Revision Requested'),
      variant: 'warning',
    },
    completed: {
      label: t('remoteProjects.status.completed', 'Completed'),
      variant: 'success',
    },
    cancelled: {
      label: t('remoteProjects.status.cancelled', 'Cancelled'),
      variant: 'error',
    },
    declined: {
      label: t('remoteProjects.status.declined', 'Declined'),
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
