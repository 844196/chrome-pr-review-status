import { TypedEvent, TypedEventHandler } from './typed-event';

export class SSOT<T> {
  private readonly event = new TypedEvent<T>();

  public constructor(private self: T, handler?: TypedEventHandler<T>) {
    if (handler) {
      this.onChange(handler);
    }
  }

  get value() {
    return this.self;
  }

  public onChange(handler: TypedEventHandler<T>) {
    this.event.on(handler);
    return this;
  }

  public change(value: T) {
    this.self = value;
    this.event.emit(value);
  }
}
