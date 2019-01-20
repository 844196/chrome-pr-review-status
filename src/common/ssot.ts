import { TypedEvent, TypedEventHandler } from './typed-event';

export class SSOT<T> {
  private readonly managedValueChange = new TypedEvent<T>();

  public constructor(private managedValue: T, handler?: TypedEventHandler<T>) {
    if (handler) {
      this.watch(handler);
    }
  }

  get value() {
    return this.managedValue;
  }

  public watch(handler: TypedEventHandler<T>) {
    this.managedValueChange.on(handler);
    return this;
  }

  public watchImmediately(handler: TypedEventHandler<T>) {
    handler(this.managedValue);
    this.watch(handler);
    return this;
  }

  public pipe(other: SSOT<T>) {
    this.watch((value) => other.change(value));
    return this;
  }

  public change(given: T) {
    this.managedValue = given;
    this.managedValueChange.emit(given);
  }

  public emit() {
    this.managedValueChange.emit(this.managedValue);
  }
}
