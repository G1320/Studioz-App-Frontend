import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleIcon,
  ErrorIcon,
  StorageIcon,
  CreditCardIcon,
  AlertTriangleIcon,
} from '@shared/components/icons';
import '../styles/_status-page.scss';

const API_BASE =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://api.studioz.co.il/api'
    : 'http://localhost:3003/api';

const REFRESH_INTERVAL = 60_000; // 60 seconds

type ServiceStatus = 'operational' | 'degraded' | 'down';
type OverallStatus = 'operational' | 'degraded' | 'major_outage';

interface StatusData {
  overall: OverallStatus;
  services: {
    server: {
      status: ServiceStatus;
      uptimeSeconds?: number;
      memoryUsage?: { heapUsedMB: number; heapTotalMB: number; rssMB: number };
      latencyMs?: number;
    };
    database: {
      status: ServiceStatus;
    };
    payments: {
      status: ServiceStatus;
      uptimePercent: number;
      avgLatencyMs: number;
      totalTests24h: number;
      passedTests24h: number;
      lastCheck: string | null;
      lastTestFailed: boolean;
    };
  };
  timestamp: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
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

interface ServiceCardProps {
  name: string;
  status: ServiceStatus;
  statusLabel: string;
  children?: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, status, statusLabel, children }) => (
  <motion.div whileHover={{ y: -4 }} className="status-card">
    <div className="status-card__header">
      <h3 className="status-card__name">{name}</h3>
      <div className="status-card__status">
        <StatusDot status={status} />
        <span className={`status-card__label status-card__label--${status}`}>{statusLabel}</span>
      </div>
    </div>
    {children && <div className="status-card__details">{children}</div>}
  </motion.div>
);

const StatusPage: React.FC = () => {
  const { t } = useTranslation('status');
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StatusData = await res.json();
      setData(json);
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

  // Tick "last updated" counter
  useEffect(() => {
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const overallClass = data
    ? data.overall === 'operational'
      ? 'status-banner--operational'
      : data.overall === 'degraded'
        ? 'status-banner--degraded'
        : 'status-banner--outage'
    : '';

  return (
    <div className="status-page">
      {/* Hero */}
      <section className="status-hero">
        <div className="status-hero__background">
          <div className="status-hero__glow status-hero__glow--primary" />
          <div className="status-hero__glow status-hero__glow--secondary" />
        </div>
        <div className="status-hero__content">
          <motion.h1 {...fadeInUp} transition={{ delay: 0.1 }} className="status-hero__title">
            {t('hero.title.line1')} <br />
            <span className="status-hero__title--highlight">{t('hero.title.line2')}</span>
          </motion.h1>
          <motion.p {...fadeInUp} transition={{ delay: 0.2 }} className="status-hero__subtitle">
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      <main className="status-main">
        {/* Loading */}
        {!data && !error && (
          <p className="status-loading">{t('loading')}</p>
        )}

        {/* Error */}
        {error && (
          <div className="status-error">
            <ErrorIcon />
            <p>{t('error')}</p>
          </div>
        )}

        {data && (
          <>
            {/* Overall banner */}
            <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className={`status-banner ${overallClass}`}>
              {data.overall === 'operational' ? (
                <CheckCircleIcon className="status-banner__icon" />
              ) : data.overall === 'degraded' ? (
                <AlertTriangleIcon className="status-banner__icon" />
              ) : (
                <ErrorIcon className="status-banner__icon" />
              )}
              <span className="status-banner__text">{t(`overall.${data.overall}`)}</span>
            </motion.div>

            {/* Incident banner */}
            {data.services.payments.lastTestFailed && (
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="status-incident">
                <AlertTriangleIcon className="status-incident__icon" />
                <div>
                  <strong>{t('incident.title')}</strong>
                  <p>{t('incident.paymentFailure')}</p>
                </div>
              </motion.div>
            )}

            {/* Last updated */}
            <p className="status-updated">{t('lastUpdated', { seconds: secondsAgo })}</p>

            {/* Service cards */}
            <div className="status-cards-grid">
              <ServiceCard
                name={t('services.server.name')}
                status={data.services.server.status}
                statusLabel={t(`status.${data.services.server.status}`)}
              >
                {data.services.server.uptimeSeconds != null && (
                  <div className="status-card__metric">
                    <span className="status-card__metric-label">{t('services.server.uptime')}</span>
                    <span className="status-card__metric-value">{formatUptime(data.services.server.uptimeSeconds)}</span>
                  </div>
                )}
                {data.services.server.memoryUsage && (
                  <div className="status-card__metric">
                    <span className="status-card__metric-label">{t('services.server.memory')}</span>
                    <span className="status-card__metric-value">
                      {data.services.server.memoryUsage.heapUsedMB} / {data.services.server.memoryUsage.heapTotalMB} {t('units.mb')}
                    </span>
                  </div>
                )}
                {data.services.server.latencyMs != null && (
                  <div className="status-card__metric">
                    <span className="status-card__metric-label">{t('services.server.latency')}</span>
                    <span className="status-card__metric-value">{data.services.server.latencyMs}{t('units.ms')}</span>
                  </div>
                )}
              </ServiceCard>

              <ServiceCard
                name={t('services.database.name')}
                status={data.services.database.status}
                statusLabel={t(`status.${data.services.database.status}`)}
              >
                <div className="status-card__icon-row">
                  <StorageIcon className="status-card__service-icon" />
                </div>
              </ServiceCard>

              <ServiceCard
                name={t('services.payments.name')}
                status={data.services.payments.status}
                statusLabel={t(`status.${data.services.payments.status}`)}
              >
                <div className="status-card__icon-row">
                  <CreditCardIcon className="status-card__service-icon" />
                </div>
                <div className="status-card__metric">
                  <span className="status-card__metric-label">{t('services.payments.uptime24h')}</span>
                  <span className="status-card__metric-value">{data.services.payments.uptimePercent}%</span>
                </div>
                <div className="status-card__metric">
                  <span className="status-card__metric-label">{t('services.payments.avgLatency')}</span>
                  <span className="status-card__metric-value">{data.services.payments.avgLatencyMs}{t('units.ms')}</span>
                </div>
                <div className="status-card__metric">
                  <span className="status-card__metric-label">{t('services.payments.totalTests')}</span>
                  <span className="status-card__metric-value">
                    {data.services.payments.passedTests24h}/{data.services.payments.totalTests24h}
                  </span>
                </div>
                {data.services.payments.lastCheck && (
                  <div className="status-card__metric">
                    <span className="status-card__metric-label">{t('services.payments.lastCheck')}</span>
                    <span className="status-card__metric-value">{timeAgo(data.services.payments.lastCheck)}</span>
                  </div>
                )}
              </ServiceCard>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StatusPage;
