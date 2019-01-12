export abstract class AbstractComponent<T extends Element> {
  public abstract dom: T;

  public addClass(...classes: string[]): this {
    this.dom.classList.add(...classes);
    return this;
  }

  public delClass(...classes: string[]): this {
    this.dom.classList.remove(...classes);
    return this;
  }
}
