import { React } from 'dom-chef/react';
import { SSOT } from '../../common/ssot';
import { store } from '../../store/store';

const radioPair = (name: string, ssot: SSOT<boolean>) => {
  const radio = (onChange: () => void) =>
    (<input type="radio" name={name} onChange={onChange} /> as any) as HTMLInputElement;

  const radioTrue = radio(() => ssot.change(true));
  const radioFalse = radio(() => ssot.change(false));

  ssot.watchImmediately((changed) => {
    radioTrue.checked = changed === true;
    radioFalse.checked = changed === false;
  });

  return (
    <div>
      {name}: <label>{radioTrue}ON</label> <label>{radioFalse} OFF</label>
    </div>
  );
};

const textField = (name: string, ssot: SSOT<string>) => {
  const onInput = function(this: HTMLInputElement) {
    ssot.change(this.value);
  };
  return (
    <div>
      {name}: <input type="text" value={ssot.value} onInput={onInput} />
    </div>
  );
};

(async () => {
  const components = [
    radioPair('isDisplayDefault', await store.isDisplayReviewStatusColumn),
    <hr />,
    radioPair('enableBackgroundColor', await store.colorCoded),
  ];
  if (ENVIRONMENT === 'development') {
    components.push(<hr />, textField('debugUsername', await store.loginUsername));
  }
  document.body.append(...components);
})();
