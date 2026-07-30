export type Business = {
  id: string;
  name: string;
  category: string;
  description: string;
  ownerId: string;
  location?: { lat: number; lng: number };
  contact?: { phone?: string; email?: string };
  status: "pending" | "active" | "suspended";
  createdAt: string;
};

export type Membership = {
  id: string;
  businessId: string;
  plan: "basic" | "comercio" | "premium";
  status: "active" | "expired" | "cancelled";
  expiresAt: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  currency: "MX" | "LTOS";
  type: "payment" | "donation" | "membership";
  status: "pending" | "completed" | "failed";
  createdAt: string;
};
