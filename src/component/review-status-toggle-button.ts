import { SSOT } from '../util/ssot';
import { TypedEvent } from '../util/typed-event';
import { AbstractComponent } from './abstract-component';

type ButtonState = 'initialized' | 'fetching' | 'awaitingHide' | 'awaitingShow';

const isButtonState = (v: any): v is ButtonState =>
  ['initialized', 'fetching', 'awaitingHide', 'awaitingShow'].includes(v);

const textMap: { [_ in ButtonState]: string } = {
  initialized: 'Please wait...',
  fetching: 'Fetching...',
  awaitingHide: 'Hide review status',
  awaitingShow: 'Show review status',
};

export class ReviewStatusToggleButton extends AbstractComponent<HTMLButtonElement> {
  public readonly click = new TypedEvent<boolean>();
  private readonly state: SSOT<ButtonState>;

  public constructor(public readonly dom: HTMLButtonElement) {
    super();

    const parsedState = this.dom.dataset.state;
    this.state = new SSOT<ButtonState>(isButtonState(parsedState) ? parsedState : 'initialized')
      .onChange((state) => {
        this.dom.dataset.state = state;
      })
      .onChangeWithRun((state) => {
        this.dom.disabled = state === 'initialized' || state === 'fetching';
        this.dom.textContent = textMap[state];
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
      this.dom.textContent = `Fetching... (${current}/${all})`;
    }
  }

  public fetchComplete(isDisplay: boolean) {
    this.changeStateByIsDisplay(isDisplay);
  }

  public changeStateByIsDisplay(isDisplay: boolean) {
    this.state.change(isDisplay ? 'awaitingHide' : 'awaitingShow');
  }
}
