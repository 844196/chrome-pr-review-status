// SEE: webpack.config.js -- DefinePlugin
declare var ENVIRONMENT: 'production' | 'development';

type SubType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? K : never }[keyof T]>;

declare module 'octicons' {
  interface Octicon {
    toSVG(): string;
  }

  // 必要な分だけ定義
  let icons: {
    comment: Octicon;
    x: Octicon;
    check: Octicon;
    'primitive-dot': Octicon;
    fold: Octicon;
    unfold: Octicon;
  };

  export = icons;
}

declare module 'dom-chef/react';
