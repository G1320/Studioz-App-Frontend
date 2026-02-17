import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile
} from 'remotion';

const GOLD = '#ffd166';
const DARK_BG = '#0a0e14';
const DARK_CARD = '#13171d';
const LIGHT_TEXT = '#f1f5f9';
const SUBTLE_TEXT = '#b8c0cc';
const SUCCESS = '#10b981';
const GOOGLE_BLUE = '#4285f4';
const GOOGLE_RED = '#ea4335';
const GOOGLE_YELLOW = '#fbbc05';
const GOOGLE_GREEN = '#34a853';

const RTL: React.CSSProperties = { direction: 'rtl' };

// ── Scene 1: Calendar sync animation ──
const CalendarSync: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated sync arrows
  const syncRotation = interpolate(frame, [60, 120], [0, 720], { extrapolateRight: 'clamp' });
  const syncDone = frame > 120;

  const timeSlots = [
    { time: '09:00', client: 'דני כהן', type: 'הקלטה', delay: 20 },
    { time: '11:00', client: 'מיכל לוי', type: 'מיקס', delay: 35 },
    { time: '14:00', client: 'יוסי אברהם', type: 'מאסטרינג', delay: 50 },
    { time: '16:30', client: 'שרה דוד', type: 'פודקאסט', delay: 65 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 45, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 80, textAlign: 'center', marginBottom: 25 }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 10px',
            lineHeight: 1.2,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          סנכרון <span style={{ color: GOLD }}>אוטומטי</span>
          {'\n'}עם Google Calendar
        </h1>
      </div>

      {/* Google Calendar colors bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 30,
          opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        {[GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN].map((c, i) => (
          <div key={i} style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: c }} />
        ))}
      </div>

      {/* Calendar time slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {timeSlots.map((slot, i) => {
          const enter = spring({ frame: frame - slot.delay, fps, config: { damping: 12, stiffness: 80 } });
          const syncPulse = syncDone && frame < 140 ? interpolate((frame - 120) % 20, [0, 10, 20], [1, 1.02, 1]) : 1;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: '18px 20px',
                borderRight: `4px solid ${[GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN][i]}`,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px) scale(${syncPulse})`
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: GOLD,
                  minWidth: 65,
                  direction: 'ltr',
                  textAlign: 'center'
                }}
              >
                {slot.time}
              </span>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontFamily: "'DM Sans', 'Heebo', sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: LIGHT_TEXT
                  }}
                >
                  {slot.client}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 16,
                    color: SUBTLE_TEXT,
                    marginRight: 10
                  }}
                >
                  {' · '}
                  {slot.type}
                </span>
              </div>
              {/* Sync indicator */}
              {syncDone && (
                <span
                  style={{
                    fontSize: 20,
                    opacity: interpolate(frame, [122 + i * 3, 130 + i * 3], [0, 1], { extrapolateRight: 'clamp' })
                  }}
                >
                  ✅
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Sync animation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40,
          gap: 20
        }}
      >
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            opacity: interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp' })
          }}
        />
        <div
          style={{
            opacity: interpolate(frame, [55, 65], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `rotate(${syncRotation}deg)`
          }}
        >
          <span style={{ fontSize: 30, color: syncDone ? SUCCESS : GOLD }}>{syncDone ? '✓' : '🔄'}</span>
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          <span style={{ fontSize: 30 }}>📅</span>
        </div>
      </div>

      {/* Status text */}
      <p
        style={{
          textAlign: 'center',
          fontFamily: "'DM Sans', 'Heebo', sans-serif",
          fontSize: 20,
          color: syncDone ? SUCCESS : SUBTLE_TEXT,
          marginTop: 15,
          opacity: interpolate(frame, [60, 72], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        {syncDone ? 'הכל מסונכרן! ✓' : 'מסנכרן...'}
      </p>
    </AbsoluteFill>
  );
};

// ── Scene 2: CTA ──
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', ...RTL }}>
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,209,102,0.08) 0%, transparent 60%)'
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${enter})`,
          padding: 50
        }}
      >
        <Img src={staticFile('logo.png')} style={{ width: 90, height: 90, borderRadius: 18, marginBottom: 25 }} />
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: 'center',
            margin: '0 0 8px',
            lineHeight: 1.2
          }}
        >
          בלי עדכון ידני.
        </h2>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            color: GOLD,
            textAlign: 'center',
            margin: '0 0 30px'
          }}
        >
          בלי לפספס אף פעם.
        </h2>
        <div
          style={{
            backgroundColor: GOLD,
            padding: '18px 50px',
            borderRadius: 14,
            opacity: interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' }),
            boxShadow: '0 0 40px rgba(255,209,102,0.2)'
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>
            התחל בחינם
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            color: SUBTLE_TEXT,
            marginTop: 18,
            opacity: interpolate(frame, [25, 36], [0, 0.7], { extrapolateRight: 'clamp' })
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad16_CalendarSync: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={170}>
        <CalendarSync />
      </Sequence>
      <Sequence from={170} durationInFrames={80}>
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
