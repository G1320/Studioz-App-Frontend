import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, User, ArrowLeft } from 'lucide-react';
import { useUserContext } from '@core/contexts';
import { useRemoteProjects } from '@shared/hooks';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import { RemoteProject, RemoteProjectStatus } from 'src/types/index';
import './styles/_projects-list-page.scss';

type FilterStatus = 'all' | RemoteProjectStatus;

// Demo projects for development/preview
const DEMO_PROJECTS: RemoteProject[] = [
  {
    _id: 'demo-1',
    title: 'Summer EP - Mix & Master',
    brief: 'Looking for a warm, analog sound for these 4 tracks. Similar vibe to Tame Impala but with more punchy drums.',
    itemId: 'item-1',
    studioId: 'studio-1',
    customerId: 'customer-1',
    vendorId: 'vendor-1',
    itemName: { en: 'Full Mix & Master', he: 'מיקס ומאסטרינג מלא' },
    studioName: { en: 'Pulse Studios', he: 'אולפני פאלס' },
    customerName: 'Daniel Cohen',
    price: 1200,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 5,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 3,
    revisionsUsed: 1,
    status: 'in_progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-2',
    title: 'Podcast Episode 12 - Post Production',
    brief: 'Need cleanup, EQ, and mastering for our weekly podcast episode.',
    itemId: 'item-2',
    studioId: 'studio-2',
    customerId: 'customer-2',
    vendorId: 'vendor-2',
    itemName: { en: 'Podcast Post-Production', he: 'עריכת פודקאסט' },
    studioName: { en: 'Magic Recordings', he: 'מג\'יק הקלטות' },
    customerName: 'Maya Levi',
    price: 350,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 2,
    revisionsIncluded: 2,
    revisionsUsed: 0,
    status: 'delivered',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-3',
    title: 'Vocal Tuning - Single Release',
    brief: 'Professional vocal tuning and alignment for upcoming single.',
    itemId: 'item-3',
    studioId: 'studio-3',
    customerId: 'customer-3',
    vendorId: 'vendor-3',
    itemName: { en: 'Pro Vocal Alignment', he: 'עריכת שירה מקצועית' },
    studioName: { en: 'Resonance Studio', he: 'אולפן רזוננס' },
    customerName: 'Amit Shapira',
    price: 450,
    depositPaid: false,
    finalPaid: false,
    estimatedDeliveryDays: 3,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 2,
    revisionsUsed: 0,
    status: 'requested',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-4',
    title: 'Album Mastering - 10 Tracks',
    brief: 'Final mastering for indie rock album, ready for streaming release.',
    itemId: 'item-4',
    studioId: 'studio-1',
    customerId: 'customer-4',
    vendorId: 'vendor-1',
    itemName: { en: 'Album Mastering', he: 'מאסטרינג אלבום' },
    studioName: { en: 'Pulse Studios', he: 'אולפני פאלס' },
    customerName: 'Yael Ben-David',
    price: 2500,
    depositPaid: true,
    finalPaid: true,
    estimatedDeliveryDays: 7,
    revisionsIncluded: 2,
    revisionsUsed: 2,
    status: 'completed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-5',
    title: 'Beat Production - Hip Hop Track',
    brief: 'Custom beat production with 808s and melodic elements.',
    itemId: 'item-5',
    studioId: 'studio-4',
    customerId: 'customer-5',
    vendorId: 'vendor-4',
    itemName: { en: 'Beat Production', he: 'הפקת ביט' },
    studioName: { en: 'Urban Sound Lab', he: 'אורבן סאונד לאב' },
    customerName: 'Omer Katz',
    price: 800,
    depositPaid: true,
    finalPaid: false,
    estimatedDeliveryDays: 4,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    revisionsIncluded: 3,
    revisionsUsed: 1,
    status: 'revision_requested',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const ProjectsListPage: React.FC = () => {
  const { t, i18n } = useTranslation('remoteProjects');
  const { user } = useUserContext();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemo, setShowDemo] = useState(true); // Toggle for demo mode

  const { projects: realProjects, isLoading, error } = useRemoteProjects({
    customerId: user?._id,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  // Use demo projects if enabled or if there's an error/no real projects
  const useDemoData = showDemo || error || (!isLoading && realProjects.length === 0);
  const projects = useDemoData ? DEMO_PROJECTS : realProjects;

  // Filter projects by status and search query
  const filteredProjects = projects.filter((project: RemoteProject) => {
    // Status filter
    if (statusFilter !== 'all' && project.status !== statusFilter) {
      return false;
    }
    // Search filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      getItemName(project).toLowerCase().includes(query) ||
      getStudioName(project).toLowerCase().includes(query) ||
      getCustomerName(project).toLowerCase().includes(query)
    );
  });

  const getItemName = (project: RemoteProject): string => {
    if (project.itemName?.en) return i18n.language === 'he' ? project.itemName.he || project.itemName.en : project.itemName.en;
    if (typeof project.itemId === 'object' && project.itemId.name) {
      return i18n.language === 'he' ? project.itemId.name.he || project.itemId.name.en : project.itemId.name.en;
    }
    return t('remoteService');
  };

  const getStudioName = (project: RemoteProject): string => {
    if (project.studioName?.en) return i18n.language === 'he' ? project.studioName.he || project.studioName.en : project.studioName.en;
    if (typeof project.studioId === 'object' && project.studioId.name) {
      return i18n.language === 'he' ? project.studioId.name.he || project.studioId.name.en : project.studioId.name.en;
    }
    return t('studio');
  };

  const getCustomerName = (project: RemoteProject): string => {
    // First check the direct customerName field
    if (project.customerName) return project.customerName;
    // Then check the populated customerId object
    if (typeof project.customerId === 'object' && project.customerId.name) {
      return project.customerId.name;
    }
    return t('customer');
  };

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: t('allStatuses') },
    { value: 'requested', label: t('status.requested') },
    { value: 'accepted', label: t('status.accepted') },
    { value: 'in_progress', label: t('status.inProgress') },
    { value: 'delivered', label: t('status.delivered') },
    { value: 'revision_requested', label: t('status.revisionRequested') },
    { value: 'completed', label: t('status.completed') },
    { value: 'cancelled', label: t('status.cancelled') },
    { value: 'declined', label: t('status.declined') },
  ];

  if (!user) {
    return (
      <div className="projects-list">
        <div className="projects-list__empty">
          <AlertCircle />
          <h3>{t('loginRequired')}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-list">
      {/* Header */}
      <header className="projects-list__header">
        <div className="projects-list__header-content">
          <h1 className="projects-list__title">{t('myProjects')}</h1>
          <p className="projects-list__subtitle">{t('subtitle')}</p>
        </div>
        <div className="projects-list__header-actions">
          {/* Demo Mode Toggle */}
          <button 
            className={`projects-list__demo-toggle ${showDemo ? 'projects-list__demo-toggle--active' : ''}`}
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? `🎭 ${t('demo.modeLabel')}` : `📊 ${t('demo.liveDataLabel')}`}
          </button>
          <button className="projects-list__new-button">
            <Plus />
            {t('newProject')}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="projects-list__filters">
        <div className="projects-list__search">
          <Search />
          <input
            type="text"
            className="projects-list__search-input"
            placeholder={t('searchProjects')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="projects-list__filter">
          <Filter />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Demo Banner */}
      {useDemoData && (
        <div className="projects-list__demo-banner">
          <span>🎭</span>
          <p>
            <strong>{t('demo.bannerTitle')}</strong> {t('demo.bannerDescription')}
          </p>
        </div>
      )}

      {/* Content */}
      {isLoading && !useDemoData ? (
        <div className="projects-list__loading">{t('common.loading')}</div>
      ) : filteredProjects.length === 0 ? (
        <div className="projects-list__empty">
          <AlertCircle />
          <h3>{t('noProjects')}</h3>
          <p>{t('noProjectsHint')}</p>
          <button className="projects-list__empty-cta">
            {t('exploreStudios')}
          </button>
        </div>
      ) : (
        <div className="projects-list__grid">
          {filteredProjects.map((project: RemoteProject, idx: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/${i18n.language}/projects/${project._id}`}
                className="projects-list__card"
              >
                {/* Card Content */}
                <div className="projects-list__card-content">
                  <div className="projects-list__card-header">
                    <h3 className="projects-list__card-title">{project.title}</h3>
                    <span className="projects-list__card-price">
                      ₪{project.price.toLocaleString()}
                    </span>
                  </div>

                  <ProjectStatusBadge status={project.status} />

                  <div className="projects-list__card-meta">
                    <div className="projects-list__card-customer">
                      <User />
                      <span>{getCustomerName(project)}</span>
                    </div>
                    <div className="projects-list__card-service">
                      <CheckCircle2 />
                      <span>{getItemName(project)} • {getStudioName(project)}</span>
                    </div>
                    {project.deadline && (
                      <div className="projects-list__card-deadline">
                        <Clock />
                        <span>{t('due')}: {new Date(project.deadline).toLocaleDateString(i18n.language)}</span>
                      </div>
                    )}
                  </div>

                  <div className="projects-list__card-footer">
                    <span>
                      {project.createdAt && `${t('createdAt')} ${new Date(project.createdAt).toLocaleDateString(i18n.language)}`}
                    </span>
                    <span className="projects-list__card-link">
                      {t('viewProject')} <ArrowLeft />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
