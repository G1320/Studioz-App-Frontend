export default interface StudioItem {
  idx: number;
  itemId: string;
  studioId: string;
  studioName: string;
  address?: string;
  lat?: number;
  lng?: number;
  sellerId?: string;
  studioImgUrl?: string;
}
