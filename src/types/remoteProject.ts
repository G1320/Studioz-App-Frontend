export type RemoteProjectStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'declined';

export type RemoteProjectPaymentStatus = 'pending' | 'card_saved' | 'deposit_paid' | 'fully_paid' | 'refunded';

export interface ProjectDownloadLock {
  enabled: boolean;
  releasedAt?: string;
  releasedBy?: string | { _id: string; name?: string };
}

export interface RemoteProject {
  _id: string;

  // References
  itemId:
    | string
    | {
        _id: string;
        name?: { en: string; he?: string };
        imgUrl?: string;
        acceptedFileTypes?: string[];
        maxFileSize?: number;
        maxFilesPerProject?: number;
      };
  studioId:
    | string
    | {
        _id: string;
        name?: { en: string; he?: string };
        imgUrl?: string;
      };
  customerId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
      };
  vendorId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };
  collaborators?: ProjectCollaborator[];

  // Project Details
  title: string;
  brief: string;
  referenceLinks?: string[];
  artworkUrl?: string;

  // Item snapshot
  itemName?: { en: string; he?: string };
  studioName?: { en: string; he?: string };

  // Pricing
  price: number;
  depositAmount?: number;
  depositPaid: boolean;
  finalPaid: boolean;

  // Timeline
  estimatedDeliveryDays: number;
  deadline?: string;
  acceptedAt?: string;
  deliveredAt?: string;
  completedAt?: string;

  // Revisions
  revisionsIncluded: number;
  revisionsUsed: number;
  revisionPrice?: number;

  // Status
  status: RemoteProjectStatus;

  // Payment
  paymentStatus?: RemoteProjectPaymentStatus;

  // Deliverable download lock (vendor-controlled)
  downloadLock?: ProjectDownloadLock;

  // Customer Info
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectFileType = 'source' | 'deliverable' | 'revision';

export interface ProjectFile {
  _id: string;
  projectId: string;
  uploadedBy: string | { _id: string; name?: string };
  type: ProjectFileType;

  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;

  description?: string;
  revisionNumber?: number;

  waveformStatus?: WaveformStatus;

  createdAt?: string;
  updatedAt?: string;
}

export type WaveformStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'unsupported';

export interface WaveformResponse {
  fileId: string;
  status: WaveformStatus;
  /** Normalized 0–255 peaks, present when status === 'ready'. */
  peaks?: number[];
  durationMs?: number | null;
  sampleRate?: number | null;
  channels?: number | null;
  version?: number;
  reason?: string;
}

export type ProjectSide = 'customer' | 'vendor';

export type ProjectCapability = 'listen' | 'comment' | 'download' | 'upload' | 'edit';
export type ProjectRole = 'listener' | 'reviewer' | 'listener_download' | 'contributor' | 'editor';
/** `custom` = individually toggled capabilities; `owner` = primary customer/vendor. */
export type ProjectRoleOrCustom = ProjectRole | 'custom';

export interface ProjectGrant {
  role: ProjectRoleOrCustom;
  capabilities: ProjectCapability[];
  /** Empty = whole project. */
  fileIds: string[];
}

export interface ProjectGrantRequest {
  role?: ProjectRole;
  capabilities?: ProjectCapability[];
  /** Omitted or `null` = whole project. */
  fileIds?: string[] | null;
}

export type ProjectCollaboratorStatus = 'active' | 'removed';

export interface ProjectCollaborator extends Partial<ProjectGrant> {
  expiresAt?: string | null;
  shareLinkId?: string | null;
  userId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        imgUrl?: string;
        picture?: string;
        avatar?: string;
      };
  side: ProjectSide;
  invitedBy:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
      };
  joinedAt?: string;
  status: ProjectCollaboratorStatus;
}

export type ProjectInviteStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface ProjectInvite extends Partial<ProjectGrant> {
  _id: string;
  projectId?: string | { _id: string; title?: string; status?: string; studioName?: { en?: string; he?: string } };
  email: string;
  side: ProjectSide;
  invitedBy?: string | { _id: string; name?: string; email?: string };
  status: ProjectInviteStatus;
  expiresAt?: string;
  createdAt?: string;
}

export interface ProjectAccess {
  side: ProjectSide;
  isPrimary: boolean;
  isCollaborator: boolean;
  senderRole: SenderRole;
  role?: ProjectRoleOrCustom | 'owner';
  capabilities?: ProjectCapability[];
  /** Set when the user only sees specific files. */
  fileScope?: string[] | null;
  canDownload?: boolean;
  canUpload?: boolean;
  canEdit?: boolean;
  canInvite: boolean;
  canPay: boolean;
  canCustomerWorkflow: boolean;
  canVendorWorkflow: boolean;
  canUpdateMetadata: boolean;
  canUpdateArtwork: boolean;
  canChat: boolean;
  canFiles: boolean;
  /** False for customer-side users while the vendor's deliverable lock is active. */
  canDownloadDeliverables?: boolean;
  canManageDownloadLock?: boolean;
}

