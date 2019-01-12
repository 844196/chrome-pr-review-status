import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { $all } from '../util/query-selector';
import { AbstractComponent } from './abstract-component';

export type State = 'fetching' | 'awaitingShow' | 'awaitingHide';

export class ToggleStatusButton extends AbstractComponent<HTMLButtonElement> {
  private get state() {
    return this.dom.dataset.state as State;
  }

  private set state(value: State) {
    this.dom.dataset.state = value;
  }

  private constructor(public readonly dom: HTMLButtonElement) {
    super();
    this.refreshState();
    this.dom.addEventListener('click', () => {
      let display: string;
      if (this.state === 'awaitingHide') {
        display = 'none';
        this.changeState('awaitingShow');
      } else {
        display = 'block';
        this.changeState('awaitingHide');
      }
      $all<HTMLDivElement>(`.${STATUS_DOM_CLASSNAME}`).forEach((status) => {
        status.style.display = display;
      });
    });
  }

  public changeState(state: State) {
    switch (state) {
      case 'fetching':
        this.state = 'fetching';
        this.dom.textContent = 'Fetching...';
        this.dom.setAttribute('disabled', 'true');
        break;
      case 'awaitingHide':
        this.state = 'awaitingHide';
        this.dom.textContent = 'Hide review status';
        this.dom.removeAttribute('disabled');
        break;
      case 'awaitingShow':
        this.state = 'awaitingShow';
        this.dom.textContent = 'Show review status';
        this.dom.removeAttribute('disabled');
        break;
    }
  }

  public updateFetchProgress(numerator: number, denominator: number) {
    if (this.state === 'fetching') {
      this.dom.textContent = `Fetching... (${numerator}/${denominator})`;
    }
  }

  public refreshState() {
    this.changeState(this.state);
  }

  public static make(initialState: State) {
    const dom = document.createElement('button');
    dom.id = TOGGLE_STATUS_BUTTON_ID;
    dom.dataset.state = initialState;
    const self = new this(dom);
    return self;
  }

  public static fromDom(dom: HTMLButtonElement) {
    const self = new this(dom);
    return self;
  }
}
