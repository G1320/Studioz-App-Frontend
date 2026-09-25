/**
 * Status bar overlay for iPhone mockups.
 * Geometry keyed to a 393×852 logical screen (iPhone 16 / Dynamic Island).
 * Sizes use cqw so icons stay proportional to the mockup width.
 */
export function IphoneStatusChrome() {
  return (
    <div className="iphone-status-chrome" aria-hidden="true">
      <span className="iphone-status-chrome__time">9:41</span>
      <span className="iphone-status-chrome__island" />
      <span className="iphone-status-chrome__icons">
        {/* SF Symbol–accurate cellularbars */}
        <svg
          className="iphone-status-chrome__cellular"
          viewBox="0 0 17 12"
          width="17"
          height="12"
          focusable="false"
        >
          <rect x="0" y="7.5" width="3" height="4.5" rx="0.75" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.75" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.75" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.75" fill="currentColor" />
        </svg>
        {/* SF Symbol–accurate wifi (arc strokes + dot) */}
        <svg
          className="iphone-status-chrome__wifi"
          viewBox="0 0 16 12"
          width="16"
          height="12"
          fill="none"
          focusable="false"
        >
          <path
            d="M1.15 4.05c3.85-3.35 9.85-3.35 13.7 0"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <path
            d="M3.45 6.55c2.55-2.15 6.55-2.15 9.1 0"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <path
            d="M5.75 9.05c1.25-1.05 3.25-1.05 4.5 0"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.05" r="1.05" fill="currentColor" />
        </svg>
        {/* Modern iOS battery (no percentage) — outline + tip + 100% fill */}
        <svg
          className="iphone-status-chrome__battery"
          viewBox="0 0 27.5 13"
          width="27.5"
          height="13"
          focusable="false"
        >
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="12"
            rx="3.2"
            ry="3.2"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <rect x="2" y="2" width="20" height="9" rx="2.1" fill="currentColor" />
          <rect
            x="25"
            y="4"
            width="2.5"
            height="5"
            rx="1.2"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </span>
    </div>
  );
}
