import { Config } from '../domain/config';

export const defaults: Config = {
  isDisplayDefault: false,
  enableBackgroundColor: true,
};

export async function get<K extends keyof Config>(key: K): Promise<Config[K]> {
  return new Promise((ok) => {
    chrome.storage.local.get(defaults, (cfg) => ok(cfg[key]));
  });
}

export async function set<K extends keyof Config>(key: K, value: Config[K]): Promise<void> {
  return new Promise((ok) => {
    chrome.storage.local.set({ [key]: value }, ok);
  });
}
