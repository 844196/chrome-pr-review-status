import { SSOT } from '../../common/ssot';
import { store } from '../../store/store';
import { h } from '../../util/create-element';

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

  ssot.watch((changed) => {
    radioTrue.checked = changed === true;
    radioFalse.checked = changed === false;
  });

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
    radioPair('isDisplayDefault', await store.isDisplayReviewStatusColumn),
    h('hr'),
    radioPair('enableBackgroundColor', await store.colorCoded),
  ];
  if (ENVIRONMENT === 'development') {
    components.push(h('hr'), textField('debugUsername', await store.loginUsername));
  }
  document.body.append(...components);
})();
