const config = {
  isDisplayDefault: false,
  enableBackgroundColor: false,
};
export type Config = typeof config;

export const useConfig = async <K extends keyof Config, T extends Config[K]>(
  key: K,
): Promise<[T, (newT: T) => void]> => {
  return [
    await new Promise<T>((ok) => chrome.storage.local.get({ [key]: config[key] }, (map) => ok(map[key]))),
    (newT) => chrome.storage.local.set({ [key]: newT }),
  ];
};
