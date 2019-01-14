import { TypedEvent, TypedEventHandler } from './typed-event';

export class SSOT<T> {
  private event = new TypedEvent<T>();

  public constructor(private self: T) {}

  get value() {
    return this.self;
  }

  public onChange(handler: TypedEventHandler<T>) {
    this.event.on(handler);
  }

  public change(value: T) {
    this.self = value;
    this.event.emit(value);
  }
}
