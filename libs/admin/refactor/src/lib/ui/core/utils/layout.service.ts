import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, shareReplay } from 'rxjs/operators';

@Injectable()
export class LayoutService {
  protected layoutSize$ = new Subject();
  protected layoutSizeChange$ = this.layoutSize$.pipe(
    shareReplay({ refCount: true }),
  );

  public changeLayoutSize() {
    this.layoutSize$.next();
  }

  public onChangeLayoutSize(): Observable<unknown> {
    return this.layoutSizeChange$.pipe(delay(1));
  }

  public onSafeChangeLayoutSize(): Observable<unknown> {
    return this.layoutSizeChange$.pipe(debounceTime(350));
  }
}
