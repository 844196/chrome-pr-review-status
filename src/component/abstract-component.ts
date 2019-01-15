export abstract class AbstractComponent<T extends HTMLElement> {
  public abstract dom: T;

  public setId(id: string): this {
    this.dom.id = id;
    return this;
  }

  public addClass(...classes: string[]): this {
    this.dom.classList.add(...classes);
    return this;
  }

  public delClass(...classes: string[]): this {
    this.dom.classList.remove(...classes);
    return this;
  }

  public setWidth(width: string): this {
    this.dom.style.width = width;
    return this;
  }

  public setHeight(height: string): this {
    this.dom.style.height = height;
    return this;
  }
}
