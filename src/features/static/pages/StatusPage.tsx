import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ErrorIcon, AlertTriangleIcon } from '@shared/components/icons';
import '../styles/_status-page.scss';

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === 'production' ? 'https://api.studioz.co.il/api' : 'http://localhost:3003/api';

const REFRESH_INTERVAL = 60_000;

interface DailyAggregate {
  date: string;
  total: number;
  passed: number;
  failed: number;
  avgLatencyMs: number;
}

interface RecentCheck {
  timestamp: string;
  status: 'pass' | 'charge_failed';
  latencyMs: number;
}

interface StatusData {
  overall: 'operational' | 'degraded' | 'major_outage';
  services: {
    server: { status: string; uptimeSeconds: number; memoryMb: number };
    database: { status: string; latencyMs: number | null };
    payments: {
      status: string;
      uptimePercent: number | null;
      latestCheck: { timestamp: string; status: string; latencyMs: number } | null;
    };
  };
  paymentHistory: {
    daily: DailyAggregate[];
    recent: RecentCheck[];
  };
  timestamp: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fillDailyGaps(daily: DailyAggregate[], days: number): (DailyAggregate | null)[] {
  const map = new Map(daily.map((d) => [d.date, d]));
  const result: (DailyAggregate | null)[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    result.push(map.get(key) ?? null);
  }
  return result;
}

const StatusDot: React.FC<{ status: string }> = ({ status }) => (
  <span className={`status-dot status-dot--${status}`} />
);

const UptimeBars: React.FC<{
  daily: (DailyAggregate | null)[];
  t: (key: string, opts?: Record<string, unknown>) => string;
}> = ({ daily, t }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="uptime-bars">
      <div className="uptime-bars__row">
        {daily.map((day, i) => {
          const status = !day ? 'none' : day.failed > 0 ? 'failed' : 'passed';
          return (
            <div
              key={i}
              className={`uptime-bars__bar uptime-bars__bar--${status}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hoveredIdx === i && day && (
                <div className="uptime-bars__tooltip">
                  <span className="uptime-bars__tooltip-date">{day.date}</span>
                  <span className="uptime-bars__tooltip-stat uptime-bars__tooltip-stat--pass">
                    {t('bars.passed')}: {day.passed}
                  </span>
                  {day.failed > 0 && (
                    <span className="uptime-bars__tooltip-stat uptime-bars__tooltip-stat--fail">
                      {t('bars.failed')}: {day.failed}
                    </span>
                  )}
                </div>
              )}
              {hoveredIdx === i && !day && (
                <div className="uptime-bars__tooltip">
                  <span className="uptime-bars__tooltip-date">
                    {(() => {
                      const d = new Date();
                      d.setDate(d.getDate() - (daily.length - 1 - i));
                      return d.toISOString().slice(0, 10);
                    })()}
                  </span>
                  <span className="uptime-bars__tooltip-stat">{t('bars.noData')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="uptime-bars__labels">
        <span>{t('bars.daysAgo', { count: daily.length })}</span>
        <span>{t('bars.today')}</span>
      </div>
    </div>
  );
};

const LatencyBars: React.FC<{
  recent: RecentCheck[];
  t: (key: string, opts?: Record<string, unknown>) => string;
}> = ({ recent, t }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxLatency = useMemo(() => Math.max(...recent.map((r) => r.latencyMs), 1), [recent]);
  const avgLatency = useMemo(
    () => (recent.length > 0 ? Math.round(recent.reduce((s, r) => s + r.latencyMs, 0) / recent.length) : 0),
    [recent]
  );

  const reversed = useMemo(() => [...recent].reverse(), [recent]);

  return (
    <div className="latency-bars">
      <div className="latency-bars__header">
        <span className="latency-bars__title">{t('latency.title')}</span>
        <span className="latency-bars__avg">
          {t('latency.avg')}: {avgLatency} ms
        </span>
      </div>
      <div className="latency-bars__row">
        {reversed.map((check, i) => {
          const heightPercent = Math.max((check.latencyMs / maxLatency) * 100, 4);
          const isSlow = check.latencyMs > maxLatency * 0.75;
          return (
            <div
              key={i}
              className="latency-bars__bar-wrapper"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div
                className={`latency-bars__bar ${isSlow ? 'latency-bars__bar--slow' : ''}`}
                style={{ height: `${heightPercent}%` }}
              />
              {hoveredIdx === i && (
                <div className="latency-bars__tooltip">
                  <span>{check.latencyMs} ms</span>
                  <span className="latency-bars__tooltip-time">
                    {new Date(check.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="latency-bars__label">{t('latency.last24')}</div>
    </div>
  );
};

const StatusPage: React.FC = () => {
  const { t } = useTranslation('status');
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(false);
      setLastFetched(new Date());
      setSecondsAgo(0);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (lastFetched) {
        setSecondsAgo(Math.floor((Date.now() - lastFetched.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lastFetched]);

  const dailyBars = useMemo(() => (data ? fillDailyGaps(data.paymentHistory.daily, 90) : []), [data]);

  const overallIcon =
    data?.overall === 'operational' ? (
      <CheckCircleIcon className="status-hero__icon status-hero__icon--operational" />
    ) : data?.overall === 'degraded' ? (
      <AlertTriangleIcon className="status-hero__icon status-hero__icon--degraded" />
    ) : (
      <ErrorIcon className="status-hero__icon status-hero__icon--down" />
    );

  const overallLabel = data
    ? data.overall === 'operational'
      ? t('hero.allOperational')
      : data.overall === 'degraded'
        ? t('hero.degraded')
        : t('hero.majorOutage')
    : '';

  const statusLabel = (s: string) =>
    s === 'operational' ? t('status.operational') : s === 'degraded' ? t('status.degraded') : t('status.down');

  const hasIncident = data?.services.payments.latestCheck?.status === 'charge_failed';

  return (
    <div className="status-page">
      <section className="status-hero">
        <div className="status-hero__background">
          <div className="status-hero__glow status-hero__glow--primary" />
        </div>
        <div className="status-hero__content">
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="status-hero__title">
            {t('hero.title')}
          </motion.h1>
          {data && (
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className={`status-hero__badge status-hero__badge--${data.overall}`}
            >
              {overallIcon}
              <span>{overallLabel}</span>
            </motion.div>
          )}
          {!data && !error && (
            <div className="status-hero__loading">
              <div className="status-hero__spinner" />
            </div>
          )}
          {error && !data && (
            <div className="status-hero__badge status-hero__badge--major_outage">
              <ErrorIcon className="status-hero__icon status-hero__icon--down" />
              <span>{t('hero.majorOutage')}</span>
            </div>
          )}
        </div>
      </section>

      <main className="status-main">
        {hasIncident && data && (
          <motion.div {...fadeInUp} transition={{ delay: 0.25 }} className="status-incident">
            <ErrorIcon className="status-incident__icon" />
            <div className="status-incident__content">
              <h3 className="status-incident__title">{t('incident.title')}</h3>
              <p className="status-incident__detail">
                {t('incident.paymentFailure')} {t('incident.at')}{' '}
                {new Date(data.services.payments.latestCheck!.timestamp).toLocaleString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </motion.div>
        )}

        {data && (
          <>
            {/* Server */}
            <motion.section {...fadeInUp} transition={{ delay: 0.3 }} className="status-service">
              <div className="status-service__header">
                <div className="status-service__name">
                  <StatusDot status={data.services.server.status} />
                  <h2>{t('services.server.name')}</h2>
                </div>
                <div className="status-service__meta">
                  <span className="status-service__metric">{formatUptime(data.services.server.uptimeSeconds)}</span>
                  <span className={`status-service__label status-service__label--${data.services.server.status}`}>
                    {statusLabel(data.services.server.status)}
                  </span>
                </div>
              </div>
              <div className="uptime-bars uptime-bars--flat">
                <div className="uptime-bars__row">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div key={i} className="uptime-bars__bar uptime-bars__bar--passed" />
                  ))}
                </div>
                <div className="uptime-bars__labels">
                  <span>{t('bars.daysAgo', { count: 90 })}</span>
                  <span>{t('bars.today')}</span>
                </div>
              </div>
            </motion.section>

            {/* Database */}
            <motion.section {...fadeInUp} transition={{ delay: 0.35 }} className="status-service">
              <div className="status-service__header">
                <div className="status-service__name">
                  <StatusDot status={data.services.database.status} />
                  <h2>{t('services.database.name')}</h2>
                </div>
                <div className="status-service__meta">
                  {data.services.database.latencyMs != null && (
                    <span className="status-service__metric">{data.services.database.latencyMs} ms</span>
                  )}
                  <span className={`status-service__label status-service__label--${data.services.database.status}`}>
                    {statusLabel(data.services.database.status)}
                  </span>
                </div>
              </div>
              <div className="uptime-bars uptime-bars--flat">
                <div className="uptime-bars__row">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div key={i} className="uptime-bars__bar uptime-bars__bar--passed" />
                  ))}
                </div>
                <div className="uptime-bars__labels">
                  <span>{t('bars.daysAgo', { count: 90 })}</span>
                  <span>{t('bars.today')}</span>
                </div>
              </div>
            </motion.section>

            {/* Payments */}
            <motion.section {...fadeInUp} transition={{ delay: 0.4 }} className="status-service">
              <div className="status-service__header">
                <div className="status-service__name">
                  <StatusDot status={data.services.payments.status} />
                  <h2>{t('services.payments.name')}</h2>
                </div>
                <div className="status-service__meta">
                  {data.services.payments.uptimePercent != null && (
                    <span className="status-service__metric">{data.services.payments.uptimePercent}%</span>
                  )}
                  <span className={`status-service__label status-service__label--${data.services.payments.status}`}>
                    {statusLabel(data.services.payments.status)}
                  </span>
                </div>
              </div>
              <UptimeBars daily={dailyBars} t={t} />
              {data.services.payments.uptimePercent != null && (
                <div className="status-service__uptime-label">
                  {t('services.payments.uptime90d')}: {data.services.payments.uptimePercent}%
                </div>
              )}
              {data.paymentHistory.recent.length > 0 && <LatencyBars recent={data.paymentHistory.recent} t={t} />}
            </motion.section>
          </>
        )}
      </main>

      <footer className="status-footer">
        <div className="status-footer__content">
          {lastFetched && (
            <span className="status-footer__updated">
              {t('footer.lastUpdated')} {t('footer.secondsAgo', { count: secondsAgo })}
            </span>
          )}
          <span className="status-footer__auto">{t('footer.autoRefresh')}</span>
        </div>
      </footer>
    </div>
  );
};

export default StatusPage;
