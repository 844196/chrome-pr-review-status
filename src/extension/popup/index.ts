import { Config as IConfig } from '../../domain/config';
import * as Config from '../../external/config';
import { h } from '../../util/create-element';

const radioPair = async <K extends keyof SubType<IConfig, boolean>>(configName: K) => {
  const radio = (checked: boolean, onChange: () => void) =>
    h('input', {
      props: {
        type: 'radio',
        name: configName,
        checked,
      },
      on: {
        change: onChange,
      },
    });

  const initial = await Config.get(configName);
  const radioTrue = radio(initial === true, () => Config.set(configName, true));
  const radioFalse = radio(initial === false, () => Config.set(configName, false));

  return h('div', [`${configName}: `, h('label', [radioTrue, 'ON']), ' ', h('label', [radioFalse, 'OFF'])]);
};

const textField = async <K extends keyof SubType<IConfig, string>>(configName: K) =>
  h('div', [
    `${configName}: `,
    h('input', {
      props: { type: 'text', value: await Config.get(configName) },
      on: {
        input() {
          Config.set(configName, this.value);
        },
      },
    }),
  ]);

(async () => {
  const components = [radioPair('isDisplayDefault'), h('hr'), radioPair('enableBackgroundColor')];
  if (ENVIRONMENT === 'development') {
    components.push(h('hr'), textField('debugUsername'));
  }
  document.body.append(...(await Promise.all(components)));
})();
