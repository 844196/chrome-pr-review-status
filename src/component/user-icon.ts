import { AbstractComponent } from './abstract-component';

export class UserIcon extends AbstractComponent<HTMLImageElement> {
  public readonly dom: HTMLImageElement;

  public constructor(url: string) {
    super();

    const dom = document.createElement('img');
    dom.src = url;
    dom.style.marginRight = '2px';
    dom.style.marginLeft = '2px';

    this.dom = dom;

    this.addClass('avatar')
      .setWidth('20px')
      .setHeight('20px');
  }
}
