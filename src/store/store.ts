import { SSOT } from '../common/ssot';

const localStorageValue = async <T>(key: string, defaultValue: T) => {
  const value = await new Promise<T>((ok) => chrome.storage.local.get({ [key]: defaultValue }, (map) => ok(map[key])));
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

export const store = {
  isDisplayReviewStatusColumn: localStorageValue('isDisplayDefault', false),
  colorCoded: localStorageValue('enableBackgroundColor', true),
  loginUsername: localStorageValue('loginUsername', ''),
};
