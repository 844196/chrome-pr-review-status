import { config } from '../../external/config';
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
    radioPair('isDisplayDefault', await config.isDisplayDefault),
    h('hr'),
    radioPair('enableBackgroundColor', await config.enableBackgroundColor),
  ];
  if (ENVIRONMENT === 'development') {
    components.push(h('hr'), textField('debugUsername', await config.debugUsername));
  }
  document.body.append(...components);
})();
