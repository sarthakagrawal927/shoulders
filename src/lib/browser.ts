import { products } from '../data/explorations.json';
const productIds = products.map((p) => p.id);
type Provider = { capture: (name: string, properties: Record<string, string>) => void };
declare global {
  interface Window {
    posthog?: Provider;
    shouldersEvents?: Array<{ event: string; properties: Record<string, string> }>;
  }
}
const product = document.body.dataset.product;
// Fleet taxonomy: product-specific actions remain properties of core_action.
// A host may attach its existing PostHog instance. No other product's ID is reused.
const optOut =
  navigator.doNotTrack === '1' ||
  (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
function trackEvent(name: string, action: string, target = '') {
  if (optOut) return;
  const payload = {
    event: name,
    properties: { project_id: 'shoulders', action, product: product ?? '', target },
  };
  try {
    window.posthog?.capture(name, payload.properties);
  } catch {
    /* Provider failures never interrupt exploration. */
  }
  // A bounded, in-memory integration surface; no free text, URL queries or user identifiers.
  const queue = (window.shouldersEvents ??= []);
  queue.push(payload);
  if (queue.length > 50) queue.shift();
  window.dispatchEvent(new CustomEvent('shoulders:analytics', { detail: payload }));
}
function readSession(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}
function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* Storage may be disabled. */
  }
}
function recordFoundationOpen(id: string) {
  trackEvent('core_action', 'foundation_opened', id);
  if (!readSession('shoulders:activated')) {
    trackEvent('activated', 'foundation_opened', id);
    if (!optOut) writeSession('shoulders:activated', '1');
  }
}
trackEvent('page_view', 'page_view');
if (product && !optOut) {
  const visited = readSession('shoulders:products')
    .split(',')
    .filter((id) => productIds.includes(id));
  if (!visited.includes(product)) {
    if (visited.length > 0) trackEvent('core_action', 'second_product_explored', product);
    writeSession('shoulders:products', [...visited, product].slice(-productIds.length).join(','));
  }
}
const treeNodes = [...document.querySelectorAll<HTMLDetailsElement>('details.tree-node')];
function selectTreeNode(target: HTMLDetailsElement | null) {
  const path = new Set<HTMLDetailsElement>();
  let node = target;
  while (node) {
    path.add(node);
    node = node.parentElement?.closest<HTMLDetailsElement>('details.tree-node') ?? null;
  }
  for (const item of treeNodes) {
    item.open = path.has(item);
    item.toggleAttribute('data-selected', item === target);
  }
}
function restoreTree() {
  let target: HTMLDetailsElement | null = null;
  try {
    target =
      document
        .getElementById(decodeURIComponent(location.hash.slice(1)))
        ?.closest<HTMLDetailsElement>('details.tree-node') ?? null;
  } catch {
    return;
  }
  if (location.hash && !target) return;
  selectTreeNode(target);
}
restoreTree();
window.addEventListener('popstate', restoreTree);
window.addEventListener('hashchange', restoreTree);
for (const node of treeNodes) {
  node.querySelector(':scope > summary')?.addEventListener('click', (event) => {
    event.preventDefault();
    const opening = !node.open;
    const selected = opening
      ? node
      : (node.parentElement?.closest<HTMLDetailsElement>('details.tree-node') ?? null);
    selectTreeNode(selected);
    history.pushState(null, '', selected ? `#layer-${selected.id}` : location.pathname);
    if (opening) recordFoundationOpen(node.dataset.foundation ?? node.id);
  });
}
document.addEventListener('click', (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[data-action], a[data-bay]');
  if (link)
    trackEvent(
      'core_action',
      link.dataset.action ?? '',
      link.dataset.target ?? link.dataset.product ?? '',
    );
});
const form = document.querySelector<HTMLFormElement>('#request-form');
const requestBody = document.querySelector<HTMLTextAreaElement>('#request-body');
requestBody?.addEventListener('input', () => {
  requestBody.setCustomValidity(
    requestBody.value.length > 0 && !requestBody.value.trim()
      ? 'Please name a product or foundation you would like to explore.'
      : '',
  );
});
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const body = (new FormData(form).get('body') as string).trim();
  if (!body) {
    requestBody?.setCustomValidity(
      'Please name a product or foundation you would like to explore.',
    );
    requestBody?.reportValidity();
    return;
  }
  location.href = `mailto:sarthakagrawal927@gmail.com?subject=${encodeURIComponent('Shoulders — exploration request')}&body=${encodeURIComponent(body)}`;
  const status = document.querySelector<HTMLElement>('#request-status');
  if (status)
    status.textContent =
      'Your email draft is ready. Send it in your email app to submit your request. If no app opened, use the email address below.';
  trackEvent('core_action', 'request_draft_opened');
});
