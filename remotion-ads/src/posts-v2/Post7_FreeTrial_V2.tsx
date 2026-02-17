import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CalendarDays, CreditCard, BarChart3, ShieldCheck, Globe, Bell, Lock, Zap, Heart } from 'lucide-react';

const GOLD = '#ffd166';
const DARK_BG = '#0a0e14';
const DARK_CARD = '#13171d';
const LIGHT_TEXT = '#e2e8f0';
const SUBTLE_TEXT = '#aab2be';
const RTL: React.CSSProperties = { direction: 'rtl' };

export const Post7_FreeTrial_V2: React.FC = () => {
  const benefits = [
    { Icon: CalendarDays, text: 'הזמנות אוטומטיות' },
    { Icon: CreditCard, text: 'סליקה מובנית' },
    { Icon: BarChart3, text: 'דשבורד ניהולי' },
    { Icon: ShieldCheck, text: 'הגנה מביטולים' },
    { Icon: Globe, text: 'עמוד סטודיו מקצועי' },
    { Icon: Bell, text: 'התראות חכמות' }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '60px 60px 50px'
        }}
      >
        {/* Logo */}
        <Img src={staticFile('logo.png')} style={{ width: 64, height: 64, borderRadius: 14, marginBottom: 28 }} />

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 68,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 14px',
            lineHeight: 1.25
          }}
        >
          הסטודיו שלך{'\n'}
          <span style={{ color: GOLD }}>מוכן לשדרוג?</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 24,
            color: SUBTLE_TEXT,
            margin: '0 0 32px',
            lineHeight: 1.6
          }}
        >
          התחל בחינם. בלי כרטיס אשראי.{'\n'}
          בלי התחייבות. פשוט תנסה.
        </p>

        {/* CTA */}
        <div
          style={{
            backgroundColor: GOLD,
            borderRadius: 16,
            padding: '20px 44px',
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 12,
            boxShadow: `0 0 50px ${GOLD}25`,
            marginBottom: 36
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 28, fontWeight: 700, color: DARK_BG }}>
            הצטרף עכשיו — בחינם
          </span>
          <span style={{ fontSize: 24 }}>←</span>
        </div>

        {/* Benefits header */}
        <div
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 20,
            fontWeight: 600,
            color: LIGHT_TEXT,
            marginBottom: 14
          }}
        >
          מה מקבלים?
        </div>

        {/* Benefits grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              style={{
                width: 'calc(50% - 6px)',
                backgroundColor: DARK_CARD,
                borderRadius: 14,
                padding: '18px 18px',
                border: '1px solid rgba(255,209,102,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 11,
                  backgroundColor: `${GOLD}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <b.Icon size={20} color={GOLD} strokeWidth={1.8} />
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 18,
                  color: LIGHT_TEXT,
                  fontWeight: 500
                }}
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', paddingTop: 16, paddingBottom: 8 }}>
          {[
            { Icon: Lock, text: 'מאובטח' },
            { Icon: Zap, text: 'הקמה ב-5 דקות' },
            { Icon: Heart, text: 'בשימוש עשרות אולפנים' }
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <badge.Icon size={14} color={SUBTLE_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: GOLD, fontWeight: 600 }}>
              studioz.co.il
            </span>
            <Img src={staticFile('logo.png')} style={{ width: 36, height: 36, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
