import { useState, useRef, useEffect } from 'react';
import { PlayIcon } from '@shared/components/icons';
import './styles/_video-player.scss';

/**
 * Video Player variant types
 */
export type VideoPlayerVariant = 'default' | 'minimal' | 'embedded';

/**
 * Video Player Props
 */
export interface VideoPlayerProps {
  /** The embed URL for the video (Bunny Stream, YouTube, Vimeo, etc.) */
  embedUrl?: string;
  /** Placeholder text when no video is provided */
  placeholderText?: string;
  /** Whether to show the macOS-style frame bar */
  showFrameBar?: boolean;
  /** Custom aspect ratio (default: 16/9) */
  aspectRatio?: string;
  /** Additional CSS class name */
  className?: string;
  /** Variant style */
  variant?: VideoPlayerVariant;
  /** Custom poster image URL */
  posterUrl?: string;
  /** Auto play the video */
  autoPlay?: boolean;
  /** Loop the video */
  loop?: boolean;
  /** Mute the video */
  muted?: boolean;
  /** Loading spinner color (defaults to brand color) */
  spinnerColor?: string;
  /** Callback when video starts loading */
  onLoadStart?: () => void;
  /** Callback when video finishes loading */
  onLoad?: () => void;
  /** Callback when video errors */
  onError?: () => void;
}

/**
 * Reusable Video Player Component
 * 
 * Supports embedded videos with:
 * - Loading spinner overlay
 * - macOS-style frame bar
 * - Placeholder for missing videos
 * - Multiple variants
 * - Customizable aspect ratio
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  embedUrl,
  placeholderText = 'Video Coming Soon',
  showFrameBar = true,
  aspectRatio = '16 / 9',
  className = '',
  variant = 'default',
  posterUrl,
  autoPlay = false,
  loop = true,
  muted = true,
  spinnerColor,
  onLoadStart,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build iframe URL with params
  const buildEmbedUrl = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    const params = new URLSearchParams({
      autoplay: autoPlay ? 'true' : 'false',
      loop: loop ? 'true' : 'false',
      muted: muted ? 'true' : 'false',
      preload: 'true',
      playsinline: 'true',
      // Cleaner player UI - hide extra controls
      showSpeed: 'false',
      showCaptions: 'false',
      showHeatmap: 'false',
      showPlaylist: 'false',
      showShareButton: 'false'
    });
    return `${url}${separator}${params.toString()}`;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  useEffect(() => {
    if (embedUrl) {
      setIsLoading(true);
      setHasError(false);
      onLoadStart?.();
    }
  }, [embedUrl, onLoadStart]);

  const containerClasses = [
    'video-player',
    `video-player--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      style={{ '--video-aspect-ratio': aspectRatio } as React.CSSProperties}
    >
      {/* macOS-style Frame Bar */}
      {showFrameBar && (
        <div className="video-player__frame">
          <div className="video-player__dot video-player__dot--red" />
          <div className="video-player__dot video-player__dot--yellow" />
          <div className="video-player__dot video-player__dot--green" />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && embedUrl && !hasError && (
        <div className="video-player__loading-overlay">
          <div 
            className="video-player__spinner"
            style={spinnerColor ? { borderTopColor: spinnerColor } as React.CSSProperties : undefined}
          />
        </div>
      )}

      {/* Video Content */}
      {embedUrl && !hasError ? (
        <iframe
          ref={iframeRef}
          src={buildEmbedUrl(embedUrl)}
          className="video-player__iframe"
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      ) : (
        <div className="video-player__placeholder">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt="Video poster" 
              className="video-player__poster"
            />
          ) : (
            <>
              <PlayIcon className="video-player__placeholder-icon" />
              <p className="video-player__placeholder-text">{placeholderText}</p>
            </>
          )}
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="video-player__error">
          <p>Failed to load video</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
