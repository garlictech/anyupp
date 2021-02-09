import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

export class TranslateServiceStub {
  public get(key: unknown): unknown {
    return of(key);
  }
}

xdescribe('AppComponent', (): void => {
  beforeEach(
    waitForAsync((): void => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, TranslateModule],
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub }
        ],
        declarations: [AppComponent]
      }).compileComponents();
    })
  );

  it('should create the app', (): void => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fa-admin'`, (): void => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('fa-admin');
  });

  it('should render title', (): void => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain(
      'fa-admin app is running!'
    );
  });
});
