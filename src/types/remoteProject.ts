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

export type SenderRole = 'customer' | 'vendor';

export interface ProjectMessage {
  _id: string;
  projectId: string;
  senderId: string | { _id: string; name?: string; imgUrl?: string };
  senderRole: SenderRole;

  message: string;
  attachmentIds?: (string | ProjectFile)[];

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

export interface MessagesResponse {
  messages: ProjectMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
