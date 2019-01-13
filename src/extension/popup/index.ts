import { Config as IConfig } from '../../domain/config';
import * as Config from '../../external/config';

type SubType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? K : never }[keyof T]>;

const text = async (value: string) => document.createTextNode(value);
const hr = async () => document.createElement('hr');
const radio = async (name: string, value: 'true' | 'false', on: () => void) => {
  const dom = document.createElement('input');
  dom.type = 'radio';
  dom.name = name;
  dom.value = value;
  dom.addEventListener('change', on);
  return dom;
};
const radioPair = async <K extends keyof SubType<IConfig, boolean>>(key: K) => {
  const radioTrue = await radio(key, 'true', () => Config.set(key, true));
  const radioFalse = await radio(key, 'false', () => Config.set(key, false));

  if (await Config.get(key)) {
    radioTrue.checked = true;
  } else {
    radioFalse.checked = true;
  }

  const container = document.createElement('div');
  container.append(await text(`${key}:`), radioTrue, await text('ON'), await text(' '), radioFalse, await text('OFF'));

  return container;
};
const textField = async <K extends keyof SubType<IConfig, string>>(key: K) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.name = key;
  input.value = await Config.get(key);
  input.addEventListener('input', function() {
    Config.set(key, this.value);
  });

  const container = document.createElement('div');
  container.append(await text(`${key}:`), input);
  return container;
};

(async () => {
  const components = [radioPair('isDisplayDefault'), hr(), radioPair('enableBackgroundColor')];
  if (ENVIRONMENT === 'development') {
    components.push(hr(), textField('debugUsername'));
  }
  document.body.append(...(await Promise.all(components)));
})();
