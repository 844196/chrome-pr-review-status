import { h } from '../util/create-element';
import { AbstractComponent } from './abstract-component';

export class UserIcon extends AbstractComponent<HTMLImageElement> {
  public readonly dom: HTMLImageElement;

  public constructor(src: string) {
    super();

    this.dom = h('img', {
      props: {
        src,
      },
      class: 'avatar',
      style: {
        marginLeft: '2px',
        marginRight: '2px',
        width: '20px',
        height: '20px',
      },
    });
  }
}
