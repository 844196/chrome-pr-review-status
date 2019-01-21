import { fromNullable, Option } from 'fp-ts/lib/Option';

function praseArgs(arg1: string | Element, arg2?: string): [Element | Document, string] {
  let selectFrom: Element | Document;
  let query: string;
  if (typeof arg1 === 'string') {
    selectFrom = document;
    query = arg1;
  } else {
    selectFrom = arg1;
    query = arg2!;
  }
  return [selectFrom, query];
}

export function $<T extends Element = Element>(q: string): T | null;
export function $<T extends Element = Element>(selectFrom: Element, q: string): T | null;
export function $<T extends Element = Element>(arg1: string | Element, arg2?: string) {
  const [selectFrom, query] = praseArgs(arg1, arg2);
  return selectFrom.querySelector<T>(query);
}

export function $all<T extends Element = Element>(q: string): T[];
export function $all<T extends Element = Element>(selectFrom: Element, q: string): T[];
export function $all<T extends Element = Element>(arg1: string | Element, arg2?: string) {
  const [selectFrom, query] = praseArgs(arg1, arg2);
  return Array.from(selectFrom.querySelectorAll<T>(query));
}

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
