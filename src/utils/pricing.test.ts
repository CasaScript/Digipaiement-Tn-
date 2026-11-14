import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubscriptionPrice,
  calculateMonthlyEquivalent,
  supportsDuration,
  CATALOG_TOOLS,
  isValidTunisianPhone,
  isValidEmail,
  generateWhatsAppLink,
} from './pricing.js';

test('calculateSubscriptionPrice computes exact official prices for 1 mois and 3 mois', () => {
  // IA & Productivité
  assert.equal(calculateSubscriptionPrice('google-one', '1 mois'), 29);
  assert.equal(calculateSubscriptionPrice('google-one', '3 mois'), 69);
  assert.equal(calculateSubscriptionPrice('microsoft-office-365', '1 mois'), 19);
  assert.equal(calculateSubscriptionPrice('microsoft-office-365', '3 mois'), 49);

  // Streaming & Musique
  for (const id of ['shahid-vip', 'spotify-premium', 'prime-tv', 'apple-tv-plus']) {
    assert.equal(calculateSubscriptionPrice(id, '1 mois'), 15);
    assert.equal(calculateSubscriptionPrice(id, '3 mois'), 39);
  }

  // Offres Packs Combinés (mensuel)
  assert.equal(calculateSubscriptionPrice('pack-pro-ia', '1 mois'), 42);
  assert.equal(calculateSubscriptionPrice('pack-divertissement', '1 mois'), 25);
});

test('supportsDuration marks combined packs as monthly-only without inventing 3-month prices', () => {
  const googleOne = CATALOG_TOOLS.find((t) => t.id === 'google-one')!;
  const packPro = CATALOG_TOOLS.find((t) => t.id === 'pack-pro-ia')!;
  const packFun = CATALOG_TOOLS.find((t) => t.id === 'pack-divertissement')!;

  assert.equal(supportsDuration(googleOne, '3 mois'), true);
  assert.equal(supportsDuration(packPro, '1 mois'), true);
  assert.equal(supportsDuration(packPro, '3 mois'), false);
  assert.equal(supportsDuration(packFun, '3 mois'), false);
});

test('calculateMonthlyEquivalent breaks down 3-month savings accurately', () => {
  // 69 TND for 3 months = 23 TND / month
  assert.equal(calculateMonthlyEquivalent('google-one', '3 mois'), 23);
  // 39 TND for 3 months = 13 TND / month
  assert.equal(calculateMonthlyEquivalent('spotify-premium', '3 mois'), 13);
});

test('isValidTunisianPhone accepts valid mobile formats', () => {
  assert.equal(isValidTunisianPhone('98765432'), true);
  assert.equal(isValidTunisianPhone('+216 98 765 432'), true);
  assert.equal(isValidTunisianPhone('22123456'), true);
  assert.equal(isValidTunisianPhone('55123456'), true);
  assert.equal(isValidTunisianPhone('0021622123456'), true);

  // Invalid formats
  assert.equal(isValidTunisianPhone('123456'), false);
  assert.equal(isValidTunisianPhone('01234567'), false);
  assert.equal(isValidTunisianPhone(''), false);
});

test('isValidEmail accepts valid email addresses and rejects malformed', () => {
  assert.equal(isValidEmail('client@digipaiement.tn'), true);
  assert.equal(isValidEmail('mohamed@gmail.com'), true);
  assert.equal(isValidEmail('bademail'), false);
  assert.equal(isValidEmail('bad@email'), false);
  assert.equal(isValidEmail(''), false);
});

test('generateWhatsAppLink returns properly formatted URL', () => {
  const link = generateWhatsAppLink({
    toolName: 'Google One',
    duration: '3 mois',
    paymentMethod: 'D17',
    customerEmail: 'test@example.com',
    orderId: 'DG-1234',
  });
  assert.ok(link.startsWith('https://wa.me/21698765432?text='));
  assert.ok(link.includes(encodeURIComponent('Google One')));
  assert.ok(link.includes(encodeURIComponent('DG-1234')));
});
