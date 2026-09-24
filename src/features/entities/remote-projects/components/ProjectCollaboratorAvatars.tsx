import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectCollaborator } from 'src/types';
import {
  activeCollaborators,
  collaboratorAvatarTone,
  collaboratorFace,
  collaboratorUserId,
  collaboratorUserTooltip,
  type CollaboratorFace
} from '../utils/collaboratorUser';
import './styles/_project-collaborators.scss';

interface ProjectCollaboratorAvatarsProps {
  collaborators?: ProjectCollaborator[];
  maxVisible?: number;
  className?: string;
  trailing?: ReactNode;
  /** When true, render nothing if there are no people to show. */
  hideWhenEmpty?: boolean;
}

function AvatarChip({
  face,
  tip,
  id
}: {
  face: CollaboratorFace;
  tip: string;
  id: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = face.kind === 'image' && !imageFailed;
  const fallbackText =
    face.kind === 'image'
      ? tip
          .split(/[\s._@-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join('')
          .slice(0, 2) || '?'
      : face.text;
  const tone = showImage ? undefined : collaboratorAvatarTone(id);

  return (
    <span className="project-collaborators__avatar" title={tip} aria-label={tip} style={tone}>
      {showImage ? (
        <img src={face.src} alt="" onError={() => setImageFailed(true)} />
      ) : (
        <span
          className={
            face.kind === 'email'
              ? 'project-collaborators__avatar-email'
              : 'project-collaborators__avatar-initials'
          }
          aria-hidden
        >
          {fallbackText}
        </span>
      )}
    </span>
  );
}

export function ProjectCollaboratorAvatars({
  collaborators,
  maxVisible = 5,
  className = '',
  trailing,
  hideWhenEmpty = false
}: ProjectCollaboratorAvatarsProps) {
  const { t } = useTranslation('remoteProjects');
  const people = activeCollaborators(collaborators);
  const visible = people.slice(0, maxVisible);
  const overflowCount = Math.max(0, people.length - maxVisible);

  if (hideWhenEmpty && visible.length === 0 && !trailing) return null;

  return (
    <div className={`project-collaborators__avatars ${className}`.trim()}>
      {visible.map((collaborator) => {
        const tip = collaboratorUserTooltip(collaborator.userId);
        const face = collaboratorFace(collaborator.userId);
        if (!face) return null;
        return (
          <AvatarChip key={collaboratorUserId(collaborator.userId)} face={face} tip={tip} id={collaboratorUserId(collaborator.userId)} />
        );
      })}
      {overflowCount > 0 ? (
        <span
          className="project-collaborators__avatar project-collaborators__avatar--more"
          title={t('collaborators.moreCount', { count: overflowCount, defaultValue: `+${overflowCount}` })}
        >
          +{overflowCount}
        </span>
      ) : null}
      {trailing}
    </div>
  );
}
