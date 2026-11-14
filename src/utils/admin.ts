export const ADMIN_EMAIL = 'mohamedkhaliljelassi00@gmail.com';

export const ORDER_STATUSES = [
  'pending_payment',
  'processing',
  'activated',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface AdminOrderRecord {
  id: number;
  orderCode: string;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  tool: string;
  planDuration: string;
  paymentMethod: string;
  priceTnd: number;
  status: string;
  notes: string | null;
  createdAt: string | Date;
}

export interface AdminUserRecord {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string | Date;
}

export interface AdminMessageRecord {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string | Date;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  activatedOrders: number;
  cancelledOrders: number;
  totalRevenueTnd: number;
  activatedRevenueTnd: number;
  totalUsers: number;
  totalMessages: number;
}

export interface EnrichedClientRecord extends AdminUserRecord {
  ordersCount: number;
  totalSpentTnd: number;
  lastOrderAt: string | Date | null;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string }
> = {
  pending_payment: {
    label: 'En attente de paiement',
    badgeClass: 'bg-amber-950/70 text-amber-300 border-amber-500/30',
  },
  processing: {
    label: 'En traitement',
    badgeClass: 'bg-blue-950/70 text-blue-300 border-blue-500/30',
  },
  activated: {
    label: 'Activé',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30',
  },
  cancelled: {
    label: 'Annulé',
    badgeClass: 'bg-red-950/70 text-red-300 border-red-500/30',
  },
};

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(status);
}

export function computeAdminStats(
  orders: readonly AdminOrderRecord[],
  users: readonly AdminUserRecord[],
  messages: readonly AdminMessageRecord[]
): AdminStats {
  let pendingOrders = 0;
  let processingOrders = 0;
  let activatedOrders = 0;
  let cancelledOrders = 0;
  let totalRevenueTnd = 0;
  let activatedRevenueTnd = 0;

  for (const order of orders) {
    const amount = Number(order.priceTnd) || 0;
    switch (order.status) {
      case 'pending_payment':
        pendingOrders += 1;
        totalRevenueTnd += amount;
        break;
      case 'processing':
        processingOrders += 1;
        totalRevenueTnd += amount;
        break;
      case 'activated':
        activatedOrders += 1;
        totalRevenueTnd += amount;
        activatedRevenueTnd += amount;
        break;
      case 'cancelled':
        cancelledOrders += 1;
        break;
      default:
        totalRevenueTnd += amount;
        break;
    }
  }

  return {
    totalOrders: orders.length,
    pendingOrders,
    processingOrders,
    activatedOrders,
    cancelledOrders,
    totalRevenueTnd,
    activatedRevenueTnd,
    totalUsers: users.length,
    totalMessages: messages.length,
  };
}

export function filterAdminOrders(
  orders: readonly AdminOrderRecord[],
  statusFilter: string,
  searchQuery: string
): AdminOrderRecord[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return orders.filter((order) => {
    if (statusFilter && statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    if (!normalizedQuery) return true;

    const haystack = [
      order.orderCode,
      order.fullName,
      order.email,
      order.phone,
      order.tool,
      order.paymentMethod,
      order.planDuration,
      order.notes ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function enrichClientsWithOrders(
  users: readonly AdminUserRecord[],
  orders: readonly AdminOrderRecord[]
): EnrichedClientRecord[] {
  const statsByUserId = new Map<
    number,
    { count: number; totalSpentTnd: number; lastOrderAt: string | Date | null }
  >();

  for (const order of orders) {
    const existing = statsByUserId.get(order.userId) ?? {
      count: 0,
      totalSpentTnd: 0,
      lastOrderAt: null,
    };
    existing.count += 1;
    if (order.status !== 'cancelled') {
      existing.totalSpentTnd += Number(order.priceTnd) || 0;
    }
    if (
      !existing.lastOrderAt ||
      new Date(order.createdAt).getTime() >
        new Date(existing.lastOrderAt).getTime()
    ) {
      existing.lastOrderAt = order.createdAt;
    }
    statsByUserId.set(order.userId, existing);
  }

  return users.map((user) => {
    const stats = statsByUserId.get(user.id);
    return {
      ...user,
      ordersCount: stats?.count ?? 0,
      totalSpentTnd: stats?.totalSpentTnd ?? 0,
      lastOrderAt: stats?.lastOrderAt ?? null,
    };
  });
}
