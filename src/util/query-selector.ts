import { fromNullable, Option } from 'fp-ts/lib/Option';

export function selectAll<K extends keyof HTMLElementTagNameMap>(
  q: K,
  parent?: ParentNode,
): Array<HTMLElementTagNameMap[K]>;
export function selectAll<E extends Element = Element>(q: string, parent?: ParentNode): E[];
export function selectAll<T extends Element>(q: string, parent?: ParentNode) {
  return Array.from((parent || document).querySelectorAll<T>(q));
}

export function select<K extends keyof HTMLElementTagNameMap>(
  q: K,
  parent?: ParentNode,
): Option<HTMLElementTagNameMap[K]>;
export function select<E extends Element = Element>(q: string, parent?: ParentNode): Option<E>;
export function select<T extends Element>(q: string, parent?: ParentNode) {
  return fromNullable((parent || document).querySelector<T>(q));
}
