export function debug(...params: any[]) {
  if (ENVIRONMENT === 'development') {
    console.log(...params);
  }
}

export function info(...params: any[]) {
  console.log(...params);
}

export function error(...params: any[]) {
  console.error(...params);
}
