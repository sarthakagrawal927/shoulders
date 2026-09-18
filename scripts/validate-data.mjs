import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export function validate(data) {
  const errors = [];
  const entities = [...data.products, ...data.foundations];
  const ids = new Set(entities.map((e) => e.id));
  const https = (value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  };
  if (ids.size !== entities.length) errors.push('Entity IDs must be unique.');
  if (data.products.length < 3 || data.products.length > 12)
    errors.push('Keep this curated edition between 3 and 12 products.');
  for (const e of entities) {
    if (!/^[a-z0-9-]+$/.test(e.id)) errors.push(`Invalid slug: ${e.id}`);
    if (!e.name || !e.description || !https(e.url)) errors.push(`Incomplete entity: ${e.id}`);
  }
  for (const f of data.foundations)
    if (!f.responsibilities || !https(f.docs))
      errors.push(`Missing independent-use guidance: ${f.id}`);
  for (const f of data.foundations)
    if (
      !['software', 'platform', 'hardware', 'material', 'energy'].includes(f.layer) ||
      !f.boundary
    )
      errors.push(`Missing layer or evidence endpoint: ${f.id}`);
  const edgeIds = new Set();
  for (const r of data.relationships) {
    if (edgeIds.has(r.id)) errors.push(`Duplicate relationship ${r.id}`);
    edgeIds.add(r.id);
    if (!ids.has(r.source) || !data.foundations.some((f) => f.id === r.target))
      errors.push(`Dangling relationship ${r.id}`);
    if (
      ![
        'built with',
        'derived from',
        'powered by',
        'runs on',
        'compatible with',
        'implemented by',
        'made from',
        'requires power',
      ].includes(r.type)
    )
      errors.push(`Unknown relationship type ${r.id}`);
    if (!['implementation', 'platform-example', 'physical'].includes(r.basis))
      errors.push(`Missing evidence boundary ${r.id}`);
    const target = data.foundations.find((f) => f.id === r.target);
    if (target?.layer === 'platform' && r.basis !== 'platform-example')
      errors.push(`Platform needs an explicit example boundary ${r.id}`);
    if (['material', 'energy'].includes(target?.layer) && r.basis !== 'physical')
      errors.push(`Physical resource needs a physical boundary ${r.id}`);
    if (target?.layer === 'energy' && r.type !== 'requires power')
      errors.push(`Energy is not a software component ${r.id}`);
    if (target?.layer === 'material' && r.type !== 'made from')
      errors.push(`Material needs a material relationship ${r.id}`);
    if (!r.capability || !r.provides || !r.adds || !r.scope)
      errors.push(`Incomplete explanation ${r.id}`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(r.verified) ||
      !Number.isFinite(Date.parse(r.verified)) ||
      Date.parse(r.verified) > Date.now()
    )
      errors.push(`Invalid verification date ${r.id}`);
    if (
      r.status !== 'documented' ||
      !r.evidence?.length ||
      r.evidence.some((e) => !https(e.url) || !e.title)
    )
      errors.push(`Missing primary evidence ${r.id}`);
  }
  for (const p of data.products) {
    const count = data.relationships.filter(
      (r) => r.source === p.id && r.type !== 'compatible with',
    ).length;
    if (count < 3 || count > 6) errors.push(`${p.id}: expected 3–6 direct foundations`);
  }
  function visit(id, ancestors = []) {
    if (ancestors.includes(id)) {
      errors.push(`Cycle at ${id}`);
      return;
    }
    for (const r of data.relationships.filter(
      (r) => r.source === id && r.type !== 'compatible with',
    ))
      visit(r.target, [...ancestors, id]);
  }
  for (const p of data.products) visit(p.id);
  for (const f of data.foundations)
    if (!data.relationships.some((r) => r.target === f.id))
      errors.push(`Unconnected foundation ${f.id}`);
  return [...new Set(errors)];
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const data = JSON.parse(
    await readFile(new URL('../src/data/explorations.json', import.meta.url), 'utf8'),
  );
  const errors = validate(data);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else
    console.log(
      `Validated ${data.products.length} products, ${data.foundations.length} foundations and ${data.relationships.length} evidence-linked relationships.`,
    );
}
