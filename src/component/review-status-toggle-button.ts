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
  public readonly state: SSOT<ButtonState>;
  public readonly textContent: SSOT<string>;
  public readonly click = new TypedEvent<boolean>();

  public constructor(public readonly dom: HTMLButtonElement) {
    super();

    const parsedState = this.dom.dataset.state;
    this.state = new SSOT<ButtonState>(isButtonState(parsedState) ? parsedState : 'initialized');

    this.textContent = new SSOT(textMap[this.state.value]);
    this.textContent.onChange((text) => {
      this.dom.textContent = text;
    });

    this.state.onChange((state) => {
      // ボタンを押せるのは一度でも処理が完了してから
      this.dom.disabled = state === 'initialized' || state === 'fetching';
      this.dom.dataset.state = state;
      this.textContent.change(textMap[state]);
    });

    this.dom.addEventListener('click', () => {
      const currentState = this.state.value;
      this.click.emit(currentState === 'awaitingShow');
      this.state.change(currentState === 'awaitingHide' ? 'awaitingShow' : 'awaitingHide');
    });
  }
}
