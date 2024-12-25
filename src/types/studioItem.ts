export default interface StudioItem {
  idx: number;
  itemId: string;
  studioId: string;
  studioNameEn?: string;
  studioNameHe?: string;
  address?: string;
  lat?: number;
  lng?: number;
  sellerId?: string;
  studioImgUrl?: string;
}
