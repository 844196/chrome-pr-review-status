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

  public onChangeWithRun(handler: TypedEventHandler<T>) {
    handler(this.value);
    this.onChange(handler);
    return this;
  }

  public pipe(other: SSOT<T>) {
    this.onChange((value) => other.change(value));
    return this;
  }

  public change(value: T) {
    this.self = value;
    this.event.emit(value);
  }

  public emit() {
    this.event.emit(this.value);
  }
}
