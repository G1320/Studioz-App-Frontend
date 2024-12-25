export default interface StudioItem {
  idx: number;
  itemId: string;
  studioId: string;
  name: {
    en: string;
    he: string;
  };
  address?: string;
  lat?: number;
  lng?: number;
  sellerId?: string;
  studioImgUrl?: string;
}
