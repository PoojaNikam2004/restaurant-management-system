export interface OrderLine {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "created" | "paid" | "failed";
export type KitchenStatus = "queued" | "preparing" | "ready" | "served";

export interface Order {
  id: string;
  uid: string;
  orderNumber?: number;
  tableNumber?: string;
  lines: OrderLine[];
  totalAmount: number;
  status: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: number;
}

export interface KitchenQueueEntry {
  orderId: string;
  uid: string;
  orderNumber: number;
  tableNumber?: string;
  lines: OrderLine[];
  status: KitchenStatus;
  createdAt: number;
  updatedAt: number;
}