// SEE: webpack.config.js -- DefinePlugin
declare var ENVIRONMENT: 'production' | 'development';

type SubType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? K : never }[keyof T]>;
