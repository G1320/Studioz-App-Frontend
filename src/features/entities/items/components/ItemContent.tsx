import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ReservationDetailsForm, HourSelector, BookingActions } from '@features/entities';
import { MuiDateTimePicker } from '@shared/components';
import { useTranslation } from 'react-i18next';
import { ReservationCard } from '@features/entities/reservations';
import { ProjectRequestForm, ProjectCard } from '@features/entities/remote-projects/components';
import { AddOnsList } from '@features/entities/addOns/components';
import { isFeatureEnabled } from '@core/config/featureFlags';
import { AddOn, Cart, Item, Reservation, Studio, RemoteProject } from 'src/types/index';
import { AnimatePresence, motion } from 'framer-motion';
import { getMinimumHours, getMaximumHours, AvailabilityContext } from '@shared/utils/availabilityUtils';

interface ItemContentProps {
  item: Item;
  studio?: Studio;
  cart?: Cart;
  addOns: AddOn[];
  reservation?: Reservation;
  currentReservationId: string | null;
  selectedDate: Date | null;
  selectedQuantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  comment: string;
  isPhoneVerified: boolean;
  isBooked: boolean;
  isLoading: boolean;
  selectedAddOnIds: string[];
  addOnsTotal: number;
  onDateChange: (date: Date | null) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddOnToggle: (addOn: AddOn) => void;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onPhoneVerified: () => void;
  onBookNow: () => void;
  onCancelReservation: () => void;
  // Remote project props
  customerId?: string;
  currentProjectId?: string | null;
  currentProject?: RemoteProject | null;
  onClearProject?: () => void;
  // Project form state
  projectTitle?: string;
  projectBrief?: string;
  projectReferenceLinks?: string[];
  onProjectTitleChange?: (value: string) => void;
  onProjectBriefChange?: (value: string) => void;
  onProjectReferenceLinksChange?: (links: string[]) => void;
  onSubmitProject?: () => void;
  isProjectLoading?: boolean;
  // Project pricing
  projectPrice?: number;
  paymentEnabled?: boolean;
}

// Slide animation variants (same as SteppedForm)
const slideVariants = {
  enter: (isRTL: boolean) => ({
    x: isRTL ? '-100%' : '100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (isRTL: boolean) => ({
    x: isRTL ? '100%' : '-100%',
    opacity: 0
  })
};

const slideTransition = {
  x: { type: 'spring', stiffness: 450, damping: 60 },
  opacity: { duration: 0.2 }
};

