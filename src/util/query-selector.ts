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

export function select<K extends keyof HTMLElementTagNameMap>(q: K, parent?: Element): Option<HTMLElementTagNameMap[K]>;
export function select<E extends Element = Element>(q: string, parent?: Element): Option<E>;
export function select<T extends Element>(selector: string, parent?: Element) {
  return fromNullable((parent || document).querySelector<T>(selector));
}
