import { BehaviorSubject, Observable } from 'rxjs';

const NOTIFICATION_SOUND_ASSET = '/assets/sounds/doorbell.mp3';

export abstract class AbsNotificationToggleService {
  protected _toggled: BehaviorSubject<boolean>;

  protected abstract onNotificationToggleChange(nextValue: boolean): void;

  constructor(initialToggledState: boolean) {
    this._toggled = new BehaviorSubject<boolean>(initialToggledState);
  }

  get toggled$(): Observable<boolean> {
    return this._toggled.asObservable();
  }

  public toggle(): Promise<void> {
    const nextValue = !this._toggled.value;

    this._toggled.next(nextValue);

    this.onNotificationToggleChange(nextValue);

    return Promise.resolve();
  }

  protected _playNotificationSound() {
    const audio = new Audio(NOTIFICATION_SOUND_ASSET);
    audio.load();
    void audio.play();
  }
}
