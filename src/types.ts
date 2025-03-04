export interface Ticket {
  tier: string;
  price: number;
  description: string;
  features: string[];
  image: string;
}

export interface PassengerInfo {
  name: string;
  ticketId: string;
  mealPlan?: MealPlan;
  wifiPackage?: WifiPackage;
}

export interface CartItem {
  tier: string;
  quantity: number;
  passengers: PassengerInfo[];
}

export interface MealPlan {
  type: 'standard' | 'vegetarian' | 'premium';
  price: number;
}

export interface WifiPackage {
  speed: 'basic' | 'high-speed' | 'ultra';
  duration: '1-month' | '3-months' | '6-months';
  price: number;
}