export type SenderRole =
  | 'customer'
  | 'vendor'
  | 'customer_collaborator'
  | 'vendor_collaborator'
  | 'customer_guest'
  | 'vendor_guest';

export interface MessageFileCue {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface ProjectMessage {
  _id: string;
  projectId: string;
  /** Missing for guests who commented through a share link. */
  senderId?: string | { _id: string; name?: string; imgUrl?: string } | null;
  senderRole: SenderRole;
  guestName?: string;
  shareLinkId?: string;

  message: string;
  attachmentIds?: (string | ProjectFile)[];

  fileId?: string | MessageFileCue;
  offsetSeconds?: number;

  /** Parent comment when this is a threaded reply. */
  parentId?: string;
  /** Set when a track comment was marked resolved. */
  resolvedAt?: string;
  resolvedBy?: string | { _id: string; name?: string };

  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Request/Response types
export interface CreateProjectRequest {
  itemId: string;
  customerId: string;
  title: string;
  brief: string;
  referenceLinks?: string[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  singleUseToken?: string;
  useSavedCard?: boolean;
  sumitCustomerId?: string;
}

export interface ProjectsResponse {
  projects: RemoteProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProjectDetailResponse {
  project: RemoteProject;
  fileCounts: {
    source: number;
    deliverable: number;
    revision: number;
  };
  access?: ProjectAccess;
  /** Whether the vendor's deliverable lock is currently in force. */
  deliverablesLocked?: boolean;
}

export interface DownloadLockResponse {
  downloadLock: ProjectDownloadLock;
  deliverablesLocked: boolean;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  storageKey: string;
  fileId: string;
  expiresIn: number;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  expiresIn: number;
  /** True when this URL was issued as a restricted stream (downloads locked). */
  locked?: boolean;
  /** Streams always serve the original uploaded file. */
  quality?: 'original';
  intent?: 'download' | 'stream';
}

export interface AudioMetaResponse {
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  codec: string | null;
  sampleRate: number | null;
  bitDepth: number | null;
  channels: number | null;
  durationMs: number | null;
  container: string | null;
}

export interface MessagesResponse {
  messages: ProjectMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollaboratorsResponse {
  collaborators: ProjectCollaborator[];
  pendingInvites: ProjectInvite[];
}

export interface ProjectShareLink extends ProjectGrant {
  _id: string;
  token: string;
  side: ProjectSide;
  label: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  disabledAt: string | null;
  hasPassword: boolean;
  /** Join links only; 1 = single use. */
  maxJoins: number | null;
  status: ShareLinkStatus;
  viewCount: number;
  joinCount: number;
  lastAccessedAt: string | null;
  createdAt: string;
  requiresLogin: boolean;
}

export type ShareLinkStatus = 'active' | 'paused' | 'expired' | 'used' | 'revoked';

/** For settings, `null` clears the value (never expires / no password / unlimited joins). */
export interface ShareLinkSettingsRequest {
  label?: string | null;
  expiresAt?: string | null;
  password?: string | null;
  maxJoins?: number | null;
}

export interface CreateShareLinkRequest extends ProjectGrantRequest, ShareLinkSettingsRequest {}

export interface UpdateShareLinkRequest extends ProjectGrantRequest, ShareLinkSettingsRequest {
  active?: boolean;
}

export interface SharedProjectFile {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: ProjectFileType;
  revisionNumber?: number;
  createdAt?: string;
  /** The link allows downloading this file right now (download capability and not locked). */
  downloadable: boolean;
}

export type ProjectAccessRequestStatus = 'pending' | 'approved' | 'denied';

/** The requester's own view: no project details, only where their request stands. */
export interface MyProjectAccessRequest {
  _id: string;
  status: ProjectAccessRequestStatus;
  createdAt: string;
  decidedAt: string | null;
  canRequestAgainAt: string | null;
}

export interface MyAccessRequestResponse {
  hasAccess: boolean;
  request: MyProjectAccessRequest | null;
}

/** Owner's view of a pending request. */
export interface ProjectAccessRequestItem {
  _id: string;
  userId: string | { _id: string; name?: string; email?: string; picture?: string; avatar?: string };
  message: string | null;
  status: ProjectAccessRequestStatus;
  createdAt: string;
}

export interface SharedProjectLocked {
  passwordRequired: true;
  shareLink: { label: string | null };
}

export type SharedProjectResult = SharedProjectResponse | SharedProjectLocked;

export interface SharedProjectResponse {
  passwordRequired: false;
  shareLink: {
    role: ProjectRoleOrCustom;
    capabilities: ProjectCapability[];
    side: ProjectSide;
    label: string | null;
    expiresAt: string | null;
    requiresLogin: boolean;
    canDownload: boolean;
    canComment: boolean;
    /** Some files are held back by the deliverable download lock. */
    downloadsLocked: boolean;
  };
  project: {
    _id: string;
    title: string;
    status: RemoteProjectStatus;
    studioName?: { en?: string; he?: string };
    artworkUrl?: string;
  };
  files: SharedProjectFile[];
}
