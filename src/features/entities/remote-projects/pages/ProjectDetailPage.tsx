import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useRemoteProject } from '@shared/hooks';
import {
  useAcceptProjectMutation,
  useDeclineProjectMutation,
  useStartProjectMutation,
  useDeliverProjectMutation,
  useRequestRevisionMutation,
  useCompleteProjectMutation,
  useCancelProjectMutation,
} from '@shared/hooks';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { ProjectFileUploader } from '../components/ProjectFileUploader';
import { ProjectChat } from '../components/ProjectChat';
import { RemoteProject } from 'src/types/index';
import './styles/_project-detail-page.scss';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user } = useUserContext();

  const { project, fileCounts, isLoading, error, refetch } = useRemoteProject(projectId || '');

  const acceptMutation = useAcceptProjectMutation();
  const declineMutation = useDeclineProjectMutation();
  const startMutation = useStartProjectMutation();
  const deliverMutation = useDeliverProjectMutation();
  const revisionMutation = useRequestRevisionMutation();
  const completeMutation = useCompleteProjectMutation();
  const cancelMutation = useCancelProjectMutation();

  const [declineReason, setDeclineReason] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  if (!projectId) {
    return <div className="project-detail__error">{t('remoteProjects.projectNotFound', 'Project not found')}</div>;
  }

  if (isLoading) {
    return <div className="project-detail__loading">{t('common.loading', 'Loading...')}</div>;
  }

  if (error || !project) {
    return (
      <div className="project-detail__error">
        {t('remoteProjects.loadError', 'Failed to load project')}
        <Button onClick={() => navigate(-1)} className="button--secondary">
          {t('common.goBack', 'Go Back')}
        </Button>
      </div>
    );
  }

  const isVendor = user?._id === getVendorId(project);
  const isCustomer = user?._id === getCustomerId(project);
  const userRole: 'customer' | 'vendor' = isVendor ? 'vendor' : 'customer';

  function getVendorId(proj: RemoteProject): string {
    return typeof proj.vendorId === 'string' ? proj.vendorId : proj.vendorId._id;
  }

  function getCustomerId(proj: RemoteProject): string {
    return typeof proj.customerId === 'string' ? proj.customerId : proj.customerId._id;
  }

  const handleAccept = async () => {
    try {
      await acceptMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to accept project:', error);
    }
  };

  const handleDecline = async () => {
    try {
      await declineMutation.mutateAsync({ projectId, reason: declineReason });
      setShowDeclineModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to decline project:', error);
    }
  };

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to start project:', error);
    }
  };

  const handleDeliver = async () => {
    try {
      await deliverMutation.mutateAsync({ projectId, deliveryNotes });
      setShowDeliveryModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to deliver project:', error);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionFeedback.trim()) return;
    try {
      await revisionMutation.mutateAsync({ projectId, feedback: revisionFeedback });
      setShowRevisionModal(false);
      setRevisionFeedback('');
      refetch();
    } catch (error) {
      console.error('Failed to request revision:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to complete project:', error);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('remoteProjects.confirmCancel', 'Are you sure you want to cancel this project?'))) {
      return;
    }
    try {
      await cancelMutation.mutateAsync({
        projectId,
        cancelledBy: user?._id,
      });
      refetch();
    } catch (error) {
      console.error('Failed to cancel project:', error);
    }
  };

  const canCancel = ['requested', 'accepted'].includes(project.status);
  const canAcceptDecline = isVendor && project.status === 'requested';
  const canStart = isVendor && project.status === 'accepted';
  const canDeliver = isVendor && ['in_progress', 'revision_requested'].includes(project.status);
  const canRequestRevision = isCustomer && project.status === 'delivered' && project.revisionsUsed < project.revisionsIncluded;
  const canComplete = isCustomer && project.status === 'delivered';
  const canUploadSource = isCustomer && ['requested', 'accepted', 'in_progress'].includes(project.status);
  const canUploadDeliverable = isVendor && ['in_progress', 'revision_requested'].includes(project.status);

  const getItemName = (): string => {
    if (project.itemName?.en) return project.itemName.en;
    if (typeof project.itemId === 'object' && project.itemId.name?.en) return project.itemId.name.en;
    return t('remoteProjects.remoteService', 'Remote Service');
  };

  const getStudioName = (): string => {
    if (project.studioName?.en) return project.studioName.en;
    if (typeof project.studioId === 'object' && project.studioId.name?.en) return project.studioId.name.en;
    return t('remoteProjects.studio', 'Studio');
  };

  return (
    <div className="project-detail">
      <div className="project-detail__header">
        <button
          className="project-detail__back"
          onClick={() => navigate(-1)}
          aria-label={t('common.goBack', 'Go Back')}
        >
          &larr; {t('common.back', 'Back')}
        </button>
        <div className="project-detail__header-content">
          <h1 className="project-detail__title">{project.title}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      <div className="project-detail__content">
        <div className="project-detail__main">
          {/* Project Info */}
          <section className="project-detail__section">
            <h2 className="project-detail__section-title">
              {t('remoteProjects.projectDetails', 'Project Details')}
            </h2>
            <div className="project-detail__info-grid">
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">
                  {t('remoteProjects.service', 'Service')}
                </span>
                <span className="project-detail__info-value">{getItemName()}</span>
              </div>
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">
                  {t('remoteProjects.studio', 'Studio')}
                </span>
                <span className="project-detail__info-value">{getStudioName()}</span>
              </div>
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">
                  {t('remoteProjects.price', 'Price')}
                </span>
                <span className="project-detail__info-value">
                  {project.price.toLocaleString()} ILS
                </span>
              </div>
              {project.deadline && (
                <div className="project-detail__info-item">
                  <span className="project-detail__info-label">
                    {t('remoteProjects.deadline', 'Deadline')}
                  </span>
                  <span className="project-detail__info-value">
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">
                  {t('remoteProjects.revisions', 'Revisions')}
                </span>
                <span className="project-detail__info-value">
                  {project.revisionsUsed} / {project.revisionsIncluded}
                </span>
              </div>
            </div>
          </section>

          {/* Brief */}
          <section className="project-detail__section">
            <h2 className="project-detail__section-title">
              {t('remoteProjects.brief', 'Project Brief')}
            </h2>
            <p className="project-detail__brief">{project.brief}</p>
            {project.referenceLinks && project.referenceLinks.length > 0 && (
              <div className="project-detail__references">
                <h3 className="project-detail__references-title">
                  {t('remoteProjects.referenceLinks', 'Reference Links')}
                </h3>
                <ul className="project-detail__references-list">
                  {project.referenceLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Source Files (Customer uploads) */}
          <section className="project-detail__section">
            <ProjectFileUploader
              projectId={projectId}
              fileType="source"
              disabled={!canUploadSource}
              maxFileSize={typeof project.itemId === 'object' ? project.itemId.maxFileSize : undefined}
              maxFiles={typeof project.itemId === 'object' ? project.itemId.maxFilesPerProject : undefined}
              acceptedTypes={typeof project.itemId === 'object' ? project.itemId.acceptedFileTypes : undefined}
            />
          </section>

          {/* Deliverables (Vendor uploads) */}
          {((fileCounts?.deliverable ?? 0) > 0 || canUploadDeliverable) && (
            <section className="project-detail__section">
              <ProjectFileUploader
                projectId={projectId}
                fileType="deliverable"
                disabled={!canUploadDeliverable}
              />
            </section>
          )}

          {/* Revision Files */}
          {((fileCounts?.revision ?? 0) > 0 || (canUploadDeliverable && project.revisionsUsed > 0)) && (
            <section className="project-detail__section">
              <ProjectFileUploader
                projectId={projectId}
                fileType="revision"
                disabled={!canUploadDeliverable}
              />
            </section>
          )}
        </div>

        <div className="project-detail__sidebar">
          {/* Actions */}
          <section className="project-detail__section project-detail__actions">
            <h2 className="project-detail__section-title">
              {t('remoteProjects.actions', 'Actions')}
            </h2>

            {canAcceptDecline && (
              <div className="project-detail__action-group">
                <Button
                  className="button--primary"
                  onClick={handleAccept}
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending
                    ? t('common.processing', 'Processing...')
                    : t('remoteProjects.accept', 'Accept Project')}
                </Button>
                <Button
                  className="button--secondary"
                  onClick={() => setShowDeclineModal(true)}
                >
                  {t('remoteProjects.decline', 'Decline')}
                </Button>
              </div>
            )}

            {canStart && (
              <Button
                className="button--primary"
                onClick={handleStart}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending
                  ? t('common.processing', 'Processing...')
                  : t('remoteProjects.startWorking', 'Start Working')}
              </Button>
            )}

            {canDeliver && (
              <Button
                className="button--primary"
                onClick={() => setShowDeliveryModal(true)}
              >
                {t('remoteProjects.deliver', 'Deliver Project')}
              </Button>
            )}

            {canRequestRevision && (
              <Button
                className="button--secondary"
                onClick={() => setShowRevisionModal(true)}
              >
                {t('remoteProjects.requestRevision', 'Request Revision')}
              </Button>
            )}

            {canComplete && (
              <Button
                className="button--primary"
                onClick={handleComplete}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending
                  ? t('common.processing', 'Processing...')
                  : t('remoteProjects.markComplete', 'Mark as Complete')}
              </Button>
            )}

            {canCancel && (
              <Button
                className="button--danger"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {t('remoteProjects.cancel', 'Cancel Project')}
              </Button>
            )}

            {!canAcceptDecline && !canStart && !canDeliver && !canRequestRevision && !canComplete && !canCancel && (
              <p className="project-detail__no-actions">
                {t('remoteProjects.noActions', 'No actions available at this time')}
              </p>
            )}
          </section>

          {/* Chat */}
          {user && (
            <section className="project-detail__section">
              <ProjectChat
                projectId={projectId}
                currentUserId={user._id}
                currentUserRole={userRole}
                disabled={['completed', 'cancelled', 'declined'].includes(project.status)}
              />
            </section>
          )}
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="project-detail__modal-overlay" onClick={() => setShowDeclineModal(false)}>
          <div className="project-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('remoteProjects.declineProject', 'Decline Project')}</h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={t('remoteProjects.declineReasonPlaceholder', 'Optional: Provide a reason for declining')}
              rows={4}
            />
            <div className="project-detail__modal-actions">
              <Button
                className="button--secondary"
                onClick={() => setShowDeclineModal(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                className="button--danger"
                onClick={handleDecline}
                disabled={declineMutation.isPending}
              >
                {declineMutation.isPending
                  ? t('common.processing', 'Processing...')
                  : t('remoteProjects.confirmDecline', 'Decline Project')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="project-detail__modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="project-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('remoteProjects.deliverProject', 'Deliver Project')}</h3>
            <p className="project-detail__modal-hint">
              {t('remoteProjects.deliveryHint', 'Make sure you have uploaded all deliverable files before marking as delivered.')}
            </p>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder={t('remoteProjects.deliveryNotesPlaceholder', 'Optional: Add notes about the delivery')}
              rows={4}
            />
            <div className="project-detail__modal-actions">
              <Button
                className="button--secondary"
                onClick={() => setShowDeliveryModal(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                className="button--primary"
                onClick={handleDeliver}
                disabled={deliverMutation.isPending}
              >
                {deliverMutation.isPending
                  ? t('common.processing', 'Processing...')
                  : t('remoteProjects.confirmDelivery', 'Confirm Delivery')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="project-detail__modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="project-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('remoteProjects.requestRevision', 'Request Revision')}</h3>
            <p className="project-detail__modal-hint">
              {t('remoteProjects.revisionHint', `You have ${project.revisionsIncluded - project.revisionsUsed} revision(s) remaining.`)}
            </p>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder={t('remoteProjects.revisionFeedbackPlaceholder', 'Describe what changes you would like made...')}
              rows={4}
              required
            />
            <div className="project-detail__modal-actions">
              <Button
                className="button--secondary"
                onClick={() => setShowRevisionModal(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                className="button--primary"
                onClick={handleRequestRevision}
                disabled={!revisionFeedback.trim() || revisionMutation.isPending}
              >
                {revisionMutation.isPending
                  ? t('common.processing', 'Processing...')
                  : t('remoteProjects.submitRevision', 'Submit Request')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
