import { SSOT } from '../common/ssot';

export interface ConfigValue {
  isDisplayDefault: boolean;
  enableBackgroundColor: boolean;
  debugUsername: string;
}

export type Config = { [P in keyof ConfigValue]: Promise<SSOT<ConfigValue[P]>> };

const defaults: ConfigValue = {
  isDisplayDefault: false,
  enableBackgroundColor: true,
  debugUsername: '',
};

const bind = async <T extends keyof ConfigValue>(key: T) => {
  const value = await new Promise<ConfigValue[T]>((ok) =>
    chrome.storage.local.get({ [key]: defaults[key] }, (map) => ok(map[key])),
  );

  const ssot = new SSOT(value, (changed) => chrome.storage.local.set({ [key]: changed }));

  chrome.storage.onChanged.addListener((changes, areaName: 'local' | string) => {
    if (areaName !== 'local') {
      return;
    }

    const change = changes[key];
    if (!change) {
      return;
    }

    ssot.change(change.newValue);
  });

  return ssot;
};

export const config: Config = {
  isDisplayDefault: bind('isDisplayDefault'),
  enableBackgroundColor: bind('enableBackgroundColor'),
  debugUsername: bind('debugUsername'),
};
