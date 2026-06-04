const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5239/api";

export interface MenuItemDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  estimatedPrepTimeMinutes: number;
  isAvailable: boolean;
  dietaryTags: string[];
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  menuItems: MenuItemDto[];
}

export interface StaffDto {
  id: string;
  userId: string;
  fullName: string;
  profilePictureUrl?: string;
  gender?: string;
  languages: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  status: string;
  currentWorkload: number;
}

export interface TableDto {
  id: string;
  tableNumber: string;
  capacity: number;
  isOccupied: boolean;
}

export interface OrderItemDto {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponseDto {
  id: string;
  tableNumber: string;
  waiterName?: string;
  totalAmount: number;
  status: string;
  orderTime: string;
  estimatedReadyInMinutes: number;
  items: OrderItemDto[];
}

export interface CreateOrderDto {
  tableId: string;
  waiterId?: string;
  items: { menuItemId: string; quantity: number; note?: string }[];
  specialInstructions?: string;
  preferredPaymentMethod: number;
  customerPhone?: string;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function safeJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `POST ${path} failed: ${res.status}`);
  }
  return safeJson<T>(res);
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`);
  return safeJson<T>(res);
}

export const api = {
  getMenu: () => get<CategoryDto[]>("/menu"),
  getTables: () => get<TableDto[]>("/tables"),
  getWaiters: () => get<StaffDto[]>("/staff/waiters"),
  placeOrder: (dto: CreateOrderDto) => post<OrderResponseDto>("/order", dto),
  getOrder: (id: string) => get<OrderResponseDto>(`/order/${id}`),
  getWaiterOrders: (waiterId: string) => get<OrderResponseDto[]>(`/order/waiter/${waiterId}`),
  getPendingOrders: () => get<OrderResponseDto[]>("/order/pending"),
  confirmOrder: (orderId: string, estimatedMinutes: number) =>
    patch<{ estimatedMinutes: number }>(`/order/${orderId}/confirm`, { estimatedMinutes }),
  updateOrderStatus: (orderId: string, status: number) =>
    patch<void>(`/order/${orderId}/status`, status),
  submitRating: (orderId: string, score: number, comment?: string) =>
    post<void>("/rating", { orderId, score, comment }),
  submitFeedback: (message: string, category?: string) =>
    post<void>("/feedback", { message, category }),
};
