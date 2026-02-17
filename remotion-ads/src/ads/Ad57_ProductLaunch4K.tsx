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
const RTL: React.CSSProperties = { direction: 'rtl' };

/* ─────────────── Scene 1: Cinematic Logo Reveal ─────────────── */
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    x: 1920 + Math.sin(i * 2.4) * 800,
    y: 540 + Math.cos(i * 1.7) * 400,
    size: 3 + (i % 4) * 2,
    speed: 0.5 + (i % 3) * 0.3,
    delay: i * 2
  }));

  const logoScale = spring({ frame: frame - 20, fps, config: { damping: 8, stiffness: 60 } });
  const titleEnter = spring({ frame: frame - 45, fps, config: { damping: 12 } });
  const subtitleEnter = spring({ frame: frame - 65, fps, config: { damping: 12 } });

  // Glow pulse
  const glowOpacity = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.1, 0.3]);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}${Math.round(glowOpacity * 255)
            .toString(16)
            .padStart(2, '0')} 0%, transparent 70%)`,
          opacity: logoScale
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => {
        const enter = interpolate(frame, [p.delay, p.delay + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });
        const drift = Math.sin(frame * 0.02 * p.speed + i) * 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x + drift,
              top: p.y + Math.cos(frame * 0.015 + i) * 20,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: i % 3 === 0 ? GOLD : SUBTLE_TEXT,
              opacity: enter * 0.4
            }}
          />
        );
      })}

      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${logoScale})` }}>
        <Img
          src={staticFile('logo.png')}
          style={{ width: 160, height: 160, borderRadius: 32, marginBottom: 30, boxShadow: `0 0 80px ${GOLD}30` }}
        />
      </div>

      {/* Title */}
      <div style={{ position: 'absolute', top: '58%', textAlign: 'center', ...RTL }}>
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 90,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`
          }}
        >
          סטודיוז
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 36,
            fontWeight: 500,
            color: SUBTLE_TEXT,
            margin: '10px 0 0',
            opacity: subtitleEnter,
            transform: `translateY(${interpolate(subtitleEnter, [0, 1], [20, 0])}px)`
          }}
        >
          הפלטפורמה לניהול סטודיואים
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Scene 2: The Problem ─────────────── */
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const problems = [
    { icon: '📱', text: 'הודעות וואטסאפ אינסופיות', delay: 10 },
    { icon: '📋', text: 'יומן ידני שתמיד מתפספס', delay: 30 },
    { icon: '💸', text: 'ביטולים בלי התראה', delay: 50 },
    { icon: '🤯', text: 'ניהול חשבונות בקובץ אקסל', delay: 70 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', padding: '0 140px' }}>
        {/* Left side - text */}
        <div style={{ flex: 1, paddingLeft: 80 }}>
          <h2
            style={{
              fontFamily: "'DM Sans', 'Heebo', sans-serif",
              fontSize: 64,
              fontWeight: 700,
              color: LIGHT_TEXT,
              margin: '0 0 15px',
              opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
            }}
          >
            מכירים את זה?
          </h2>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
              fontSize: 28,
              color: SUBTLE_TEXT,
              margin: '0 0 50px',
              opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })
            }}
          >
            ניהול סטודיו לא צריך להיות כזה מסובך
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {problems.map((p, i) => {
              const enter = spring({ frame: frame - p.delay, fps, config: { damping: 12 } });
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    opacity: enter,
                    transform: `translateX(${interpolate(enter, [0, 1], [60, 0])}px)`
                  }}
                >
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 18,
                      backgroundColor: `#dc262615`,
                      border: '1px solid #dc262630',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ fontSize: 32 }}>{p.icon}</span>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 28, color: LIGHT_TEXT }}>
                    {p.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side - visual chaos */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = i * 25 - 50 + Math.sin(frame * 0.03 + i) * 5;
            const enter = spring({ frame: frame - 15 - i * 8, fps, config: { damping: 10 } });
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 300,
                  height: 80,
                  backgroundColor: DARK_CARD,
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.06)',
                  transform: `rotate(${angle}deg) translateY(${(i - 2) * 50}px)`,
                  opacity: enter * 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 20px',
                  gap: 12
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#dc2626' }} />
                <div style={{ height: 12, flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6 }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Scene 3: The Solution ─────────────── */
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: '📅', title: 'הזמנות אוטומטיות', desc: 'לקוחות מזמינים ומשלמים בקליק', delay: 20 },
    { icon: '📊', title: 'דאשבורד חכם', desc: 'כל המספרים במקום אחד', delay: 40 },
    { icon: '💳', title: 'תשלומים מאובטחים', desc: 'סליקה מובנית, בלי צד שלישי', delay: 60 },
    { icon: '🔔', title: 'התראות חכמות', desc: 'הזמנות, ביטולים, תזכורות', delay: 80 },
    { icon: '🌐', title: 'עמוד סטודיו', desc: 'נוכחות דיגיטלית מקצועית', delay: 100 },
    { icon: '📱', title: 'מובייל פירסט', desc: 'עובד מושלם מכל מכשיר', delay: 120 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 10px',
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          הכל ב<span style={{ color: GOLD }}>פלטפורמה אחת</span>
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 28,
            color: SUBTLE_TEXT,
            margin: 0,
            opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          הכלים שכל בעל סטודיו צריך
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 30, justifyContent: 'center', padding: '60px 140px 0' }}>
        {features.map((f, i) => {
          const enter = spring({ frame: frame - f.delay, fps, config: { damping: 10, stiffness: 100 } });
          return (
            <div
              key={i}
              style={{
                width: '28%',
                backgroundColor: DARK_CARD,
                borderRadius: 24,
                padding: '40px 30px',
                textAlign: 'center',
                border: '1px solid rgba(255,209,102,0.08)',
                transform: `scale(${enter})`,
                opacity: enter
              }}
            >
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{f.icon}</span>
              <div
                style={{
                  fontFamily: "'DM Sans', 'Heebo', sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: LIGHT_TEXT,
                  marginBottom: 8
                }}
              >
                {f.title}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 20, color: SUBTLE_TEXT }}>
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Scene 4: Social Proof / Stats ─────────────── */
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: '500+', label: 'סטודיואים פעילים', delay: 10 },
    { value: '10K+', label: 'הזמנות בוצעו', delay: 30 },
    { value: '87%', label: 'שימור לקוחות', delay: 50 },
    { value: '4.9★', label: 'דירוג ממוצע', delay: 70 }
  ];

  const testimonials = [
    { text: 'מאז שעברתי לסטודיוז, ההכנסות עלו ב-40%', name: 'אורי מ., אולפני הקלטות', delay: 90 },
    { text: 'הלקוחות מזמינים לבד, אני רק מגיע לעבוד', name: 'דנה כ., סטודיו צילום', delay: 110 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div
        style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 140px'
        }}
      >
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 60,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: 'center',
            margin: '0 0 60px',
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          המספרים <span style={{ color: GOLD }}>מדברים</span>
        </h2>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginBottom: 70 }}>
          {stats.map((s, i) => {
            const enter = spring({ frame: frame - s.delay, fps, config: { damping: 10 } });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 24,
                  padding: '40px 20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,209,102,0.08)',
                  transform: `scale(${enter})`,
                  opacity: enter
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Sans', monospace",
                    fontSize: 56,
                    fontWeight: 700,
                    color: GOLD,
                    marginBottom: 8
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 22, color: SUBTLE_TEXT }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
          {testimonials.map((t, i) => {
            const enter = spring({ frame: frame - t.delay, fps, config: { damping: 12 } });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: DARK_CARD,
                  borderRadius: 20,
                  padding: '30px 36px',
                  borderRight: `4px solid ${GOLD}`,
                  opacity: enter,
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                    fontSize: 24,
                    color: LIGHT_TEXT,
                    marginBottom: 12,
                    lineHeight: 1.5
                  }}
                >
                  ״{t.text}״
                </div>
                <div style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 18, color: SUBTLE_TEXT }}>
                  — {t.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Scene 5: Built by Owners ─────────────── */
const BuiltByScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 10, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', ...RTL }}>
      {/* Background gradient accent */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`
        }}
      />

      <div style={{ textAlign: 'center', transform: `scale(${enter})`, maxWidth: 1200, padding: '0 60px' }}>
        <div style={{ fontSize: 80, marginBottom: 30 }}>🎯</div>
        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 20px',
            lineHeight: 1.3
          }}
        >
          נבנה על ידי בעלי סטודיואים,{'\n'}
          <span style={{ color: GOLD }}>בשביל בעלי סטודיואים</span>
        </h2>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 28,
            color: SUBTLE_TEXT,
            margin: 0,
            lineHeight: 1.6,
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' })
          }}
        >
          אנחנו לא עוד סטארטאפ שניחש מה צריך.{'\n'}אנחנו בעלי סטודיואים שבנו את הפתרון שתמיד חיפשנו.
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Scene 6: Final CTA ─────────────── */
const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEnter = spring({ frame: frame - 5, fps, config: { damping: 10 } });
  const textEnter = spring({ frame: frame - 25, fps, config: { damping: 12 } });
  const ctaEnter = spring({ frame: frame - 50, fps, config: { damping: 12 } });
  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [1, 1.04]);

  // Ambient particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    x: 960 + Math.sin(i * 1.8) * 700,
    y: 540 + Math.cos(i * 2.3) * 350,
    size: 2 + (i % 3) * 2
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, justifyContent: 'center', alignItems: 'center', ...RTL }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x + Math.sin(frame * 0.02 + i) * 20,
            top: p.y + Math.cos(frame * 0.015 + i) * 15,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: i % 2 === 0 ? GOLD : SUBTLE_TEXT,
            opacity: 0.3
          }}
        />
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 140,
            height: 140,
            borderRadius: 28,
            marginBottom: 40,
            transform: `scale(${logoEnter})`,
            boxShadow: `0 0 100px ${GOLD}20`
          }}
        />

        <h2
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: 'center',
            margin: '0 0 10px',
            opacity: textEnter,
            transform: `translateY(${interpolate(textEnter, [0, 1], [30, 0])}px)`
          }}
        >
          הסטודיו שלך
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 48,
            fontWeight: 600,
            color: GOLD,
            textAlign: 'center',
            margin: '0 0 50px',
            opacity: textEnter
          }}
        >
          מחכה לשדרוג
        </p>

        <div
          style={{
            backgroundColor: GOLD,
            padding: '24px 80px',
            borderRadius: 20,
            boxShadow: `0 0 60px ${GOLD}30`,
            transform: `scale(${ctaEnter * pulse})`
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 36, fontWeight: 700, color: DARK_BG }}>
            הצטרף עכשיו — בחינם
          </span>
        </div>

        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            marginTop: 25,
            opacity: ctaEnter
          }}
        >
          studioz.co.il
        </span>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────── Main Composition ─────────────── */
export const Ad57_ProductLaunch4K: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
    <Sequence from={0} durationInFrames={120}>
      <LogoReveal />
    </Sequence>
    <Sequence from={120} durationInFrames={150}>
      <ProblemScene />
    </Sequence>
    <Sequence from={270} durationInFrames={180}>
      <SolutionScene />
    </Sequence>
    <Sequence from={450} durationInFrames={180}>
      <StatsScene />
    </Sequence>
    <Sequence from={630} durationInFrames={120}>
      <BuiltByScene />
    </Sequence>
    <Sequence from={750} durationInFrames={150}>
      <FinalScene />
    </Sequence>
  </AbsoluteFill>
);
