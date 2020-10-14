import { createContext, useEffect, useState } from 'react';
import { Config } from '../domain/config';

export const useConfig = () => {
  const [loaded, setLoaded] = useState(false);
  const [config, setConfig] = useState<Config>({
    cacheMaxAge: 0,
    enableBackgroundColor: false,
    isDisplayDefault: false,
  });

  useEffect(() => {
    chrome.storage.local.get((cfg) => {
      setConfig(cfg as Config);
      setLoaded(true);
    });
  }, []);

  return {
    loaded,
    config,
    setConfig: (f: (prev: Config) => Config) => {
      const set = f(config);
      chrome.storage.local.set(set, () => setConfig(set));
    },
  } as const;
};

export const ConfigContext = createContext<Pick<ReturnType<typeof useConfig>, 'config' | 'setConfig'>>({
  config: {
    cacheMaxAge: 0,
    enableBackgroundColor: false,
    isDisplayDefault: false,
  },
  setConfig: () => {},
});
