export interface UiProduct {
  id: string;
  name: string;
  description?: string;
  price: number; // stored in smallest currency unit (like paise for INR)
  image: string;
  stock: number;
}
