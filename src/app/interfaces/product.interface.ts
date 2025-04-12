export interface MonitoredProduct {
  name: string;
  url: string;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface MonitoredProductCreate {
  name: string;
  url?: string;
}

export interface ProductHistory {
  market: number;
  item_id: number;
  name: string;
  url: string;
  price: number;
  rating: number;
  review_count: number;
  buy_count: number;
  picture: string;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductHistoryParams {
  start_time?: string | null;
  end_time?: string | null;
  skip?: number;
  limit?: number;
} 