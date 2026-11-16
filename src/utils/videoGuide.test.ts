import test from 'node:test';
import assert from 'node:assert/strict';
import {
  VIDEO_GUIDE_CHAPTERS,
  getChapterForTime,
  getDefaultPaymentGuideScript,
  normalizePaymentGuideScript,
} from './videoGuide';

test('VIDEO_GUIDE_CHAPTERS covers D17 and Flouci chronologically across 16s', () => {
  assert.equal(VIDEO_GUIDE_CHAPTERS.length, 4);
  assert.equal(VIDEO_GUIDE_CHAPTERS[0].startSeconds, 0);
  assert.equal(VIDEO_GUIDE_CHAPTERS[1].id, 'd17');
  assert.equal(VIDEO_GUIDE_CHAPTERS[1].startSeconds, 4);
  assert.equal(VIDEO_GUIDE_CHAPTERS[2].id, 'flouci');
  assert.equal(VIDEO_GUIDE_CHAPTERS[2].startSeconds, 8);
  assert.equal(VIDEO_GUIDE_CHAPTERS[3].startSeconds, 12);
});

test('getChapterForTime maps timestamps to the right chapter', () => {
  assert.equal(getChapterForTime(-1).id, 'commande');
  assert.equal(getChapterForTime(0).id, 'commande');
  assert.equal(getChapterForTime(4.2).id, 'd17');
  assert.equal(getChapterForTime(9.5).id, 'flouci');
  assert.equal(getChapterForTime(14).id, 'activation');
  assert.equal(getChapterForTime(99).id, 'activation');
});

test('getDefaultPaymentGuideScript returns verified coordinates for D17 and Flouci', () => {
  const d17 = getDefaultPaymentGuideScript('D17');
  assert.match(d17.recipientInfo, /58 570 825/);
  assert.equal(d17.steps.length, 4);

  const flouci = getDefaultPaymentGuideScript('Flouci');
  assert.match(flouci.recipientInfo, /@digipaiement/);
  assert.equal(flouci.steps.length, 4);
});

test('normalizePaymentGuideScript sanitizes partial AI output with fallback safety', () => {
  const normalized = normalizePaymentGuideScript(
    {
      title: '  Mon guide Flouci  ',
      voiceover: '  Narration claire  ',
      steps: ['1. Étape 1', '2) Étape 2', 'Étape 3'],
      recipientInfo: 'Tag @digipaiement',
    },
    'Flouci',
    true
  );

  assert.equal(normalized.title, 'Mon guide Flouci');
  assert.equal(normalized.voiceover, 'Narration claire');
  assert.deepEqual(normalized.steps, ['Étape 1', 'Étape 2', 'Étape 3']);
  assert.equal(normalized.isAiGenerated, true);

  const invalidFallback = normalizePaymentGuideScript(null, 'D17', false);
  assert.equal(invalidFallback.method, 'D17');
  assert.equal(invalidFallback.steps.length, 4);
});
