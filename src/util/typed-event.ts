export type TypedEventHandler<T> = (value: T) => any;

export class TypedEvent<T> {
  private handlers: Array<TypedEventHandler<T>> = [];

  public on(handler: TypedEventHandler<T>) {
    this.handlers.push(handler);
  }

  public emit(value: T) {
    for (const handler of this.handlers) {
      handler(value);
    }
  }
}
