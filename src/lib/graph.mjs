/** Find documented dependency paths. Compatibility is never traversal evidence.
 * @param {{source:string,target:string,type:string}[]} edges
 * @param {string} source
 * @param {string} target
 * @param {string[]} seen
 * @returns {string[][]}
 */
export function findPaths(edges, source, target, seen = []) {
  if (seen.includes(source)) return [];
  if (source === target) return [[source]];
  return edges
    .filter((e) => e.source === source && e.type !== 'compatible with')
    .flatMap((e) =>
      findPaths(edges, e.target, target, [...seen, source]).map((path) => [source, ...path]),
    );
}
