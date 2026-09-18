import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validate } from '../scripts/validate-data.mjs';
import { findPaths } from '../src/lib/graph.mjs';
import { approved } from '../scripts/release-check.mjs';
const data = JSON.parse(
  await readFile(new URL('../src/data/explorations.json', import.meta.url), 'utf8'),
);
test('curated edition has valid evidence, dates, scopes and bounded direct foundations', () =>
  assert.deepEqual(validate(data), []));
test('cross-product Chromium connections preserve the actual intermediate component', () => {
  assert.deepEqual(findPaths(data.relationships, 'vscode', 'chromium'), [
    ['vscode', 'electron', 'chromium'],
  ]);
  assert.deepEqual(findPaths(data.relationships, 'obs-studio', 'chromium'), [
    ['obs-studio', 'cef', 'chromium'],
  ]);
  assert.deepEqual(findPaths(data.relationships, 'supabase', 'chromium'), []);
});
test('compatibility cannot create a dependency path', () => {
  const edges = [
    { source: 'a', target: 'b', type: 'compatible with' },
    { source: 'b', target: 'c', type: 'built with' },
  ];
  assert.deepEqual(findPaths(edges, 'a', 'c'), []);
});
test('every exploration reaches silicon and electricity through a labelled example boundary', () => {
  for (const product of data.products) {
    for (const target of ['silicon', 'electricity']) {
      const trails = findPaths(data.relationships, product.id, target);
      assert.ok(trails.length > 0, `${product.id} reaches ${target}`);
      for (const trail of trails) {
        const edges = trail
          .slice(0, -1)
          .map((id, i) =>
            data.relationships.find((r) => r.source === id && r.target === trail[i + 1]),
          );
        assert.ok(edges.some((r) => r.basis === 'platform-example'));
        assert.equal(edges.at(-1).basis, 'physical');
        assert.equal(edges.at(-1).type, target === 'silicon' ? 'made from' : 'requires power');
      }
    }
  }
});
test('physical and platform evidence cannot be relabelled as implementation dependencies', () => {
  const copy = structuredClone(data);
  copy.relationships.find((r) => r.target === 'linux').basis = 'implementation';
  copy.relationships.find((r) => r.target === 'electricity').type = 'built with';
  const errors = validate(copy);
  assert.ok(errors.some((e) => e.includes('example boundary')));
  assert.ok(errors.some((e) => e.includes('Energy')));
});
test('cyclic evidence is rejected and traversal still terminates', () => {
  const copy = structuredClone(data);
  copy.relationships.push({
    ...copy.relationships[0],
    id: 'cycle',
    source: 'chromium',
    target: 'electron',
  });
  assert.ok(validate(copy).some((e) => e.includes('Cycle')));
  assert.deepEqual(findPaths(copy.relationships, 'chromium', 'missing'), []);
});
test('missing evidence, broken references and future verification fail validation', () => {
  const copy = structuredClone(data);
  Object.assign(copy.relationships[0], { evidence: [], target: 'unknown', verified: '2999-01-01' });
  const errors = validate(copy);
  for (const word of ['evidence', 'Dangling', 'date'])
    assert.ok(errors.some((e) => e.includes(word)));
});
test('draft and changed content cannot pass the human editorial gate', () => {
  assert.equal(approved(data.editorial, 'abc'), false);
  const review = {
    status: 'approved',
    reviewedBy: 'A human reviewer',
    reviewedAt: '2026-09-14',
    reviewedContentSha256: 'abc',
  };
  assert.equal(approved(review, 'abc'), true);
  assert.equal(approved(review, 'changed'), false);
  assert.equal(approved({ ...review, reviewedBy: null }, 'abc'), false);
});
