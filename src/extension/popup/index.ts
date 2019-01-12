import * as Config from '../../external/config';

type StringBoolean = 'true' | 'false';

const text = (value: string) => document.createTextNode(value);
const radio = (name: string, value: StringBoolean) => {
  const dom = document.createElement('input');
  dom.type = 'radio';
  dom.name = name;
  dom.value = value;
  return dom;
};

class BooleanPairRadio {
  public readonly dom: HTMLDivElement;

  public constructor(name: string, initial: boolean, on: (value: boolean) => void) {
    const radioTrue = radio(name, 'true');
    const radioFalse = radio(name, 'false');

    if (initial) {
      radioTrue.checked = true;
    } else {
      radioFalse.checked = true;
    }

    radioTrue.addEventListener('change', () => on(true));
    radioFalse.addEventListener('change', () => on(false));

    const container = document.createElement('div');
    container.append(text(`${name}:`), radioTrue, text('ON'), text(' '), radioFalse, text('OFF'));

    this.dom = container;
  }
}

(async () => {
  document.body.append(
    new BooleanPairRadio('isDisplayDefault', await Config.get('isDisplayDefault'), (value) =>
      Config.set('isDisplayDefault', value),
    ).dom,
    document.createElement('hr'),
    new BooleanPairRadio('enableBackgroundColor', await Config.get('enableBackgroundColor'), (value) =>
      Config.set('enableBackgroundColor', value),
    ).dom,
  );
})();
