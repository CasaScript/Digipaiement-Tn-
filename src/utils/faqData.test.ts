import test from 'node:test';
import assert from 'node:assert/strict';
import { FAQ_LIST, FAQ_CATEGORIES, filterFAQs } from './faqData.js';

test('FAQ covers all 6 required user topics', () => {
  const categories = new Set(FAQ_LIST.map((item) => item.category));
  assert.ok(categories.has('how-it-works'), 'Must cover how the service works');
  assert.ok(categories.has('supported-tools'), 'Must cover supported tools');
  assert.ok(categories.has('payment-methods'), 'Must cover payment methods');
  assert.ok(categories.has('currency-tnd'), 'Must cover currency conversion / TND');
  assert.ok(categories.has('subscription-management'), 'Must cover subscription management');
  assert.ok(categories.has('customer-support'), 'Must cover customer support contact');
});

test('FAQ contains comprehensive number of questions', () => {
  assert.ok(FAQ_LIST.length >= 15, `Expected at least 15 FAQs, got ${FAQ_LIST.length}`);
});

test('filterFAQs filters by category correctly', () => {
  const paymentFaqs = filterFAQs('payment-methods', '');
  assert.ok(paymentFaqs.length > 0);
  assert.ok(paymentFaqs.every((item) => item.category === 'payment-methods'));
});

test('filterFAQs filters by search query correctly', () => {
  const flowFaqs = filterFAQs('all', 'Google Flow');
  assert.ok(flowFaqs.length > 0);
  assert.ok(
    flowFaqs.some(
      (item) =>
        item.question.toLowerCase().includes('google flow') ||
        item.answer.toLowerCase().includes('google flow')
    )
  );

  const d17Faqs = filterFAQs('all', 'D17');
  assert.ok(d17Faqs.length > 0);
});

test('FAQ customer support includes official phone and email', () => {
  const supportItems = FAQ_LIST.filter((item) => item.category === 'customer-support');
  const supportText = supportItems.map((i) => i.answer).join(' ');
  assert.ok(supportText.includes('+216 98 765 432'), 'Should contain phone number');
  assert.ok(supportText.includes('contact@digipaiement.tn'), 'Should contain email');
});
