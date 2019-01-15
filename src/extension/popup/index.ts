import * as Config from '../../external/config';
import { h } from '../../util/create-element';
import { SSOT } from '../../util/ssot';

const radioPair = (name: string, ssot: SSOT<boolean>) => {
  const radio = (checked: boolean, onChange: () => void) =>
    h('input', {
      props: {
        type: 'radio',
        name,
        checked,
      },
      on: {
        change: onChange,
      },
    });

  const initial = ssot.value;
  const radioTrue = radio(initial === true, () => ssot.change(true));
  const radioFalse = radio(initial === false, () => ssot.change(false));

  return h('div', [`${name}: `, h('label', [radioTrue, 'ON']), ' ', h('label', [radioFalse, 'OFF'])]);
};

const textField = (name: string, ssot: SSOT<string>) =>
  h('div', [
    `${name}: `,
    h('input', {
      props: {
        type: 'text',
        value: ssot.value,
      },
      on: {
        input() {
          ssot.change(this.value);
        },
      },
    }),
  ]);

(async () => {
  const components = [
    radioPair(
      'isDisplayDefault',
      new SSOT(await Config.get('isDisplayDefault'), (changed) => Config.set('isDisplayDefault', changed)),
    ),
    h('hr'),
    radioPair(
      'enableBackgroundColor',
      new SSOT(await Config.get('enableBackgroundColor'), (changed) => Config.set('enableBackgroundColor', changed)),
    ),
  ];
  if (ENVIRONMENT === 'development') {
    components.push(
      h('hr'),
      textField(
        'debugUsername',
        new SSOT(await Config.get('debugUsername'), (changed) => Config.set('debugUsername', changed)),
      ),
    );
  }
  document.body.append(...components);
})();
