import type { ScreenshotGeneratorConfig } from './src/config/types.js';
import { expandScenes, type ScreenshotScene } from './src/config/variants.js';

const scenes: ScreenshotScene[] = [
  {
    id: 'studio-details',
    order: 1,
    path: '/studio/studio-demo',
    readySelector: '.studio-details-page .studio-details__header',
    fixture: 'studio',
    auth: 'customer',
    device: 'iphone-6.9',
    template: 'full-bleed',
    textAlign: 'center',
    deviceTransform: { scale: 0.86, y: 560, shadow: true },
    copy: {
      'en-US': {
        title: 'Find the right studio',
        subtitle: 'Explore the space, services and sound before you book.'
      },
      he: {
        title: 'מוצאים את הסטודיו הנכון',
        subtitle: 'מכירים את החלל, השירותים והסאונד לפני שמזמינים.'
      }
    }
  },
  {
    id: 'studio-portfolio',
    order: 2,
    path: '/studio/studio-demo?view=portfolio',
    readySelector: '.studio-portfolio-view__grid',
    fixture: 'studio',
    auth: 'customer',
    device: 'iphone-6.9',
    template: 'feature',
    deviceTransform: { scale: 0.8, x: 90, y: 510, rotation: 1, shadow: true },
    copy: {
      'en-US': {
        title: 'Hear what the studio can do',
        subtitle: 'Explore selected tracks recorded, mixed and mastered at Tempo Studios.'
      },
      he: {
        title: 'שומעים מה הסטודיו יודע לעשות',
        subtitle: 'מגלים יצירות נבחרות שהוקלטו, מוקססו ומוסטרו באולפני טמפו.'
      }
    }
  },
  {
    id: 'dashboard-calendar',
    order: 3,
    path: '/dashboard?tab=overview',
    readySelector: '.dashboard-calendar',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'full-bleed',
    textAlign: 'center',
    deviceTransform: { scale: 0.82, y: 560, shadow: true },
    actions: [{ type: 'scroll', y: 72 }],
    copy: {
      'en-US': {
        title: 'Every booking, under control',
        subtitle: 'See your schedule and manage studio availability from anywhere.'
      },
      he: {
        title: 'כל ההזמנות בשליטה',
        subtitle: 'רואים את הלו״ז ומנהלים את זמינות הסטודיו מכל מקום.'
      }
    }
  },
  {
    id: 'desktop-calendar',
    order: 23,
    path: '/dashboard?tab=overview',
    readySelector: '.dashboard-calendar .studioz-calendar__month-view',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [
      // Taller day cells fill the frame; keep dashboard header/tabs in view.
      {
        type: 'style',
        css: `
          .studioz-calendar__day-cell { min-height: 8.25rem !important; }
          .studioz-calendar__content { min-height: calc(100vh - 8rem) !important; }
          .studioz-calendar__month-view { min-height: inherit !important; }
        `
      },
      { type: 'scroll', y: 72 }
    ],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Your studio week, at a glance',
        subtitle: 'Incoming sessions, conflicts and free slots — one dense schedule.'
      },
      he: {
        title: 'שבוע הסטודיו במבט אחד',
        subtitle: 'סשנים נכנסים, חפיפות וחלונות פנויים — ביומן צפוף וברור.'
      }
    }
  },
  {
    id: 'desktop-calendar-list',
    order: 24,
    path: '/dashboard?tab=overview',
    readySelector: '.dashboard-calendar',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [
      { type: 'click', selector: '.studioz-calendar__view-tabs .studioz-calendar__view-tab:nth-child(4)' },
      {
        type: 'style',
        css: `
          .studioz-calendar__list-view {
            padding: 0.85rem 1.15rem !important;
          }
          .studioz-calendar__list-events { gap: 0.45rem !important; }
          .studioz-calendar__list-event { padding: 0.65rem 0.85rem !important; }
        `
      },
      // Match month calendar framing.
      { type: 'scroll', y: 72 }
    ],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Today’s sessions, in order',
        subtitle: 'A dense agenda of confirmed and pending bookings for the day.'
      },
      he: {
        title: 'הסשנים של היום, לפי סדר',
        subtitle: 'אג׳נדה צפופה של הזמנות מאושרות וממתינות ליום.'
      }
    }
  },
  {
    id: 'mobile-calendar',
    order: 30,
    path: '/dashboard?tab=overview',
    readySelector: '.dashboard-calendar .studioz-calendar__month-view',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [
      {
        type: 'style',
        css: `
          .studioz-calendar__day-cell { min-height: 5.25rem !important; }
          .studioz-calendar__content { min-height: calc(100vh - 10rem) !important; }
          .studioz-calendar__month-view { min-height: inherit !important; }
        `
      },
      { type: 'scroll', y: 96 }
    ],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Schedule on the go',
        subtitle: 'The same dense calendar — bookings and free slots in your pocket.'
      },
      he: {
        title: 'היומן בדרך',
        subtitle: 'אותו יומן צפוף — הזמנות וחלונות פנויים מהנייד.'
      }
    }
  },
  {
    id: 'dashboard-activity',
    order: 4,
    path: '/dashboard?tab=activity',
    readySelector: '.recent-activity',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    deviceTransform: { scale: 0.8, y: 520, shadow: true },
    copy: {
      'en-US': {
        title: 'Never miss an update',
        subtitle: 'Bookings, payments and project activity stay together.'
      },
      he: {
        title: 'לא מפספסים אף עדכון',
        subtitle: 'הזמנות, תשלומים ופעילות בפרויקטים נשארים יחד.'
      }
    }
  },
  {
    id: 'dashboard-studios',
    order: 5,
    path: '/dashboard?tab=studios',
    readySelector: '.studio-manager',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    deviceTransform: { scale: 0.79, y: 520, rotation: -1, shadow: true },
    copy: {
      'en-US': {
        title: 'Your studio, fully managed',
        subtitle: 'Control spaces, services, pricing and availability in one place.'
      },
      he: {
        title: 'ניהול מלא של הסטודיו',
        subtitle: 'שולטים בחללים, בשירותים, במחירים ובזמינות במקום אחד.'
      }
    }
  },
  {
    id: 'dashboard-statistics',
    order: 6,
    path: '/stats',
    readySelector: '.merchant-stats',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', x: 0, y: 0 }],
    deviceTransform: { scale: 0.8, y: 500, shadow: true },
    copy: {
      'en-US': {
        title: 'Know what moves your business',
        subtitle: 'Revenue, bookings and performance become clear at a glance.'
      },
      he: {
        title: 'המספרים שמניעים את העסק',
        subtitle: 'הכנסות, הזמנות וביצועים ברורים במבט אחד.'
      }
    }
  },
  {
    id: 'dashboard-documents',
    order: 7,
    path: '/dashboard?tab=documents',
    readySelector: '.merchant-documents',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    deviceTransform: { scale: 0.8, y: 500, shadow: true },
    copy: {
      'en-US': {
        title: 'Business documents, organized',
        subtitle: 'Track invoices, receipts and payment status without the paperwork.'
      },
      he: {
        title: 'כל המסמכים מסודרים',
        subtitle: 'עוקבים אחרי חשבוניות, קבלות ותשלומים בלי להתעסק בניירת.'
      }
    }
  },
  {
    id: 'dashboard-billing',
    order: 8,
    path: '/dashboard?tab=billing',
    readySelector: '.billing',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    deviceTransform: { scale: 0.8, y: 500, shadow: true },
    copy: {
      'en-US': {
        title: 'Simple, transparent billing',
        subtitle: 'Understand every charge and keep your studio finances clear.'
      },
      he: {
        title: 'חיובים פשוטים ושקופים',
        subtitle: 'מבינים כל חיוב ושומרים על תמונה פיננסית ברורה.'
      }
    }
  },
  {
    id: 'desktop-studio-manager',
    order: 40,
    path: '/dashboard?tab=studios',
    readySelector: '.studio-manager',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', y: 80 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Spaces and services, managed',
        subtitle: 'Toggle availability, edit services and keep every room in view.'
      },
      he: {
        title: 'חללים ושירותים בניהול אחד',
        subtitle: 'מפעילים זמינות, עורכים שירותים ורואים כל חלל במבט אחד.'
      }
    }
  },
  {
    id: 'mobile-studio-manager',
    order: 41,
    path: '/dashboard?tab=studios',
    readySelector: '.studio-manager',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Manage on the go',
        subtitle: 'Studios, services and availability from your phone.'
      },
      he: {
        title: 'ניהול מהנייד',
        subtitle: 'סטודיואים, שירותים וזמינות מהטלפון.'
      }
    }
  },
  {
    id: 'desktop-stats',
    order: 42,
    path: '/stats',
    readySelector: '.merchant-stats',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', y: 40 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Performance at a glance',
        subtitle: 'Revenue, bookings and trends without leaving the dashboard.'
      },
      he: {
        title: 'ביצועים במבט אחד',
        subtitle: 'הכנסות, הזמנות ומגמות בלי לצאת מהלוח.'
      }
    }
  },
  {
    id: 'desktop-documents',
    order: 43,
    path: '/dashboard?tab=documents',
    readySelector: '.merchant-documents',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', y: 100 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Invoices in one place',
        subtitle: 'Filter, review and track payment status without the paperwork.'
      },
      he: {
        title: 'חשבוניות במקום אחד',
        subtitle: 'מסננים, בודקים ועוקבים אחרי סטטוס תשלום בלי ניירת.'
      }
    }
  },
  {
    id: 'mobile-documents',
    order: 44,
    path: '/dashboard?tab=documents',
    readySelector: '.merchant-documents',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Documents on mobile',
        subtitle: 'Invoices and payment status in your pocket.'
      },
      he: {
        title: 'מסמכים בנייד',
        subtitle: 'חשבוניות וסטטוס תשלום בכיס.'
      }
    }
  },
  {
    id: 'desktop-billing',
    order: 45,
    path: '/dashboard?tab=billing',
    readySelector: '.billing',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', y: 80 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Clear platform billing',
        subtitle: 'Current period, history and fees without the guesswork.'
      },
      he: {
        title: 'חיוב פלטפורמה ברור',
        subtitle: 'תקופה נוכחית, היסטוריה ועמלות בלי ניחושים.'
      }
    }
  },
  {
    id: 'mobile-billing',
    order: 46,
    path: '/dashboard?tab=billing',
    readySelector: '.billing',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Billing on the go',
        subtitle: 'Fees and history from your phone.'
      },
      he: {
        title: 'חיובים בנייד',
        subtitle: 'עמלות והיסטוריה מהטלפון.'
      }
    }
  },
  {
    id: 'projects-list',
    order: 9,
    path: '/projects',
    readySelector: '.projects-list__grid',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    deviceTransform: { scale: 0.78, x: 110, y: 500, rotation: 1.5, shadow: true },
    copy: {
      'en-US': {
        title: 'Projects stay on track',
        subtitle: 'Follow progress, payments and delivery in one secure workspace.'
      },
      he: {
        title: 'הפרויקטים נשארים במסלול',
        subtitle: 'עוקבים אחרי התקדמות, תשלומים ומסירה במרחב עבודה מאובטח.'
      }
    }
  },
  {
    id: 'projects-list-view',
    order: 10,
    path: '/projects',
    readySelector: '.projects-list__grid',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'click', selector: '.projects-list__view-toggle .view-mode-toggle__button:last-child' }],
    deviceTransform: { scale: 0.8, y: 520, shadow: true },
    copy: {
      'en-US': {
        title: 'Every project, easy to scan',
        subtitle: 'Switch to a focused list for deadlines, payments and progress.'
      },
      he: {
        title: 'כל הפרויקטים במבט אחד',
        subtitle: 'עוברים לרשימה ממוקדת של מועדים, תשלומים והתקדמות.'
      }
    }
  },
  {
    id: 'reservations-list-view',
    order: 11,
    path: '/reservations',
    readySelector: '.reservations-list__grid',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    actions: [{ type: 'click', selector: '.my-reservations-page__view-toggle .view-mode-toggle__button:first-child' }],
    deviceTransform: { scale: 0.79, x: 90, y: 510, rotation: -1, shadow: true },
    copy: {
      'en-US': {
        title: 'Reservations at a glance',
        subtitle: 'Review every booking in a clear, compact list.'
      },
      he: {
        title: 'כל ההזמנות במבט אחד',
        subtitle: 'סוקרים כל הזמנה ברשימה ברורה וקומפקטית.'
      }
    }
  },
  {
    id: 'project-workspace',
    order: 12,
    path: '/projects/project-demo',
    readySelector: '.project-detail',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'full-bleed',
    textAlign: 'center',
    deviceTransform: { scale: 0.82, y: 560, shadow: true },
    copy: {
      'en-US': {
        title: 'From brief to final delivery',
        subtitle: 'Files, feedback and revisions stay connected to the project.'
      },
      he: {
        title: 'מהבריף ועד למסירה',
        subtitle: 'קבצים, משוב ותיקונים נשארים מחוברים לפרויקט.'
      }
    }
  },
  {
    id: 'project-tracks',
    order: 13,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--source',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    actions: [{ type: 'scroll', selector: '.project-file-uploader--source' }],
    deviceTransform: { scale: 0.8, x: 90, y: 510, rotation: -1, shadow: true },
    copy: {
      'en-US': {
        title: 'Every track in one workspace',
        subtitle: 'Upload, review and play full-quality source files without switching tools.'
      },
      he: {
        title: 'כל הטראקים במרחב אחד',
        subtitle: 'מעלים, בודקים ומנגנים קובצי מקור איכותיים בלי לעבור בין כלים.'
      }
    }
  },
  {
    id: 'project-deliverables',
    order: 14,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--deliverable',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    actions: [{ type: 'scroll', selector: '.project-file-uploader--deliverable' }],
    deviceTransform: { scale: 0.8, y: 510, shadow: true },
    copy: {
      'en-US': {
        title: 'Deliverables, ready to review',
        subtitle: 'Share final-quality mixes and keep every version organized.'
      },
      he: {
        title: 'התוצרים מוכנים לבדיקה',
        subtitle: 'משתפים מיקסים באיכות מלאה ושומרים על כל גרסה מסודרת.'
      }
    }
  },
  {
    id: 'project-revisions',
    order: 15,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--revision',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'full-bleed',
    textAlign: 'center',
    actions: [{ type: 'scroll', selector: '.project-file-uploader--revision' }],
    deviceTransform: { scale: 0.82, y: 550, shadow: true },
    copy: {
      'en-US': {
        title: 'Revisions stay organized',
        subtitle: 'Keep each update connected to the project and its feedback.'
      },
      he: {
        title: 'כל התיקונים נשארים מסודרים',
        subtitle: 'שומרים כל עדכון מחובר לפרויקט ולמשוב שלו.'
      }
    }
  },
  {
    id: 'project-comments',
    order: 16,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--source',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    actions: [
      { type: 'scroll', selector: '.project-file-uploader--source' },
      { type: 'click', selector: '.project-file-uploader--source .remote-audio-player__thread-toggle' },
      { type: 'scroll', selector: '.project-file-uploader--source .track-thread', offsetY: -96 }
    ],
    deviceTransform: { scale: 0.78, x: 100, y: 500, rotation: 1, shadow: true },
    copy: {
      'en-US': {
        title: 'Feedback lands on the beat',
        subtitle: 'Leave time-coded comments and resolve every note in context.'
      },
      he: {
        title: 'המשוב נוחת בדיוק על הביט',
        subtitle: 'משאירים הערות מתוזמנות ופותרים כל נקודה בתוך ההקשר.'
      }
    }
  },
  {
    id: 'project-chat',
    order: 17,
    path: '/projects/project-demo',
    readySelector: '.project-chat',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    actions: [
      { type: 'click', selector: '.project-chat__collapsed-toggle' },
      { type: 'scroll', selector: '.project-chat', offsetY: -72 }
    ],
    deviceTransform: { scale: 0.8, x: 80, y: 500, rotation: -1, shadow: true },
    copy: {
      'en-US': {
        title: 'Conversation stays with the work',
        subtitle: 'Keep decisions, questions and updates inside the project.'
      },
      he: {
        title: 'השיחה נשארת עם העבודה',
        subtitle: 'שומרים החלטות, שאלות ועדכונים בתוך הפרויקט.'
      }
    }
  },
  {
    id: 'project-collaborators',
    order: 18,
    path: '/projects/project-demo',
    readySelector: '.project-collaborators',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'feature',
    actions: [{ type: 'scroll', selector: '.project-collaborators' }],
    deviceTransform: { scale: 0.8, x: 90, y: 500, rotation: 1, shadow: true },
    copy: {
      'en-US': {
        title: 'Bring the whole team in',
        subtitle: 'Invite collaborators and keep each side of the project aligned.'
      },
      he: {
        title: 'מצרפים את כל הצוות',
        subtitle: 'מזמינים שותפים ושומרים את כל הצדדים מתואמים.'
      }
    }
  },
  {
    id: 'stats-revenue-trend',
    order: 19,
    path: '/stats',
    readySelector: '.revenue-chart',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'full-bleed',
    textAlign: 'center',
    actions: [{ type: 'scroll', selector: '.revenue-chart' }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    copy: {
      'en-US': {
        title: 'Revenue trends, made clear',
        subtitle: 'See how your studio is growing across days, weeks and months.'
      },
      he: {
        title: 'מגמות ההכנסה ברורות',
        subtitle: 'רואים איך הסטודיו צומח לאורך ימים, שבועות וחודשים.'
      }
    }
  },
  {
    id: 'stats-studio-comparison',
    order: 20,
    path: '/stats',
    readySelector: '.merchant-stats',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'feature',
    actions: [
      { type: 'click', selector: '.view-tabs__tab:nth-child(2)' },
      { type: 'scroll', selector: '.studio-comparison-chart' }
    ],
    deviceTransform: { scale: 0.72, y: 100, rotation: -0.5, shadow: true },
    copy: {
      'en-US': {
        title: 'Compare every studio',
        subtitle: 'Understand revenue, bookings and occupancy across your spaces.'
      },
      he: {
        title: 'משווים בין כל האולפנים',
        subtitle: 'מבינים הכנסות, הזמנות ותפוסה בכל החללים.'
      }
    }
  },
  {
    id: 'stats-projections',
    order: 21,
    path: '/stats',
    readySelector: '.merchant-stats',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    actions: [
      { type: 'click', selector: '.view-tabs__tab:nth-child(4)' },
      { type: 'scroll', selector: '.projections-chart' }
    ],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    copy: {
      'en-US': {
        title: 'Plan with confidence',
        subtitle: 'Compare actual revenue with a clear forward projection.'
      },
      he: {
        title: 'מתכננים בביטחון',
        subtitle: 'משווים הכנסות בפועל עם תחזית ברורה קדימה.'
      }
    }
  },
  {
    id: 'stats-insights',
    order: 22,
    path: '/stats',
    readySelector: '.merchant-stats',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'feature',
    actions: [
      { type: 'click', selector: '.view-tabs__tab:nth-child(5)' },
      { type: 'scroll', selector: '.insights-heatmap' }
    ],
    deviceTransform: { scale: 0.72, y: 100, rotation: 0.5, shadow: true },
    copy: {
      'en-US': {
        title: 'Find peak hours',
        subtitle: 'Spot revenue patterns, popular hours and cancellation trends.'
      },
      he: {
        title: 'מגלים שעות שיא',
        subtitle: 'מזהים דפוסי הכנסה, שעות מבוקשות ומגמות ביטול.'
      }
    }
  },
  {
    id: 'desktop-project-workspace',
    order: 23,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--source',
    fixture: 'projects',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'full-bleed',
    textAlign: 'center',
    // Keep Actions + source files + chat in frame for every locale/theme.
    actions: [{ type: 'scroll', selector: '.project-file-uploader--source', offsetY: -88 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Production, all in one place',
        subtitle: 'Tracks, feedback, deliverables, payments and collaborators stay connected.'
      },
      he: {
        title: 'ההפקה במקום אחד',
        subtitle: 'טראקים, משוב, מסירות, תשלומים ושותפים נשארים מחוברים.'
      }
    }
  },
  {
    id: 'desktop-reservations',
    order: 24,
    path: '/reservations',
    readySelector: '.reservations-list__grid',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    actions: [{ type: 'click', selector: '.my-reservations-page__view-toggle .view-mode-toggle__button:first-child' }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Every booking, one clear view',
        subtitle: 'Search, filter and review every reservation from one clear view.'
      },
      he: {
        title: 'כל ההזמנות במסך אחד',
        subtitle: 'מחפשים, מסננים וסוקרים כל הזמנה ממסך ברור אחד.'
      }
    }
  },
  {
    id: 'desktop-projects',
    order: 36,
    path: '/projects',
    readySelector: '.projects-list__grid',
    fixture: 'projects',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'minimal',
    textAlign: 'center',
    // Match reservations: keep header + filters + first project row in frame.
    actions: [{ type: 'scroll', x: 0, y: 0 }],
    deviceTransform: { scale: 0.72, y: 100, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Every project, one clear view',
        subtitle: 'Scan deadlines, payments, collaborators and progress together.'
      },
      he: {
        title: 'כל הפרויקטים במסך אחד',
        subtitle: 'סורקים מועדים, תשלומים, שותפים והתקדמות יחד.'
      }
    }
  },
  {
    id: 'desktop-studio-portfolio',
    order: 25,
    path: '/studio/studio-demo?view=overview',
    readySelector: '.studio-details-page .studio-details__header',
    fixture: 'studio',
    auth: 'vendor',
    device: 'desktop-1440',
    template: 'feature',
    deviceTransform: { scale: 0.72, y: 100, rotation: -0.5, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Showcase your studio',
        subtitle: 'Present your rooms, equipment and services with clarity.'
      },
      he: {
        title: 'מציגים את הסטודיו',
        subtitle: 'מציגים חללים, ציוד ושירותים בצורה ברורה ומרשימה.'
      }
    }
  },
  {
    id: 'cross-device-project-review',
    order: 26,
    path: '/projects/project-demo',
    readySelector: '.project-collaborators',
    fixture: 'projects',
    auth: 'vendor',
    device: 'desktop-1440',
    secondaryDevice: 'iphone-6.9',
    template: 'dual',
    // Desktop: same Actions + source files scene as desktop-project-workspace.
    // Mobile: open a track thread so the dual still shows cross-device review.
    primaryActions: [{ type: 'scroll', selector: '.project-file-uploader--source', offsetY: -88 }],
    secondaryActions: [
      { type: 'scroll', selector: '.project-file-uploader--source' },
      { type: 'click', selector: '.project-file-uploader--source .remote-audio-player__thread-toggle' },
      { type: 'scroll', selector: '.project-file-uploader--source .track-thread' }
    ],
    deviceTransform: { scale: 0.66, x: -300, y: 130, rotation: -1, shadow: true },
    secondaryDeviceTransform: { scale: 0.37, x: 350, y: 170, rotation: 2, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Review from any screen',
        subtitle: 'Time-coded feedback stays in sync on desktop and mobile.'
      },
      he: {
        title: 'בודקים מכל מסך',
        subtitle: 'משוב מתוזמן נשאר מסונכרן במחשב ובנייד.'
      }
    }
  },
  {
    id: 'cross-device-analytics',
    order: 27,
    path: '/stats',
    readySelector: '.revenue-chart',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    secondaryDevice: 'iphone-6.9',
    template: 'dual',
    primaryActions: [{ type: 'scroll', selector: '.revenue-chart', offsetY: -24 }],
    deviceTransform: { scale: 0.66, x: -300, y: 130, rotation: -1, shadow: true },
    secondaryDeviceTransform: { scale: 0.37, x: 350, y: 170, rotation: 2, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Your business, anywhere',
        subtitle: 'Follow revenue and performance across desktop and mobile.'
      },
      he: {
        title: 'העסק בכל מקום',
        subtitle: 'עוקבים אחרי הכנסות וביצועים במחשב ובנייד.'
      }
    }
  },
  {
    id: 'cross-device-reservations',
    order: 28,
    path: '/reservations',
    readySelector: '.reservations-list__grid',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'desktop-1440',
    secondaryDevice: 'iphone-6.9',
    template: 'dual',
    actions: [{ type: 'click', selector: '.my-reservations-page__view-toggle .view-mode-toggle__button:first-child' }],
    deviceTransform: { scale: 0.66, x: -300, y: 130, rotation: -1, shadow: true },
    secondaryDeviceTransform: { scale: 0.37, x: 350, y: 170, rotation: 2, shadow: true },
    copy: {
      'en-US': {
        title: 'Manage bookings everywhere',
        subtitle: 'The same clear reservation workflow on every screen.'
      },
      he: {
        title: 'מנהלים הזמנות מכל מקום',
        subtitle: 'אותו תהליך הזמנה ברור בכל מסך.'
      }
    }
  },
  {
    id: 'cross-device-studio',
    order: 29,
    path: '/studio/studio-demo?view=portfolio',
    readySelector: '.studio-portfolio-view__grid',
    fixture: 'studio',
    auth: 'vendor',
    device: 'desktop-1440',
    secondaryDevice: 'iphone-6.9',
    template: 'dual',
    deviceTransform: { scale: 0.66, x: -300, y: 130, rotation: -1, shadow: true },
    secondaryDeviceTransform: { scale: 0.37, x: 350, y: 170, rotation: 2, shadow: true },
    copy: {
      'en-US': {
        title: 'A studio presence that travels',
        subtitle: 'Let clients explore your space and work on any device.'
      },
      he: {
        title: 'נוכחות לסטודיו בכל מסך',
        subtitle: 'לקוחות מגלים את החלל והעבודות שלכם בכל מכשיר.'
      }
    }
  },
  {
    id: 'mobile-reservations',
    order: 31,
    path: '/reservations',
    readySelector: '.reservations-list__grid',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    actions: [{ type: 'click', selector: '.my-reservations-page__view-toggle .view-mode-toggle__button:first-child' }],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Bookings on the go',
        subtitle: 'The same reservation workflow in your pocket.'
      },
      he: {
        title: 'הזמנות בדרך',
        subtitle: 'אותו תהליך הזמנות גם מהנייד.'
      }
    }
  },
  {
    id: 'mobile-projects',
    order: 37,
    path: '/projects',
    readySelector: '.projects-list__grid',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    textAlign: 'center',
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Projects on the go',
        subtitle: 'Deadlines, collaborators and progress in your pocket.'
      },
      he: {
        title: 'פרויקטים בדרך',
        subtitle: 'מועדים, שותפים והתקדמות מהנייד.'
      }
    }
  },
  {
    id: 'mobile-studio-portfolio',
    order: 32,
    path: '/studio/studio-demo?view=overview',
    readySelector: '.studio-details-page .studio-details__header',
    fixture: 'studio',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Your studio page, mobile',
        subtitle: 'A polished presence clients can browse anywhere.'
      },
      he: {
        title: 'עמוד האולפן בנייד',
        subtitle: 'נוכחות מקצועית שהלקוחות גולשים בה מכל מקום.'
      }
    }
  },
  {
    id: 'mobile-project-workspace',
    order: 33,
    path: '/projects/project-demo',
    readySelector: '.project-file-uploader--source',
    fixture: 'projects',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    actions: [{ type: 'scroll', selector: '.project-file-uploader--source', offsetY: -48 }],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Projects in your pocket',
        subtitle: 'Tracks, feedback and chat wherever you are.'
      },
      he: {
        title: 'פרויקטים בכיס',
        subtitle: 'טראקים, פידבק וצ׳אט מכל מקום.'
      }
    }
  },
  {
    id: 'mobile-studio-services',
    order: 34,
    path: '/studio/studio-demo?view=overview',
    readySelector: '.generic-carousel',
    fixture: 'studio',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    actions: [{ type: 'scroll', selector: '.generic-carousel', offsetY: -24 }],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Services that book',
        subtitle: 'Clear offers clients can browse and reserve.'
      },
      he: {
        title: 'שירותים שאפשר להזמין',
        subtitle: 'הצעות ברורות שלקוחות גולשים ומזמינים.'
      }
    }
  },
  {
    id: 'mobile-analytics-revenue',
    order: 35,
    path: '/stats',
    readySelector: '.revenue-chart',
    fixture: 'vendor-dashboard',
    auth: 'vendor',
    device: 'iphone-6.9',
    template: 'minimal',
    actions: [{ type: 'scroll', selector: '.revenue-chart', offsetY: -32 }],
    deviceTransform: { scale: 0.82, y: 520, shadow: true },
    capturePublish: {
      directory: 'public/images/features-generated',
      quality: 88
    },
    copy: {
      'en-US': {
        title: 'Revenue at a glance',
        subtitle: 'The trend that helps you decide next.'
      },
      he: {
        title: 'הכנסות במבט אחד',
        subtitle: 'המגמה שעוזרת להחליט מה הלאה.'
      }
    }
  },
  {
    id: 'landing-booking-flow',
    order: 30,
    path: '/studio/studio-demo?item=item-demo',
    readySelector: '.item-modal .date-picker-container',
    fixture: 'studio',
    auth: 'customer',
    device: 'desktop-1440',
    template: 'product',
    actions: [{ type: 'click', selector: '.item-modal .date-picker-container button' }],
    deviceTransform: { scale: 1.04, shadow: true },
    screenTreatment: {
      dark: { brightness: 1, contrast: 1, saturation: 1 },
      light: { brightness: 1, contrast: 1, saturation: 1 }
    },
    publish: {
      directory: 'public/images/landing-generated',
      dimensions: { width: 1320, height: 825 },
      quality: 90
    },
    copy: {
      'en-US': { title: 'Book studio time' },
      he: { title: 'הזמנת זמן באולפן' }
    }
  }
];

const expanded = expandScenes(scenes);

export const screenshotConfig = {
  version: 1,
  captures: expanded.captures,
  screenshots: expanded.screenshots
} satisfies ScreenshotGeneratorConfig;
