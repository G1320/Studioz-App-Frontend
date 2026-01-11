import { Studio } from './';

export interface VendorCredentials {
  companyId: string;
  publicKey: string;
}

export default interface StudioResponse {
  currStudio: Studio;
  prevStudio: { _id: string } | null;
  nextStudio: { _id: string } | null;
  vendorCredentials?: VendorCredentials | null;
}
