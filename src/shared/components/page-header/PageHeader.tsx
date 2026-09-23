import type { ReactNode } from 'react';
import './_page-header.scss';

export interface PageHeaderProps {
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
  as?: 'header' | 'div';
}

export function PageHeader({
  icon,
  title,
  meta,
  children,
  className = '',
  as: Tag = 'header'
}: PageHeaderProps) {
  return (
    <Tag className={`page-header ${className}`.trim()}>
      <div className="page-header__title-row">
        {icon ? <span className="page-header__icon">{icon}</span> : null}
        <h1 className="page-header__title">{title}</h1>
        {meta ? <span className="page-header__meta">{meta}</span> : null}
      </div>
      <div className="page-header__controls">{children}</div>
    </Tag>
  );
}
