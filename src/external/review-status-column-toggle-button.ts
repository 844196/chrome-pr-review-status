import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { TypedEvent } from '../common/typed-event';
import { store } from '../store/store';

type ButtonState = 'initialized' | 'displayProgress' | 'awaitingClick';

export class ReviewStatusColumnToggleButton {
  private constructor(
    private readonly button: Button,
    public readonly $data: {
      readonly state: SSOT<ButtonState>;
      readonly progress: {
        readonly value: SSOT<number>;
        readonly max: SSOT<number>;
      };
    },
  ) {}

  public static async mount($ele: HTMLButtonElement) {
    const isDisplayReviewStatusColumn = await store.isDisplayReviewStatusColumn;

    const button = await Button.mount($ele, {
      content: new SSOT(''),
      dataset: new SSOT({}),
      disabled: new SSOT(true),
    });
    button.$on.click.on(() => {
      const inverted = !isDisplayReviewStatusColumn.value;
      isDisplayReviewStatusColumn.change(inverted);
    });

    const self = new this(button, {
      state: new SSOT<ButtonState>('initialized'),
      progress: {
        value: new SSOT(0),
        max: new SSOT(0),
      },
    });

    isDisplayReviewStatusColumn.watch(self.computeButtonLabel.bind(self));
    self.$data.state.watch(self.computeButtonLabel.bind(self)).watch(self.computeClickable.bind(self));
    self.$data.progress.value.watch(self.computeButtonLabel.bind(self));
    self.$data.progress.max.watch(self.computeButtonLabel.bind(self));

    await self.computeClickable();
    await self.computeButtonLabel();

    return self;
  }

  private async computeClickable() {
    this.button.$props.disabled.change(this.$data.state.value !== 'awaitingClick');
  }

  private async computeButtonLabel() {
    switch (this.$data.state.value) {
      case 'initialized':
        this.button.$props.content.change('Please wait...');
        break;
      case 'displayProgress':
        const progressText = `${this.$data.progress.value.value}/${this.$data.progress.max.value}`;
        this.button.$props.content.change(`Fetching... (${progressText})`);
        break;
      case 'awaitingClick':
        const text = (await store.isDisplayReviewStatusColumn).value
          ? `${octicons.fold.toSVG()}&nbsp;Hide review status`
          : `${octicons.unfold.toSVG()}&nbsp;Show review status`;
        this.button.$props.content.change(text);
        break;
    }
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
