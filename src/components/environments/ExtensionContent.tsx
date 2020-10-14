import React, { FC, ReactPortal } from 'react';
import { ConfigContext, useConfig } from '../../hooks/useConfig';

interface Props {
  portals: ReactPortal[];
}

export const ExtensionContent: FC<Props> = ({ portals }) => {
  const { config, setConfig, loaded: configLoaded } = useConfig();

  if (!configLoaded) {
    return null;
  }

  console.log(config);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      <>{...portals}</>
    </ConfigContext.Provider>
  );
};
