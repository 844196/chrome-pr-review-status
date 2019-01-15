import { Config as IConfig, ConfigValue } from '../domain/config';
import { SSOT } from '../util/ssot';

const defaults: ConfigValue = {
  isDisplayDefault: false,
  enableBackgroundColor: true,
  debugUsername: '',
};

const bind = async <T extends keyof ConfigValue>(key: T) => {
  const value = await new Promise<ConfigValue[T]>((ok) =>
    chrome.storage.local.get({ [key]: defaults[key] }, (map) => ok(map[key])),
  );
  return new SSOT(value, (changed) => chrome.storage.local.set({ [key]: changed }));
};

export const config: IConfig = {
  isDisplayDefault: bind('isDisplayDefault'),
  enableBackgroundColor: bind('enableBackgroundColor'),
  debugUsername: bind('debugUsername'),
};
