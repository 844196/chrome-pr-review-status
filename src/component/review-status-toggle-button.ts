import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { TypedEvent } from '../common/typed-event';

type ButtonState = 'initialized' | 'fetching' | 'awaitingHide' | 'awaitingShow';

const isButtonState = (v: any): v is ButtonState =>
  ['initialized', 'fetching', 'awaitingHide', 'awaitingShow'].includes(v);

const textMap: { [_ in ButtonState]: string } = {
  initialized: 'Please wait...',
  fetching: 'Fetching...',
  awaitingHide: `${octicons.fold.toSVG()}&nbsp;Hide review status`,
  awaitingShow: `${octicons.unfold.toSVG()}&nbsp;Show review status`,
};

export class ReviewStatusToggleButton {
  public readonly click = new TypedEvent<boolean>();
  private readonly state: SSOT<ButtonState>;

  public constructor(public readonly dom: HTMLButtonElement) {
    const parsedState = this.dom.dataset.state;
    this.state = new SSOT<ButtonState>(isButtonState(parsedState) ? parsedState : 'initialized')
      .onChange((state) => {
        this.dom.dataset.state = state;
      })
      .onChangeWithRun((state) => {
        this.dom.disabled = state === 'initialized' || state === 'fetching';
        this.dom.innerHTML = textMap[state];
      });

    this.dom.addEventListener('click', () => {
      const currentState = this.state.value;
      this.click.emit(currentState === 'awaitingShow');
      this.state.change(currentState === 'awaitingShow' ? 'awaitingHide' : 'awaitingShow');
    });
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
}
