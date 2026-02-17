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
const RED = '#dc2626';

const RTL: React.CSSProperties = { direction: 'rtl' };

// ── Scene 1: Phone ringing chaos ──
const PhoneChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shake = Math.sin(frame * 0.8) * (frame < 70 ? 4 : 0);
  const buzzOpacity = frame < 70 ? interpolate(Math.sin(frame * 0.5), [-1, 1], [0.5, 1]) : 0;

  const messages = [
    { text: 'הי, יש לכם זמן פנוי ביום שלישי?', time: '09:31', delay: 10 },
    { text: 'אפשר לבטל את ההזמנה?', time: '10:15', delay: 22 },
    { text: 'מה המחיר לשעה?', time: '11:02', delay: 34 },
    { text: 'אתם פתוחים בשישי?', time: '12:47', delay: 46 },
    { text: 'שלחתי לכם העברה, בדקו בבקשה', time: '14:20', delay: 58 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Header with shaking phone */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'inline-block',
            fontSize: 70,
            transform: `rotate(${shake}deg)`,
            opacity: buzzOpacity,
            marginBottom: 15
          }}
        >
          📱
        </div>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 40px',
            lineHeight: 1.2,
            opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          עייפת מלענות{'\n'}
          <span style={{ color: RED }}>על אותן שאלות?</span>
        </h1>
      </div>

      {/* Message bubbles */}
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        {messages.map((msg, i) => {
          const enter = spring({ frame: frame - msg.delay, fps, config: { damping: 12, stiffness: 90 } });
          const isLeft = i % 2 === 0;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px)`
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: 18,
                  borderTopRightRadius: isLeft ? 18 : 4,
                  borderTopLeftRadius: isLeft ? 4 : 18,
                  padding: '16px 20px',
                  maxWidth: '80%'
                }}
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 20,
                    color: LIGHT_TEXT,
                    margin: '0 0 4px'
                  }}
                >
                  {msg.text}
                </p>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overwhelmed indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [70, 85], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, color: SUBTLE_TEXT }}>
          וזה רק עד הצהריים... 😩
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: The solution ──
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });

  const benefits = [
    'לקוחות רואים זמינות בזמן אמת',
    'מחירים ושירותים מפורסמים מראש',
    'הזמנה ותשלום בלחיצה',
    'אישורים נשלחים אוטומטית'
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      {/* Header */}
      <div style={{ marginTop: 100, textAlign: 'center', marginBottom: 50 }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 65,
            height: 65,
            borderRadius: 13,
            marginBottom: 20,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 10px',
            lineHeight: 1.2,
            opacity: enter
          }}
        >
          תן ל<span style={{ color: GOLD }}>סטודיוז</span>
          {'\n'}לענות במקומך
        </h1>
      </div>

      {/* Benefits */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {benefits.map((text, i) => {
          const itemEnter = spring({ frame: frame - 15 - i * 10, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: DARK_CARD,
                borderRadius: 16,
                padding: '20px 22px',
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: itemEnter,
                transform: `translateX(${interpolate(itemEnter, [0, 1], [40, 0])}px)`
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>✅</span>
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: LIGHT_TEXT }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        <div
          style={{
            backgroundColor: GOLD,
            padding: '18px 50px',
            borderRadius: 14,
            boxShadow: '0 0 40px rgba(255,209,102,0.2)'
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 24, fontWeight: 700, color: DARK_BG }}>
            התחל בחינם
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: SUBTLE_TEXT, marginTop: 14 }}>
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad14_NoCalls: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120}>
        <PhoneChaos />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <SolutionScene />
      </Sequence>
    </AbsoluteFill>
  );
};
