export type RemoteProjectStatus =
  | 'requested'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'declined';

export type RemoteProjectPaymentStatus =
  | 'pending'
  | 'card_saved'
  | 'deposit_paid'
  | 'fully_paid'
  | 'refunded';

export interface RemoteProject {
  _id: string;

  // References
  itemId: string | {
    _id: string;
    name?: { en: string; he?: string };
    imgUrl?: string;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    maxFilesPerProject?: number;
  };
  studioId: string | {
    _id: string;
    name?: { en: string; he?: string };
    imgUrl?: string;
  };
  customerId: string | {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  vendorId: string | {
    _id: string;
    name?: string;
    email?: string;
  };
  collaborators?: ProjectCollaborator[];

  // Project Details
  title: string;
  brief: string;
  referenceLinks?: string[];

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

  createdAt?: string;
  updatedAt?: string;
}

export type ProjectSide = 'customer' | 'vendor';

export type ProjectCollaboratorStatus = 'active' | 'removed';

export interface ProjectCollaborator {
  userId:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        imgUrl?: string;
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

export interface ProjectInvite {
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
  canInvite: boolean;
  canPay: boolean;
  canCustomerWorkflow: boolean;
  canVendorWorkflow: boolean;
  canUpdateMetadata: boolean;
  canChat: boolean;
  canFiles: boolean;
}

export type SenderRole =
  | 'customer'
  | 'vendor'
  | 'customer_collaborator'
  | 'vendor_collaborator';

export interface MessageFileCue {
  _id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface ProjectMessage {
  _id: string;
  projectId: string;
  senderId: string | { _id: string; name?: string; imgUrl?: string };
  senderRole: SenderRole;

  message: string;
  attachmentIds?: (string | ProjectFile)[];

  fileId?: string | MessageFileCue;
  offsetSeconds?: number;

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
