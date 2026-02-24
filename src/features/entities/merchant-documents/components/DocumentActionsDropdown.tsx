/**
 * DocumentActionsDropdown Component
 * Dropdown menu for document actions (send email, duplicate, void, etc.)
 */
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Copy, Ban, Printer, Eye, Download, MoreVertical } from 'lucide-react';
import { MerchantDocument } from '@shared/services';
import { useDropdownPosition } from '@shared/hooks';

interface DocumentActionsDropdownProps {
  document: MerchantDocument;
  onView: (doc: MerchantDocument) => void;
  onDownload: (doc: MerchantDocument) => void;
  onSendEmail: (doc: MerchantDocument) => void;
  onDuplicate: (doc: MerchantDocument) => void;
  onVoid: (doc: MerchantDocument) => void;
  onPrint: (doc: MerchantDocument) => void;
}

export const DocumentActionsDropdown: React.FC<DocumentActionsDropdownProps> = ({
  document: doc,
  onView,
  onDownload,
  onSendEmail,
  onDuplicate,
  onVoid,
  onPrint
}) => {
  const { t } = useTranslation('merchantDocs');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isRtl = typeof document !== 'undefined' && document.documentElement.getAttribute('dir') === 'rtl';
  const { menuRef, menuStyle } = useDropdownPosition(isOpen, triggerRef, {
    placement: isRtl ? 'bottom-start' : 'bottom-end',
    gap: 4
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    window.document.addEventListener('mousedown', handleClickOutside);
    return () => window.document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const canVoid = doc.status !== 'paid' && doc.status !== 'draft';

  const menuContent = (
    <div ref={menuRef as React.RefObject<HTMLDivElement>} className="document-actions-dropdown__menu" style={menuStyle}>
      <button
        type="button"
        className="document-actions-dropdown__item"
        onClick={() => handleAction(() => onView(doc))}
        disabled={!doc.documentUrl}
      >
        <Eye size={16} />
        <span>{t('dropdown.viewDocument', 'צפייה במסמך')}</span>
      </button>

      <button
        type="button"
        className="document-actions-dropdown__item"
        onClick={() => handleAction(() => onDownload(doc))}
        disabled={!doc.documentUrl}
      >
        <Download size={16} />
        <span>{t('actions.download')}</span>
      </button>

      <button
        type="button"
        className="document-actions-dropdown__item"
        onClick={() => handleAction(() => onPrint(doc))}
        disabled={!doc.documentUrl}
      >
        <Printer size={16} />
        <span>{t('dropdown.print', 'הדפסה')}</span>
      </button>

      <div className="document-actions-dropdown__divider" />

      <button
        type="button"
        className="document-actions-dropdown__item"
        onClick={() => handleAction(() => onSendEmail(doc))}
      >
        <Mail size={16} />
        <span>{t('dropdown.sendEmail', 'שלח באימייל')}</span>
      </button>

      <button
        type="button"
        className="document-actions-dropdown__item"
        onClick={() => handleAction(() => onDuplicate(doc))}
      >
        <Copy size={16} />
        <span>{t('dropdown.duplicate', 'שכפל מסמך')}</span>
      </button>

      {canVoid && (
        <>
          <div className="document-actions-dropdown__divider" />
          <button
            type="button"
            className="document-actions-dropdown__item document-actions-dropdown__item--danger"
            onClick={() => handleAction(() => onVoid(doc))}
          >
            <Ban size={16} />
            <span>{t('dropdown.void', 'בטל מסמך')}</span>
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="document-actions-dropdown" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        className="document-actions-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={t('actions.moreActions')}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && createPortal(menuContent, document.body)}
    </div>
  );
};

export default DocumentActionsDropdown;
