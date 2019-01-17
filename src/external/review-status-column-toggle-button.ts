import { fromNullable } from 'fp-ts/lib/Option';
import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { TypedEvent } from '../common/typed-event';

type ButtonState = 'initialized' | 'fetching' | 'awaitingHide' | 'awaitingShow';
const buttonState = (v: string | undefined) => fromNullable<ButtonState>(v as any);

const textMap: { [_ in ButtonState]: string } = {
  initialized: 'Please wait...',
  fetching: 'Fetching...',
  awaitingHide: `${octicons.fold.toSVG()}&nbsp;Hide review status`,
  awaitingShow: `${octicons.unfold.toSVG()}&nbsp;Show review status`,
};

export class ReviewStatusColumnToggleButton {
  public readonly click = new TypedEvent<boolean>();
  private readonly state: SSOT<ButtonState>;

  public constructor(public readonly dom: HTMLButtonElement) {
    this.state = new SSOT(buttonState(this.dom.dataset.state).getOrElse('initialized'))
      .onChange((state) => {
        this.dom.dataset.state = state;
      })
      .onChangeWithRun(this.onStateChange.bind(this));
    this.dom.addEventListener('click', this.onClick.bind(this));
  }

  public get isAwaitClick() {
    return this.state.value === 'awaitingHide' || this.state.value === 'awaitingShow';
  }

  public fetchStart() {
    this.state.change('fetching');
  }

  public updateProgress(current: number, all: number) {
    if (this.state.value === 'fetching') {
      this.dom.innerHTML = `Fetching... (${current}/${all})`;
    }
  }

  public fetchComplete(isDisplay: boolean) {
    this.changeStateByIsDisplay(isDisplay);
  }

  public changeStateByIsDisplay(isDisplay: boolean) {
    this.state.change(isDisplay ? 'awaitingHide' : 'awaitingShow');
  }

  private onStateChange(state: ButtonState) {
    this.dom.disabled = state === 'initialized' || state === 'fetching';
    this.dom.innerHTML = textMap[state];
  }

  private onClick() {
    const currentState = this.state.value;
    this.click.emit(currentState === 'awaitingShow');
    this.state.change(currentState === 'awaitingShow' ? 'awaitingHide' : 'awaitingShow');
  }
}
