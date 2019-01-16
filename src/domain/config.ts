import { SSOT } from '../common/ssot';

export interface ConfigValue {
  isDisplayDefault: boolean;
  enableBackgroundColor: boolean;
  debugUsername: string;
}

export type Config = { [P in keyof ConfigValue]: Promise<SSOT<ConfigValue[P]>> };
