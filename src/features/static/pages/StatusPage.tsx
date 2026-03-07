import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleIcon,
  ErrorIcon,
  AlertTriangleIcon,
} from '@shared/components/icons';
import '../styles/_status-page.scss';

const API_BASE =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://api.studioz.co.il/api'
    : 'http://localhost:3003/api';

const REFRESH_INTERVAL = 60_000;

type ServiceStatus = 'operational' | 'degraded' | 'down';
type OverallStatus = 'operational' | 'degraded' | 'major_outage';

interface StatusData {
  overall: OverallStatus;
  services: {
    server: {
      status: ServiceStatus;
      uptimeSeconds?: number;
      latencyMs?: number;
    };
    database: { status: ServiceStatus };
    payments: {
      status: ServiceStatus;
      uptimePercent: number;
      avgLatencyMs: number;
      totalTests24h: number;
      passedTests24h: number;
      lastCheck: string | null;
    };
  };
  timestamp: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '< 1m ago';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

const StatusDot: React.FC<{ status: ServiceStatus }> = ({ status }) => (
  <span className={`status-dot status-dot--${status}`} />
);

const OverallIcon: React.FC<{ overall: OverallStatus }> = ({ overall }) => {
  if (overall === 'operational') return <CheckCircleIcon className="status-hero__overall-icon status-hero__overall-icon--ok" />;
  if (overall === 'degraded') return <AlertTriangleIcon className="status-hero__overall-icon status-hero__overall-icon--warn" />;
  return <ErrorIcon className="status-hero__overall-icon status-hero__overall-icon--bad" />;
};

const StatusPage: React.FC = () => {
  const { t } = useTranslation('status');
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(false);
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
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="status-page">
      {/* Hero — compact, with overall status integrated */}
      <section className="status-hero">
        <div className="status-hero__background">
          <div className="status-hero__glow status-hero__glow--primary" />
        </div>
        <div className="status-hero__content">
          {data && (
            <motion.div {...fadeIn} transition={{ delay: 0.05 }} className={`status-hero__badge status-hero__badge--${data.overall}`}>
              <OverallIcon overall={data.overall} />
              <span>{t(`overall.${data.overall}`)}</span>
            </motion.div>
          )}
          <motion.h1 {...fadeIn} transition={{ delay: 0.1 }} className="status-hero__title">
            {t('hero.title.line1')} <span className="status-hero__title--highlight">{t('hero.title.line2')}</span>
          </motion.h1>
          <motion.p {...fadeIn} transition={{ delay: 0.15 }} className="status-hero__subtitle">
            {t('hero.subtitle')}
          </motion.p>
          {data && (
            <motion.p {...fadeIn} transition={{ delay: 0.2 }} className="status-hero__updated">
              {t('lastUpdated', { seconds: secondsAgo })}
            </motion.p>
          )}
        </div>
      </section>

      <main className="status-main">
        {!data && !error && <p className="status-loading">{t('loading')}</p>}

        {error && (
          <div className="status-error">
            <ErrorIcon />
            <p>{t('error')}</p>
          </div>
        )}

        {data && (
          <>
            {/* Incident banner — only for actual outages */}
            {data.overall === 'major_outage' && (
              <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="status-incident">
                <AlertTriangleIcon className="status-incident__icon" />
                <div>
                  <strong>{t('incident.title')}</strong>
                  <p>{t('incident.paymentFailure')}</p>
                </div>
              </motion.div>
            )}

            {/* Service list */}
            <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="status-services">
              {/* Server */}
              <div className="status-service">
                <div className="status-service__left">
                  <StatusDot status={data.services.server.status} />
                  <span className="status-service__name">{t('services.server.name')}</span>
                </div>
                <div className="status-service__right">
                  {data.services.server.uptimeSeconds != null && (
                    <span className="status-service__meta">{formatUptime(data.services.server.uptimeSeconds)}</span>
                  )}
                  <span className={`status-service__label status-service__label--${data.services.server.status}`}>
                    {t(`status.${data.services.server.status}`)}
                  </span>
                </div>
              </div>

              {/* Database */}
              <div className="status-service">
                <div className="status-service__left">
                  <StatusDot status={data.services.database.status} />
                  <span className="status-service__name">{t('services.database.name')}</span>
                </div>
                <div className="status-service__right">
                  <span className={`status-service__label status-service__label--${data.services.database.status}`}>
                    {t(`status.${data.services.database.status}`)}
                  </span>
                </div>
              </div>

              {/* Payments */}
              <div className="status-service">
                <div className="status-service__left">
                  <StatusDot status={data.services.payments.status} />
                  <span className="status-service__name">{t('services.payments.name')}</span>
                </div>
                <div className="status-service__right">
                  {data.services.payments.totalTests24h > 0 && (
                    <span className="status-service__meta">{data.services.payments.uptimePercent}%</span>
                  )}
                  <span className={`status-service__label status-service__label--${data.services.payments.status}`}>
                    {t(`status.${data.services.payments.status}`)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Payment metrics — only shown when there's canary data */}
            {data.services.payments.totalTests24h > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="status-metrics">
                <h3 className="status-metrics__title">{t('services.payments.name')}</h3>
                <div className="status-metrics__grid">
                  <div className="status-metrics__item">
                    <span className="status-metrics__value">{data.services.payments.uptimePercent}%</span>
                    <span className="status-metrics__label">{t('services.payments.uptime24h')}</span>
                  </div>
                  <div className="status-metrics__item">
                    <span className="status-metrics__value">{data.services.payments.avgLatencyMs}{t('units.ms')}</span>
                    <span className="status-metrics__label">{t('services.payments.avgLatency')}</span>
                  </div>
                  <div className="status-metrics__item">
                    <span className="status-metrics__value">{data.services.payments.passedTests24h}/{data.services.payments.totalTests24h}</span>
                    <span className="status-metrics__label">{t('services.payments.totalTests')}</span>
                  </div>
                  {data.services.payments.lastCheck && (
                    <div className="status-metrics__item">
                      <span className="status-metrics__value">{timeAgo(data.services.payments.lastCheck)}</span>
                      <span className="status-metrics__label">{t('services.payments.lastCheck')}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StatusPage;
