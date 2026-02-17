import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { CalendarDays, CreditCard, BarChart3, ShieldCheck, Globe, Bell, Lock, Zap, Heart } from 'lucide-react';

const GOLD = '#ffd166';
const DARK_BG = '#0a0e14';
const DARK_CARD = '#13171d';
const LIGHT_TEXT = '#e2e8f0';
const SUBTLE_TEXT = '#aab2be';
const RTL: React.CSSProperties = { direction: 'rtl' };

export const Post7_FreeTrial_V3: React.FC = () => {
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
      {/* Subtle noise texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          opacity: 0.4
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '52px 54px 42px',
          position: 'relative'
        }}
      >
        {/* Logo */}
        <Img src={staticFile('logo.png')} style={{ width: 60, height: 60, borderRadius: 14, marginBottom: 22 }} />

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 74,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: '0 0 12px',
            lineHeight: 1.18
          }}
        >
          הסטודיו שלך{'\n'}
          <span style={{ color: GOLD, filter: `drop-shadow(0 0 18px ${GOLD}30)` }}>מוכן לשדרוג?</span>
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
            fontSize: 23,
            color: SUBTLE_TEXT,
            margin: '0 0 26px',
            lineHeight: 1.55
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
            padding: '18px 40px',
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 12,
            boxShadow: `0 0 40px ${GOLD}30`,
            marginBottom: 28
          }}
        >
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 27, fontWeight: 700, color: DARK_BG }}>
            הצטרף עכשיו — בחינם
          </span>
          <span style={{ fontSize: 22 }}>←</span>
        </div>

        {/* Benefits header */}
        <div
          style={{
            fontFamily: "'DM Sans', 'Heebo', sans-serif",
            fontSize: 19,
            fontWeight: 600,
            color: LIGHT_TEXT,
            marginBottom: 12
          }}
        >
          מה מקבלים?
        </div>

        {/* Benefits grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1 }}>
          {benefits.map((b, i) => (
            <div
              key={i}
              style={{
                width: 'calc(50% - 5px)',
                backgroundColor: DARK_CARD,
                borderRadius: 13,
                padding: '16px 16px',
                border: '1px solid rgba(255,209,102,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 11
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${GOLD}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <b.Icon size={19} color={GOLD} strokeWidth={1.8} />
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif",
                  fontSize: 17,
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
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', paddingTop: 14, paddingBottom: 6 }}>
          {[
            { Icon: Lock, text: 'מאובטח' },
            { Icon: Zap, text: 'הקמה ב-5 דקות' },
            { Icon: Heart, text: 'בשימוש עשרות אולפנים' }
          ].map((badge, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <badge.Icon size={14} color={SUBTLE_TEXT} strokeWidth={2} />
              <span style={{ fontFamily: "'IBM Plex Sans', 'Heebo', sans-serif", fontSize: 13, color: SUBTLE_TEXT }}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer — consistent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
          <Img src={staticFile('logo.png')} style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontFamily: "'DM Sans', 'Heebo', sans-serif", fontSize: 14, color: SUBTLE_TEXT }}>
            studioz.co.il
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
