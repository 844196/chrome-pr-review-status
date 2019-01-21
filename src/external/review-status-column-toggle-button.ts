import { fromNullable } from 'fp-ts/lib/Option';
import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { TypedEvent } from '../common/typed-event';
import { store } from '../store/store';

type ButtonState = 'initialized' | 'displayProgress' | 'awaitingClick';
const ButtonState = (v: string | undefined) => fromNullable<ButtonState>(v as any);

export class ReviewStatusColumnToggleButton {
  private constructor(
    public readonly $data: {
      readonly state: SSOT<ButtonState>;
      readonly text: SSOT<string>;
      readonly awaitingText: SSOT<string>;
      readonly progress: {
        readonly value: SSOT<number>;
        readonly max: SSOT<number>;
      };
    },
  ) {}

  public static async mount($ele: HTMLButtonElement) {
    const buttonProps: Button['$props'] = {
      content: new SSOT(''),
      dataset: new SSOT({}),
      disabled: new SSOT(true),
    };
    const button = await Button.mount($ele, buttonProps);
    const isDisplayReviewStatusColumn = await store.isDisplayReviewStatusColumn;
    button.$on.click.on(() => {
      const inverted = !isDisplayReviewStatusColumn.value;
      isDisplayReviewStatusColumn.change(inverted);
    });

    const $data: ReviewStatusColumnToggleButton['$data'] = {
      state: new SSOT(ButtonState($ele.dataset.state).getOrElse('initialized'), (changed) =>
        button.$props.dataset.change({ state: changed }),
      ),
      text: new SSOT(''),
      awaitingText: new SSOT(''),
      progress: {
        value: new SSOT(0),
        max: new SSOT(0),
      },
    };

    isDisplayReviewStatusColumn.watchImmediately((changed) => {
      const text = changed
        ? `${octicons.fold.toSVG()}&nbsp;Hide review status`
        : `${octicons.unfold.toSVG()}&nbsp;Show review status`;
      $data.awaitingText.change(text);

      if ($data.state.value === 'awaitingClick') {
        $data.text.change($data.awaitingText.value);
      }
    });

    $data.text.pipe(button.$props.content);

    $data.state
      .watchImmediately((changed) => {
        switch (changed) {
          case 'initialized':
            $data.text.change('Please wait...');
            break;
          case 'displayProgress':
            $data.text.change('Fetching...');
            break;
          case 'awaitingClick':
            $data.text.change($data.awaitingText.value);
            break;
        }
      })
      .watchImmediately((changed) => button.$props.disabled.change(changed !== 'awaitingClick'));

    $data.progress.value.watch((changed) => {
      button.$props.content.change(`Fetching... (${changed}/${$data.progress.max.value})`);
    });

    return new this($data);
  }
}

class Button {
  private constructor(
    public readonly $props: {
      content: SSOT<string>;
      dataset: SSOT<{ [key: string]: string | undefined }>;
      disabled: SSOT<boolean>;
    },
    public readonly $on: {
      click: TypedEvent<void>;
    },
  ) {}

  public static async mount($ele: HTMLButtonElement, $props: Button['$props']) {
    $props.content.watchImmediately((changed) => {
      $ele.innerHTML = changed;
    });

    $props.dataset.watchImmediately((changed) => {
      for (const [k, v] of Object.entries(changed)) {
        $ele.dataset[k] = v;
      }
    });

    $props.disabled.watchImmediately((changed) => {
      $ele.disabled = changed;
    });

    const click = new TypedEvent<void>();
    $ele.addEventListener('click', () => click.emit());

    return new this($props, { click });
  }
}
