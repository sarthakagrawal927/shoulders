import data from '../data/explorations.json';
import { findPaths } from './graph.mjs';
export const { products, foundations, relationships, editorial } = data;
export type Product = (typeof products)[number];
export type Foundation = (typeof foundations)[number];
export type Relation = (typeof relationships)[number];
export const entity = (id: string) => [...products, ...foundations].find((item) => item.id === id)!;
export const outgoing = (id: string) => relationships.filter((edge) => edge.source === id);
export function paths(source: string, target: string, seen: string[] = []): string[][] {
  return findPaths(relationships, source, target, seen);
}
export const foundationHref = (id: string, product?: string) =>
  product ? `/products/${product}/${id}/` : `/foundations/${id}/`;
export const relationTypes = {
  'built with': 'Uses the component as part of its implementation.',
  'derived from':
    'Its implementation descends from another project; this does not imply current runtime use.',
  'powered by': 'Uses a component to provide a particular capability.',
  'runs on': 'Executes the scoped workload within this runtime or platform.',
  'compatible with': 'Can interoperate; does not establish a dependency.',
  'implemented by': 'Its physical logic is realized through these devices.',
  'made from': 'Uses this material in the stated manufacturing example.',
  'requires power': 'Needs electrical energy to operate; does not identify a supplier or a price.',
};

export const basisLabels = {
  implementation: 'Product implementation',
  'platform-example': 'Selected platform example',
  physical: 'General physical foundation',
};
export function pathBasis(path: string[]) {
  const edges = path
    .slice(0, -1)
    .map((id, i) => relationships.find((r) => r.source === id && r.target === path[i + 1])!);
  return edges.some((r) => r.basis === 'physical')
    ? 'physical'
    : edges.some((r) => r.basis === 'platform-example')
      ? 'platform-example'
      : 'implementation';
}
