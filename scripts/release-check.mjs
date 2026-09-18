import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const root = new URL('../', import.meta.url);
export async function contentDigest() {
  const hash = createHash('sha256');
  async function walk(dir) {
    for (const entry of (await readdir(new URL(dir, root), { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const path = `${dir}${entry.name}`;
      if (entry.isDirectory()) await walk(`${path}/`);
      else if (/\.(astro|ts|mjs|json)$/.test(path)) {
        hash.update(path);
        if (path === 'src/data/explorations.json') {
          const { editorial, ...content } = JSON.parse(await readFile(new URL(path, root), 'utf8'));
          hash.update(JSON.stringify(content));
        } else hash.update(await readFile(new URL(path, root)));
      }
    }
  }
  await walk('src/');
  return hash.digest('hex');
}
export function approved(editorial, digest) {
  return (
    editorial.status === 'approved' &&
    typeof editorial.reviewedBy === 'string' &&
    editorial.reviewedBy.trim().length > 0 &&
    typeof editorial.reviewedAt === 'string' &&
    Number.isFinite(Date.parse(editorial.reviewedAt)) &&
    Date.parse(editorial.reviewedAt) <= Date.now() &&
    editorial.reviewedContentSha256 === digest
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const data = JSON.parse(await readFile(new URL('src/data/explorations.json', root), 'utf8'));
  const digest = await contentDigest();
  if (process.argv.includes('--digest')) console.log(digest);
  else if (!approved(data.editorial, digest)) {
    console.error(
      'Release blocked: a human must review the exact current content. Record reviewer, review date and content digest only after explicit editorial approval. Local preview builds remain available.',
    );
    process.exitCode = 1;
  } else console.log('Human editorial review matches this content.');
}