export const ItemContent: React.FC<ItemContentProps> = ({
  item,
  studio,
  cart,
  addOns,
  reservation,
  currentReservationId,
  selectedDate,
  selectedQuantity,
  customerName,
  customerPhone,
  customerEmail: _customerEmail,
  comment,
  isPhoneVerified,
  isBooked,
  isLoading,
  selectedAddOnIds,
  addOnsTotal,
  onDateChange,
  onIncrement,
  onDecrement,
  onAddOnToggle,
  onNameChange,
  onPhoneChange,
  onCommentChange,
  onPhoneVerified,
  onBookNow,
  onCancelReservation,
  // Remote project props
  customerId: _customerId,
  currentProjectId,
  currentProject,
  onClearProject,
  // Project form state
  projectTitle = '',
  projectBrief = '',
  projectReferenceLinks = [''],
  onProjectTitleChange,
  onProjectBriefChange,
  onProjectReferenceLinksChange,
  onSubmitProject,
  isProjectLoading = false,
  // Project pricing
  projectPrice = 0,
  paymentEnabled = false
}) => {
  const { i18n, t } = useTranslation('common');
  const { t: tProject } = useTranslation('remoteProjects');
  const isRTL = i18n.language === 'he';

  // Check if this is a remote project service
  const isRemoteProject = item?.serviceDeliveryType === 'remote' || item?.remoteService === true;
  
  const showReservation = currentReservationId && reservation;
  const showProject = isRemoteProject && currentProjectId && currentProject;

  // Create availability context for calculations
  const availabilityContext = useMemo<AvailabilityContext | null>(() => {
    if (!item) return null;
    return { item, studio };
  }, [item, studio]);

  // Calculate min/max hours based on item constraints and selected date/time
  const minHours = useMemo(() => {
    return item ? getMinimumHours(item) : 1;
  }, [item]);

  const maxHours = useMemo(() => {
    if (!availabilityContext || !selectedDate) return undefined;

    // Get the selected start time from the date
    const selectedDayjs = dayjs(selectedDate);
    const startSlot = selectedDayjs.format('HH:00');

    return getMaximumHours(startSlot, selectedDayjs, availabilityContext);
  }, [availabilityContext, selectedDate]);

  // Get dynamic quantity label based on pricePer, include minimum if > 1
  const quantityLabel = useMemo(() => {
    const pricePer = item?.pricePer || 'hour';
    const baseLabel = t(`quantity_labels.${pricePer}`, t('hours'));
    if (minHours > 1) {
      return `${baseLabel} (${t('min', 'min.')} ${minHours})`;
    }
    return baseLabel;
  }, [item?.pricePer, t, minHours]);

  // Render remote project flow
  if (isRemoteProject) {
    return (
      <>
        <AnimatePresence mode="wait" initial={false} custom={isRTL}>
          {showProject ? (
            <motion.div
              key="project-card"
              custom={isRTL}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="project-card-container"
            >
              <ProjectCard
                project={currentProject}
                variant="itemCard"
                onCreateNew={onClearProject}
              />
            </motion.div>
          ) : (
            <motion.div
              key="project-form"
              custom={isRTL}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="project-form-container"
            >
              {/* Project Details Form */}
              <ProjectRequestForm
                item={item}
                title={projectTitle}
                brief={projectBrief}
                referenceLinks={projectReferenceLinks}
                onTitleChange={onProjectTitleChange || (() => {})}
                onBriefChange={onProjectBriefChange || (() => {})}
                onReferenceLinksChange={onProjectReferenceLinksChange || (() => {})}
              />

              {/* Customer Info with OTP (no comment for projects - brief serves that purpose) */}
              <div className="contact-info-section">
                <h4 className="contact-info-section__label">{tProject('contactInfo')}</h4>
                <ReservationDetailsForm
                  customerName={customerName}
                  customerPhone={customerPhone}
                  comment={comment}
                  onNameChange={onNameChange}
                  onPhoneChange={onPhoneChange}
                  onCommentChange={onCommentChange}
                  isRTL={isRTL}
                  onPhoneVerified={onPhoneVerified}
                  hideComment
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button for Projects - only show after phone verification (same as BookingActions) */}
        {!showProject && isPhoneVerified && (
          <div className="project-actions">
            <button
              type="button"
              className="project-actions__submit"
              onClick={onSubmitProject}
              disabled={!projectTitle.trim() || !projectBrief.trim() || isProjectLoading}
            >
              {isProjectLoading ? (
                <span className="button-loading-spinner" />
              ) : (
                <>
                  {paymentEnabled ? t('buttons.continue_to_payment', 'Continue to Payment') : tProject('submitRequest')}
                  {projectPrice > 0 && <span> (₪{projectPrice.toLocaleString()})</span>}
                </>
              )}
            </button>
            {!paymentEnabled && <p className="project-actions__note">{tProject('submitNote')}</p>}
          </div>
        )}
      </>
    );
  }

  // Render in-studio booking flow
  return (
    <>
      <AnimatePresence mode="wait" initial={false} custom={isRTL}>
        {showReservation ? (
          <motion.div
            key="reservation-card"
            custom={isRTL}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="item-content-animated"
          >
            <ReservationCard reservation={reservation} variant="itemCard" onCancel={onCancelReservation} />
          </motion.div>
        ) : (
          <motion.div
            key="booking-form"
            custom={isRTL}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="item-content-animated"
          >
            {isFeatureEnabled('addOns') && addOns.length > 0 && (
              <section className="item-addons-section">
                <h4 className="item-addons-section__label">{t('addOns.sectionTitle', 'שירותים נוספים')}</h4>
                <AddOnsList addOns={addOns} showAddButton onAdd={onAddOnToggle} selectedAddOnIds={selectedAddOnIds} />
              </section>
            )}

            <div className="date-picker-row">
              <MuiDateTimePicker
                value={selectedDate}
                onChange={onDateChange}
                itemAvailability={item?.availability || []}
                studioAvailability={studio?.studioAvailability}
                item={item}
                studio={studio}
              />

              <div className="hours-wrapper">
                <label className="hours-label">{quantityLabel}</label>
                <HourSelector
                  value={selectedQuantity}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  min={minHours}
                  max={maxHours}
                />
              </div>
            </div>

            <ReservationDetailsForm
              customerName={customerName}
              customerPhone={customerPhone}
              comment={comment}
              onNameChange={onNameChange}
              onPhoneChange={onPhoneChange}
              onCommentChange={onCommentChange}
              isRTL={isRTL}
              onPhoneVerified={onPhoneVerified}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BookingActions
        price={item?.price || 0}
        quantity={selectedQuantity}
        currentReservationId={currentReservationId}
        isPhoneVerified={isPhoneVerified}
        isBooked={isBooked}
        cart={cart}
        onBookNow={onBookNow}
        addOnsTotal={addOnsTotal}
        isLoading={isLoading}
        paymentEnabled={studio?.paymentEnabled}
      />
    </>
  );
};
