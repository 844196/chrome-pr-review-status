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
