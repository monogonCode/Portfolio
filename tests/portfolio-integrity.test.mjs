import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

test('every public icon referenced in projectMedia.ts exists on disk', () => {
  const mediaFile = fs.readFileSync(path.join(root, 'src/data/projectMedia.ts'), 'utf8');
  const iconMatches = [...mediaFile.matchAll(/['"](\/images\/[^'"]+)['"]/g)].map((m) => m[1]);
  assert.ok(iconMatches.length >= 6, 'expected bespoke logo SVG paths in projectMedia.ts');
  for (const rel of iconMatches) {
    const full = path.join(root, 'public', rel);
    assert.ok(fs.existsSync(full), `Missing asset: ${rel}`);
  }
});

test('ES and EN project catalogs define matching project IDs', () => {
  const projectsSrc = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8');
  const esSection = projectsSrc.split('export const PROJECTS_EN')[0];
  const enSection = projectsSrc.split('export const PROJECTS_EN')[1] ?? '';

  const esIds = [...esSection.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
  const enIds = [...enSection.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);

  assert.ok(esIds.length > 0);
  assert.deepEqual(esIds, enIds);
});

test('Layout viewport allows user zoom for accessibility', () => {
  const layout = fs.readFileSync(path.join(root, 'src/layouts/Layout.astro'), 'utf8');
  assert.doesNotMatch(layout, /user-scalable=no/);
  assert.match(layout, /<link rel="canonical"/);
});
