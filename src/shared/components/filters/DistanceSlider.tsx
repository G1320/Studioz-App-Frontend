import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useLocationPermission } from '@core/contexts/LocationPermissionContext';
import { useTranslation } from 'react-i18next';
import { formatDistance } from '@shared/utils/distanceUtils';
import './styles/_distance-slider.scss';

export const DistanceSlider: React.FC = () => {
  const langNavigate = useLanguageNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { userLocation, hasGranted } = useLocationPermission();
  const { t } = useTranslation('studios');
  
  // Get initial distance from URL or use default
  const urlDistance = searchParams.get('maxDistance');
  const initialDistance = urlDistance ? Number(urlDistance) : 50; // Default 50km
  
  const [distance, setDistance] = useState(initialDistance);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use refs to track values and prevent infinite loops
  const lastUrlDistanceRef = useRef(urlDistance);
  const isUpdatingUrlRef = useRef(false);

  // Sync with URL changes from outside (only on mount or when URL changes externally)
  const maxDistanceParam = searchParams.get('maxDistance');
  
  useEffect(() => {
    if (isUpdatingUrlRef.current) {
      return; // Skip if we just updated internally
    }

    const currentUrlDistance = maxDistanceParam;
    
    // Only update if URL changed externally (not from our own navigation)
    if (currentUrlDistance !== lastUrlDistanceRef.current) {
      const numDistance = currentUrlDistance ? Number(currentUrlDistance) : 50;
      if (!isNaN(numDistance)) {
        setDistance(numDistance);
        lastUrlDistanceRef.current = currentUrlDistance;
      }
    } else if (!currentUrlDistance && lastUrlDistanceRef.current !== null) {
      // Reset to default if URL param is removed externally
      setDistance(50);
      lastUrlDistanceRef.current = null;
    }
  }, [maxDistanceParam]); // Only depend on the actual value string, not the object

  // Update URL with current distance value
  const updateUrl = (distanceValue: number) => {
    isUpdatingUrlRef.current = true;
    
    const newSearchParams = new URLSearchParams(location.search);
    
    if (distanceValue === 50) {
      // Remove param if at default
      newSearchParams.delete('maxDistance');
    } else {
      newSearchParams.set('maxDistance', distanceValue.toString());
    }

    const strippedPath = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/i, '');
    const nextPath = strippedPath.length > 0 ? strippedPath : '/studios';
    const searchString = newSearchParams.toString();
    const newUrl = `${nextPath}${searchString ? `?${searchString}` : ''}`;
    
    // Only navigate if URL actually changed
    const currentSearch = location.search;
    const newSearch = searchString ? `?${searchString}` : '';
    if (currentSearch !== newSearch) {
      langNavigate(newUrl, { replace: true });
      lastUrlDistanceRef.current = newSearchParams.get('maxDistance');
    }
    
    // Reset flag after navigation
    setTimeout(() => {
      isUpdatingUrlRef.current = false;
    }, 50);
  };

  // Throttle URL updates during dragging to avoid too many updates
  const updateUrlThrottledRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = Number(e.target.value);
    setDistance(newDistance);
    
    // Update URL in real-time, but throttle during dragging
    if (isDragging) {
      // Clear any pending update
      if (updateUrlThrottledRef.current) {
        clearTimeout(updateUrlThrottledRef.current);
      }
      // Throttle updates to every 100ms during dragging
      updateUrlThrottledRef.current = setTimeout(() => {
        updateUrl(newDistance);
      }, 100);
    } else {
      // Update immediately when not dragging
      updateUrl(newDistance);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Clear any pending throttled update and update immediately
    if (updateUrlThrottledRef.current) {
      clearTimeout(updateUrlThrottledRef.current);
      updateUrlThrottledRef.current = null;
    }
    // Final update on release to ensure URL is in sync
    updateUrl(distance);
  };

  // Don't show if user doesn't have location
  if (!userLocation || !hasGranted) {
    return null;
  }

  return (
    <div className="distance-slider">
      <div className="distance-slider__header">
        <label className="distance-slider__label" htmlFor="distance-slider-input">
          {t('distanceFilter.label', 'Max Distance')}
        </label>
        <span className="distance-slider__value">{formatDistance(distance)}</span>
      </div>
      <input
        id="distance-slider-input"
        type="range"
        min="1"
        max="100"
        step="1"
        value={distance}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className="distance-slider__input"
        aria-label={t('distanceFilter.ariaLabel', 'Maximum distance filter')}
      />
      <div className="distance-slider__range-labels">
        <span className="distance-slider__range-label">1 km</span>
        <span className="distance-slider__range-label">100 km</span>
      </div>
    </div>
  );
};

