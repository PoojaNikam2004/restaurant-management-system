export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
  imageUrl?: string;
  isOffer?: boolean;
}