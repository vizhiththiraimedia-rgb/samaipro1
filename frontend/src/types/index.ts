export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  isVerified: boolean;
  isActive: boolean;
  twoFactorEnabled: boolean;
  language: string;
  theme: "light" | "dark" | "system";
  createdAt: Date;
  updatedAt: Date;
}

export interface BirthDetails {
  id: string;
  userId: string;
  fullName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: Date;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  elevation: number;
  dst: number;
  utcOffset: number;
  ayanamsa: "lahiri" | "raman" | "krishnamurti" | "true_chitrapaksha" | "western_tropical" | "sidereal";
  chartSystem: "south_indian" | "north_indian" | "western_circular" | "kp";
  createdAt: Date;
  updatedAt: Date;
}

export interface Chart {
  id: string;
  birthDetailsId: string;
  chartType: "rasi" | "navamsa" | "dasamsa" | "bhava" | "kp" | "western" | "transit" | "progression" | "solar_return" | "lunar_return";
  planetaryPositions: Record<string, any>;
  houses: Record<number, any>;
  aspects: any[];
  yogas: any[];
  doshas: any[];
  shadbala: Record<string, any>;
  ashtakavarga: Record<string, any>;
  vimshottariDasa: any[];
  nakshatra: string;
  pada: number;
  lagna: string;
  moonSign: string;
  sunSign: string;
  ascendant: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  chartId: string;
  type: "personality" | "career" | "business" | "marriage" | "love" | "education" | "health" | "finance" | "yearly" | "monthly" | "daily" | "compatibility";
  title: string;
  content: string;
  language: string;
  mode: "simple" | "professional" | "expert";
  isAIGenerated: boolean;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "canceled" | "expired" | "pending";
  startDate: Date;
  endDate: Date;
  paymentId: string;
  amount: number;
  currency: string;
  gateway: "stripe" | "paypal" | "razorpay" | "payhere" | "apple_pay" | "google_pay";
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  gateway: string;
  gatewayPaymentId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
