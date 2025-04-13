export interface Market {
  id: number;
  code: string;
  icon: string;
  name: string;
}

export interface ProductHistory {
  market: Market;
  item_id: number;
  name: string;
  url: string;
  price: number;
  rating: number;
  review_count: number;
  buy_count: number;
  picture: string;
  id: number;
  created_at: Date;
  updated_at: string | null;
}
