import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  useCancelProjectMutation
} from '@shared/hooks';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { ProjectFileUploader } from '../components/ProjectFileUploader';
import { ProjectChat } from '../components/ProjectChat';
import { RemoteProject } from 'src/types/index';
import './styles/_project-detail-page.scss';

// Demo projects data (shared with ProjectsListPage)
const DEMO_PROJECTS: RemoteProject[] = [
  {
    _id: 'demo-1',
    title: 'Summer EP - Mix & Master',
    brief:
      'Looking for a warm, analog sound for these 4 tracks. Similar vibe to Tame Impala but with more punchy drums. The songs are indie rock with psychedelic elements. I want the vocals to sit nicely in the mix without being too upfront. Reference tracks: "Let It Happen" and "Elephant" by Tame Impala.',
    itemId: 'item-1',
    studioId: 'studio-1',
    customerId: 'customer-1',
    vendorId: 'vendor-1',
    itemName: { en: 'Full Mix & Master', he: 'מיקס ומאסטרינג מלא' },
    studioName: { en: 'Pulse Studios', he: 'אולפני פאלס' },
    customerName: 'Daniel Cohen',
    price: 1200,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 5,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 3,
    revisionsUsed: 1,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    referenceLinks: ['https://open.spotify.com/track/example1', 'https://youtube.com/watch?v=example']
  },
  {
    _id: 'demo-2',
    title: 'Podcast Episode 12 - Post Production',
    brief:
      'Need cleanup, EQ, and mastering for our weekly podcast episode. There are 2 hosts and 1 guest. The recording was done remotely so there might be some background noise to clean up. Episode length is about 45 minutes.',
    itemId: 'item-2',
    studioId: 'studio-2',
    customerId: 'customer-2',
    vendorId: 'vendor-2',
    itemName: { en: 'Podcast Post-Production', he: 'עריכת פודקאסט' },
    studioName: { en: 'Magic Recordings', he: "מג'יק הקלטות" },
    customerName: 'Maya Levi',
    price: 350,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 2,
    revisionsIncluded: 2,
    revisionsUsed: 0,
    status: 'delivered',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-3',
    title: 'Vocal Tuning - Single Release',
    brief:
      'Professional vocal tuning and alignment for upcoming single. The song is a ballad in Hebrew. I want subtle, natural-sounding tuning - nothing too robotic. The takes are mostly good but need some pitch correction in the bridge section.',
    itemId: 'item-3',
    studioId: 'studio-3',
    customerId: 'customer-3',
    vendorId: 'vendor-3',
    itemName: { en: 'Pro Vocal Alignment', he: 'עריכת שירה מקצועית' },
    studioName: { en: 'Resonance Studio', he: 'אולפן רזוננס' },
    customerName: 'Amit Shapira',
    price: 450,
    depositPaid: false,
    finalPaid: false,
    estimatedDeliveryDays: 3,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 2,
    revisionsUsed: 0,
    status: 'requested',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-4',
    title: 'Album Mastering - 10 Tracks',
    brief:
      'Final mastering for indie rock album, ready for streaming release. All tracks are already mixed. Looking for a cohesive sound across all tracks with proper loudness for streaming platforms (-14 LUFS integrated). Will need both WAV masters and streaming-optimized files.',
    itemId: 'item-4',
    studioId: 'studio-1',
    customerId: 'customer-4',
    vendorId: 'vendor-1',
    itemName: { en: 'Album Mastering', he: 'מאסטרינג אלבום' },
    studioName: { en: 'Pulse Studios', he: 'אולפני פאלס' },
    customerName: 'Yael Ben-David',
    price: 2500,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 7,
    revisionsIncluded: 2,
    revisionsUsed: 2,
    status: 'completed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'demo-5',
    title: 'Beat Production - Hip Hop Track',
    brief:
      'Custom beat production with 808s and melodic elements. Looking for something dark and atmospheric, similar to Travis Scott or Don Toliver production style. BPM should be around 140-150. Need stems delivered as well.',
    itemId: 'item-5',
    studioId: 'studio-4',
    customerId: 'customer-5',
    vendorId: 'vendor-4',
    itemName: { en: 'Beat Production', he: 'הפקת ביט' },
    studioName: { en: 'Urban Sound Lab', he: 'אורבן סאונד לאב' },
    customerName: 'Omer Katz',
    price: 800,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 4,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 3,
    revisionsUsed: 1,
    status: 'revision_requested',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    referenceLinks: ['https://open.spotify.com/track/travisscott', 'https://youtube.com/watch?v=dontoliver']
  }
];

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('remoteProjects');
  const { user } = useUserContext();

  // Check if this is a demo project
  const isDemoProject = projectId?.startsWith('demo-');

  // Find demo project if applicable
  const demoProject = useMemo(() => {
    if (!isDemoProject) return null;
    return DEMO_PROJECTS.find((p) => p._id === projectId) || null;
  }, [projectId, isDemoProject]);

  // Only fetch real data if not a demo project
  const {
    project: realProject,
    fileCounts: realFileCounts,
    isLoading,
    error: _error,
    refetch
  } = useRemoteProject(isDemoProject ? '' : projectId || '');

  // Use demo or real project data
  const project = isDemoProject ? demoProject : realProject;
  const fileCounts = isDemoProject ? { source: 3, deliverable: 2, revision: 1 } : realFileCounts;

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
    return <div className="project-detail__error">{t('projectNotFound')}</div>;
  }

  // For demo projects, skip loading state
  if (!isDemoProject && isLoading) {
    return <div className="project-detail__loading">{t('common.loading')}</div>;
  }

  if (!project) {
    return (
      <div className="project-detail__error">
        {isDemoProject ? t('projectNotFound') : t('loadError')}
        <Button onClick={() => navigate(-1)} className="button--secondary">
          {t('common.goBack')}
        </Button>
      </div>
    );
  }

  // For demo, simulate that the current user is the vendor (to see vendor actions)
  const isVendor = isDemoProject ? true : user?._id === getVendorId(project);
  const isCustomer = isDemoProject ? true : user?._id === getCustomerId(project);
  const userRole: 'customer' | 'vendor' = isVendor ? 'vendor' : 'customer';

  // Demo mode handler - shows alert instead of actual API call
  const handleDemoAction = (action: string) => {
    alert(`${t('demo.bannerTitle')} "${action}" - ${t('demo.detailBannerDescription')}`);
  };

  function getVendorId(proj: RemoteProject): string {
    return typeof proj.vendorId === 'string' ? proj.vendorId : proj.vendorId._id;
  }

  function getCustomerId(proj: RemoteProject): string {
    return typeof proj.customerId === 'string' ? proj.customerId : proj.customerId._id;
  }

  const handleAccept = async () => {
    if (isDemoProject) return handleDemoAction(t('accept'));
    try {
      await acceptMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to accept project:', error);
    }
  };

  const handleDecline = async () => {
    if (isDemoProject) {
      setShowDeclineModal(false);
      return handleDemoAction(t('decline'));
    }
    try {
      await declineMutation.mutateAsync({ projectId, reason: declineReason });
      setShowDeclineModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to decline project:', error);
    }
  };

  const handleStart = async () => {
    if (isDemoProject) return handleDemoAction(t('startWorking'));
    try {
      await startMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to start project:', error);
    }
  };

  const handleDeliver = async () => {
    if (isDemoProject) {
      setShowDeliveryModal(false);
      return handleDemoAction(t('deliver'));
    }
    try {
      await deliverMutation.mutateAsync({ projectId, deliveryNotes });
      setShowDeliveryModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to deliver project:', error);
    }
  };

  const handleRequestRevision = async () => {
    if (isDemoProject) {
      setShowRevisionModal(false);
      return handleDemoAction(t('requestRevision'));
    }
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
    if (isDemoProject) return handleDemoAction(t('markComplete'));
    try {
      await completeMutation.mutateAsync(projectId);
      refetch();
    } catch (error) {
      console.error('Failed to complete project:', error);
    }
  };

  const handleCancel = async () => {
    if (isDemoProject) return handleDemoAction(t('cancel'));
    if (!confirm(t('confirmCancel'))) {
      return;
    }
    try {
      await cancelMutation.mutateAsync({
        projectId,
        cancelledBy: user?._id
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
  const canRequestRevision =
    isCustomer && project.status === 'delivered' && project.revisionsUsed < project.revisionsIncluded;
  const canComplete = isCustomer && project.status === 'delivered';
  const canUploadSource = isCustomer && ['requested', 'accepted', 'in_progress'].includes(project.status);
  const canUploadDeliverable = isVendor && ['in_progress', 'revision_requested'].includes(project.status);

  const getItemName = (): string => {
    if (project.itemName?.en) return project.itemName.en;
    if (typeof project.itemId === 'object' && project.itemId.name?.en) return project.itemId.name.en;
    return t('remoteService');
  };

  const getStudioName = (): string => {
    if (project.studioName?.en) return project.studioName.en;
    if (typeof project.studioId === 'object' && project.studioId.name?.en) return project.studioId.name.en;
    return t('studio');
  };

  return (
    <div className="project-detail">
      {/* Demo Banner */}
      {isDemoProject && (
        <div className="project-detail__demo-banner">
          <span>🎭</span>
          <p>
            <strong>{t('demo.bannerTitle')}</strong> {t('demo.detailBannerDescription')}
          </p>
        </div>
      )}

      <div className="project-detail__header">
        <button className="project-detail__back" onClick={() => navigate(-1)} aria-label={t('common.goBack')}>
          <ArrowLeft size={18} />
          <span>{t('common.back')}</span>
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
            <h2 className="project-detail__section-title">{t('projectDetails')}</h2>
            <div className="project-detail__info-grid">
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">{t('service')}</span>
                <span className="project-detail__info-value">{getItemName()}</span>
              </div>
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">{t('studio')}</span>
                <span className="project-detail__info-value">{getStudioName()}</span>
              </div>
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">{t('price')}</span>
                <span className="project-detail__info-value">{project.price.toLocaleString()} ILS</span>
              </div>
              {project.deadline && (
                <div className="project-detail__info-item">
                  <span className="project-detail__info-label">{t('deadline')}</span>
                  <span className="project-detail__info-value">{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              )}
              <div className="project-detail__info-item">
                <span className="project-detail__info-label">{t('revisions')}</span>
                <span className="project-detail__info-value">
                  {project.revisionsUsed} / {project.revisionsIncluded}
                </span>
              </div>
            </div>
          </section>

          {/* Brief */}
          <section className="project-detail__section">
            <h2 className="project-detail__section-title">{t('brief')}</h2>
            <p className="project-detail__brief">{project.brief}</p>
            {project.referenceLinks && project.referenceLinks.length > 0 && (
              <div className="project-detail__references">
                <h3 className="project-detail__references-title">{t('referenceLinks')}</h3>
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
              <ProjectFileUploader projectId={projectId} fileType="deliverable" disabled={!canUploadDeliverable} />
            </section>
          )}

          {/* Revision Files */}
          {((fileCounts?.revision ?? 0) > 0 || (canUploadDeliverable && project.revisionsUsed > 0)) && (
            <section className="project-detail__section">
              <ProjectFileUploader projectId={projectId} fileType="revision" disabled={!canUploadDeliverable} />
            </section>
          )}
        </div>

        <div className="project-detail__sidebar">
          {/* Actions */}
          <section className="project-detail__section project-detail__actions">
            <h2 className="project-detail__section-title">{t('actions')}</h2>

            {canAcceptDecline && (
              <div className="project-detail__action-group">
                <Button className="button--primary" onClick={handleAccept} disabled={acceptMutation.isPending}>
                  {acceptMutation.isPending ? t('common.processing') : t('accept')}
                </Button>
                <Button className="button--secondary" onClick={() => setShowDeclineModal(true)}>
                  {t('decline')}
                </Button>
              </div>
            )}

            {canStart && (
              <Button className="button--primary" onClick={handleStart} disabled={startMutation.isPending}>
                {startMutation.isPending ? t('common.processing') : t('startWorking')}
              </Button>
            )}

            {canDeliver && (
              <Button className="button--primary" onClick={() => setShowDeliveryModal(true)}>
                {t('deliver')}
              </Button>
            )}

            {canRequestRevision && (
              <Button className="button--secondary" onClick={() => setShowRevisionModal(true)}>
                {t('requestRevision')}
              </Button>
            )}

            {canComplete && (
              <Button className="button--primary" onClick={handleComplete} disabled={completeMutation.isPending}>
                {completeMutation.isPending ? t('common.processing') : t('markComplete')}
              </Button>
            )}

            {canCancel && (
              <Button className="button--danger" onClick={handleCancel} disabled={cancelMutation.isPending}>
                {t('cancel')}
              </Button>
            )}

            {!canAcceptDecline && !canStart && !canDeliver && !canRequestRevision && !canComplete && !canCancel && (
              <p className="project-detail__no-actions">{t('noActions')}</p>
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
            <h3>{t('declineProject')}</h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={t('declineReasonPlaceholder')}
              rows={4}
            />
            <div className="project-detail__modal-actions">
              <Button className="button--secondary" onClick={() => setShowDeclineModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="button--danger" onClick={handleDecline} disabled={declineMutation.isPending}>
                {declineMutation.isPending ? t('common.processing') : t('confirmDecline')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="project-detail__modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="project-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('deliverProject')}</h3>
            <p className="project-detail__modal-hint">{t('deliveryHint')}</p>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder={t('deliveryNotesPlaceholder')}
              rows={4}
            />
            <div className="project-detail__modal-actions">
              <Button className="button--secondary" onClick={() => setShowDeliveryModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="button--primary" onClick={handleDeliver} disabled={deliverMutation.isPending}>
                {deliverMutation.isPending ? t('common.processing') : t('confirmDelivery')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="project-detail__modal-overlay" onClick={() => setShowRevisionModal(false)}>
          <div className="project-detail__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('requestRevision')}</h3>
            <p className="project-detail__modal-hint">
              {t('revisionHint', { count: project.revisionsIncluded - project.revisionsUsed })}
            </p>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder={t('revisionFeedbackPlaceholder')}
              rows={4}
              required
            />
            <div className="project-detail__modal-actions">
              <Button className="button--secondary" onClick={() => setShowRevisionModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="button--primary"
                onClick={handleRequestRevision}
                disabled={!revisionFeedback.trim() || revisionMutation.isPending}
              >
                {revisionMutation.isPending ? t('common.processing') : t('submitRevision')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
