// alias
type NameMap = HTMLElementTagNameMap;
type CSSMap = CSSStyleDeclaration;
type EventMap = HTMLElementEventMap;

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;
type WritableKeys<T> = { [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P> }[keyof T];

interface NodeData<T> {
  props?: Partial<SubType<Pick<T, WritableKeys<T>>, string | number | boolean>>;
  style?: Partial<SubType<Pick<CSSMap, WritableKeys<CSSMap>>, string | null>>;
  class?: string | string[];
  on?: { [P in keyof EventMap]?: (this: T, evt: EventMap[P]) => any };
}
const isNodeData = <T>(v: any): v is NodeData<T> => isNodeChildren(v) === false;

type NodeChildren = string | Array<Node | string>;
const isNodeChildren = (v: any): v is NodeChildren => {
  if (typeof v === 'string') {
    return true;
  }
  if (v instanceof Array) {
    return true;
  }
  return false;
};

export function h<T extends keyof NameMap>(tagName: T, arg2?: NodeData<NameMap[T]> | NodeChildren): NameMap[T];
export function h<T extends keyof NameMap>(tagName: T, arg2: NodeData<NameMap[T]>, arg3?: NodeChildren): NameMap[T];
export function h<T extends keyof NameMap>(
  tagName: T,
  arg2?: NodeData<NameMap[T]> | NodeChildren,
  arg3?: NodeChildren,
): NameMap[T] {
  const dom = document.createElement(tagName);

  let data;
  let children;
  if (arg2) {
    if (isNodeData(arg2)) {
      data = arg2;
      if (arg3) {
        children = arg3;
      }
    } else {
      children = arg2 as NodeChildren;
    }
  }

  if (data) {
    const { class: klass, on, props, style } = data;
    if (klass) {
      if (typeof klass === 'string') {
        dom.classList.add(klass);
      } else {
        dom.classList.add(...klass);
      }
    }
    if (on) {
      for (const [k, v] of Object.entries(on)) {
        dom.addEventListener(k, v);
      }
    }
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (k.startsWith('data-')) {
          // @ts-ignore
          dom.dataset[k.replace(/^data-/, '')] = v;
        } else {
          // @ts-ignore
          dom[k] = v;
        }
      }
    }
    if (style) {
      for (const [k, v] of Object.entries(style)) {
        // @ts-ignore
        dom.style[k] = v;
      }
    }
  }

  if (children) {
    if (typeof children === 'string') {
      dom.append(document.createTextNode(children));
    } else {
      for (const child of children) {
        dom.append(typeof child === 'string' ? document.createTextNode(child) : child);
      }
    }
  }

  return dom;
}
