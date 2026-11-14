import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_EMAIL,
  isAdminEmail,
  isValidOrderStatus,
  computeAdminStats,
  filterAdminOrders,
  enrichClientsWithOrders,
  type AdminOrderRecord,
  type AdminUserRecord,
  type AdminMessageRecord,
} from './admin.js';

const sampleUsers: AdminUserRecord[] = [
  {
    id: 1,
    uid: 'uid-admin',
    email: ADMIN_EMAIL,
    displayName: 'Mohamed Khalil',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 2,
    uid: 'uid-client',
    email: 'amina.tunis@gmail.com',
    displayName: 'Amina Ben Ali',
    createdAt: '2026-01-12T12:00:00.000Z',
  },
];

const sampleOrders: AdminOrderRecord[] = [
  {
    id: 1,
    orderCode: 'DG-1001',
    userId: 2,
    fullName: 'Amina Ben Ali',
    email: 'amina.tunis@gmail.com',
    phone: '+216 98 111 222',
    tool: 'Google One (Flow & Veo)',
    planDuration: '3 mois',
    paymentMethod: 'D17',
    priceTnd: 69,
    status: 'activated',
    notes: 'Activé sur compte personnel',
    createdAt: '2026-01-13T14:00:00.000Z',
  },
  {
    id: 2,
    orderCode: 'DG-1002',
    userId: 2,
    fullName: 'Amina Ben Ali',
    email: 'amina.tunis@gmail.com',
    phone: '+216 98 111 222',
    tool: 'Spotify Premium',
    planDuration: '1 mois',
    paymentMethod: 'Flouci',
    priceTnd: 15,
    status: 'pending_payment',
    notes: null,
    createdAt: '2026-01-14T09:00:00.000Z',
  },
  {
    id: 3,
    orderCode: 'DG-1003',
    userId: 1,
    fullName: 'Test Annulé',
    email: 'test@example.com',
    phone: '22000111',
    tool: 'Microsoft Office 365',
    planDuration: '1 mois',
    paymentMethod: 'Virement',
    priceTnd: 19,
    status: 'cancelled',
    notes: 'Doublon',
    createdAt: '2026-01-11T08:00:00.000Z',
  },
];

const sampleMessages: AdminMessageRecord[] = [
  {
    id: 1,
    userId: 2,
    name: 'Amina Ben Ali',
    email: 'amina.tunis@gmail.com',
    phone: '98111222',
    subject: 'Question Google Flow',
    message: 'Est-ce que Veo est inclus ?',
    createdAt: '2026-01-13T11:00:00.000Z',
  },
];

test('isAdminEmail only authorizes the exact admin Gmail address', () => {
  assert.equal(isAdminEmail('mohamedkhaliljelassi00@gmail.com'), true);
  assert.equal(isAdminEmail('  MohamedKhalilJelassi00@GMAIL.com '), true);
  assert.equal(isAdminEmail('other@gmail.com'), false);
  assert.equal(isAdminEmail('mohamedkhaliljelassi00@gmail.com.evil.tn'), false);
  assert.equal(isAdminEmail(''), false);
  assert.equal(isAdminEmail(null), false);
  assert.equal(isAdminEmail(undefined), false);
});

test('isValidOrderStatus validates allowed workflow statuses', () => {
  assert.equal(isValidOrderStatus('pending_payment'), true);
  assert.equal(isValidOrderStatus('processing'), true);
  assert.equal(isValidOrderStatus('activated'), true);
  assert.equal(isValidOrderStatus('cancelled'), true);
  assert.equal(isValidOrderStatus('unknown_status'), false);
});

test('computeAdminStats totals order counts and excludes cancelled orders from revenue', () => {
  const stats = computeAdminStats(sampleOrders, sampleUsers, sampleMessages);
  assert.equal(stats.totalOrders, 3);
  assert.equal(stats.pendingOrders, 1);
  assert.equal(stats.processingOrders, 0);
  assert.equal(stats.activatedOrders, 1);
  assert.equal(stats.cancelledOrders, 1);
  assert.equal(stats.totalRevenueTnd, 84); // 69 + 15 (excludes cancelled 19)
  assert.equal(stats.activatedRevenueTnd, 69);
  assert.equal(stats.totalUsers, 2);
  assert.equal(stats.totalMessages, 1);
});

test('filterAdminOrders filters by status and search text accurately', () => {
  assert.equal(filterAdminOrders(sampleOrders, 'all', '').length, 3);
  assert.equal(filterAdminOrders(sampleOrders, 'pending_payment', '').length, 1);
  assert.equal(filterAdminOrders(sampleOrders, 'all', 'DG-1001')[0]?.orderCode, 'DG-1001');
  assert.equal(filterAdminOrders(sampleOrders, 'all', 'Flouci')[0]?.orderCode, 'DG-1002');
  assert.equal(filterAdminOrders(sampleOrders, 'activated', 'Spotify').length, 0);
});

test('enrichClientsWithOrders aggregates client order counts and non-cancelled spend', () => {
  const enriched = enrichClientsWithOrders(sampleUsers, sampleOrders);
  const adminClient = enriched.find((u) => u.id === 1)!;
  const aminaClient = enriched.find((u) => u.id === 2)!;

  assert.equal(adminClient.ordersCount, 1);
  assert.equal(adminClient.totalSpentTnd, 0);
  assert.equal(aminaClient.ordersCount, 2);
  assert.equal(aminaClient.totalSpentTnd, 84);
  assert.equal(aminaClient.lastOrderAt, '2026-01-14T09:00:00.000Z');
});
