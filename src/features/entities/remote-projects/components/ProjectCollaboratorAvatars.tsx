import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProjectCollaborator } from 'src/types';
import {
  activeCollaborators,
  collaboratorFace,
  collaboratorUserId,
  collaboratorUserTooltip
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
          <span
            key={collaboratorUserId(collaborator.userId)}
            className="project-collaborators__avatar"
            title={tip}
            aria-label={tip}
          >
            {face.kind === 'image' ? (
              <img src={face.src} alt="" />
            ) : (
              <span
                className={
                  face.kind === 'email'
                    ? 'project-collaborators__avatar-email'
                    : 'project-collaborators__avatar-initials'
                }
                aria-hidden
              >
                {face.text}
              </span>
            )}
          </span>
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
