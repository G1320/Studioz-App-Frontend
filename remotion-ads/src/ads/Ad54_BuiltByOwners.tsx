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

const RTL: React.CSSProperties = { direction: 'rtl' };

// ── Scene 1: The Problem We Lived ──
const WeKnowTheStruggle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pains = [
    { text: 'ישבנו מול יומן מבולגן', delay: 15 },
    { text: 'ענינו על מאות הודעות', delay: 30 },
    { text: 'איבדנו הזמנות בגלל חוסר סדר', delay: 45 },
    { text: 'עבדנו קשה בלי לדעת את המספרים', delay: 60 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      {/* Tagline */}
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center' }}>
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 2,
            opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          הסיפור שלנו
        </span>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '16px 50px 0',
            lineHeight: 1.25,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          גם אנחנו{'\n'}
          <span style={{ color: GOLD }}>בעלי אולפנים</span>
        </h1>
      </div>

      {/* Pain points */}
      <div
        style={{
          position: 'absolute',
          top: 440,
          left: 50,
          right: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        {pains.map((pain, i) => {
          const enter = spring({
            frame: frame - pain.delay,
            fps,
            config: { damping: 12, stiffness: 80 }
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: 16,
                padding: '22px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>😤</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 23,
                  color: SUBTLE_TEXT,
                  fontWeight: 500
                }}
              >
                {pain.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom text */}
      <div
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: 'clamp' })
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 28,
            color: SUBTLE_TEXT
          }}
        >
          אז בנינו את הפתרון בעצמנו.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Built By Us, For You ──
const BuiltForYou: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: '🎯', text: 'בנוי מהשטח — לא מהמשרד', delay: 10 },
    { icon: '🧠', text: 'כל פיצ׳ר נולד מצורך אמיתי', delay: 22 },
    { icon: '🤝', text: 'אנחנו הלקוחות של עצמנו', delay: 34 },
    { icon: '🚀', text: 'מתפתח כל יום לפי פידבק שלכם', delay: 46 }
  ];

  const logoEnter = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 70 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, padding: 50, ...RTL }}>
      {/* Logo + headline */}
      <div style={{ marginTop: 100, textAlign: 'center', marginBottom: 40 }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 70,
            height: 70,
            borderRadius: 14,
            marginBottom: 20,
            opacity: logoEnter,
            transform: `scale(${logoEnter})`
          }}
        />
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            lineHeight: 1.25,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          נבנה על ידי{'\n'}
          <span style={{ color: GOLD }}>בעלי אולפנים</span>
          {'\n'}בשביל בעלי אולפנים
        </h1>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
        {features.map((feat, i) => {
          const enter = spring({
            frame: frame - feat.delay,
            fps,
            config: { damping: 12, stiffness: 80 }
          });
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                backgroundColor: DARK_CARD,
                borderRadius: 18,
                padding: '22px 24px',
                border: '1px solid rgba(255,209,102,0.1)',
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{feat.icon}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 23,
                  color: LIGHT_TEXT,
                  fontWeight: 500
                }}
              >
                {feat.text}
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
          <span
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: DARK_BG
            }}
          >
            הצטרף למשפחה
          </span>
        </div>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 15,
            color: SUBTLE_TEXT,
            marginTop: 14
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const Ad54_BuiltByOwners: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={120}>
        <WeKnowTheStruggle />
      </Sequence>
      <Sequence from={120} durationInFrames={120}>
        <BuiltForYou />
      </Sequence>
    </AbsoluteFill>
  );
};
