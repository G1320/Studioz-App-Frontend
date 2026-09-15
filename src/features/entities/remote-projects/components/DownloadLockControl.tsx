import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, LockOpen, Unlock } from 'lucide-react';
import { Button } from '@shared/components';
import { useReleaseDownloadsMutation, useSetDownloadLockMutation } from '@shared/hooks';
import type { RemoteProject } from 'src/types/index';
import './styles/_download-lock-control.scss';

interface DownloadLockControlProps {
  project: RemoteProject;
  /** Server-computed: is the lock currently keeping the customer from downloading? */
  deliverablesLocked: boolean;
}

/**
 * Vendor-side control for the deliverable download lock.
 * The lock keeps customers on streaming previews until the project is
 * completed/paid, or until the vendor releases the files manually.
 */
export const DownloadLockControl: FC<DownloadLockControlProps> = ({ project, deliverablesLocked }) => {
  const { t } = useTranslation('remoteProjects');
  const setLock = useSetDownloadLockMutation();
  const release = useReleaseDownloadsMutation();

  const enabled = project.downloadLock?.enabled ?? false;
  const released = !!project.downloadLock?.releasedAt;
  const finished = ['completed', 'cancelled', 'declined'].includes(project.status);
  const busy = setLock.isPending || release.isPending;

  let statusKey: string;
  if (!enabled) statusKey = 'downloadLock.status.off';
  else if (deliverablesLocked) statusKey = 'downloadLock.status.locked';
  else if (released) statusKey = 'downloadLock.status.released';
  else statusKey = 'downloadLock.status.autoReleased';

  return (
    <div className={`download-lock${deliverablesLocked ? ' download-lock--active' : ''}`}>
      <div className="download-lock__head">
        {deliverablesLocked ? <Lock size={16} aria-hidden /> : <LockOpen size={16} aria-hidden />}
        <div className="download-lock__text">
          <span className="download-lock__title">{t('downloadLock.title')}</span>
          <span className="download-lock__status">{t(statusKey)}</span>
        </div>
      </div>
      <p className="download-lock__hint">{t('downloadLock.hint')}</p>

      <div className="download-lock__actions">
        <label className="download-lock__toggle">
          <input
            type="checkbox"
            checked={enabled}
            disabled={busy || finished}
            onChange={(e) => setLock.mutate({ projectId: project._id, enabled: e.target.checked })}
          />
          <span>{t('downloadLock.toggle')}</span>
        </label>

        {deliverablesLocked && (
          <Button
            className="button--secondary download-lock__release"
            onClick={() => release.mutate(project._id)}
            disabled={busy}
          >
            <Unlock size={14} aria-hidden />
            {release.isPending ? t('common.processing') : t('downloadLock.releaseNow')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DownloadLockControl;
