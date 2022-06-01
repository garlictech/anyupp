import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationToggleComponent } from './notification-toggle.component';
import { ToggleButtonUiComponent } from '../../ui-widgets/toggle-button-ui/toggle-button-ui.component';
import { ButtonUIComponent } from '../../ui-widgets/button-ui/button-ui.component';
import { AbsNotificationToggleService } from '@bgap/domain';
import { MockNotificationToggleService } from '../../services';

describe('NotificationToggleComponent', () => {
  let component: NotificationToggleComponent;
  let fixture: ComponentFixture<NotificationToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NotificationToggleComponent,
        ToggleButtonUiComponent,
        ButtonUIComponent,
      ],
      providers: [
        {
          provide: AbsNotificationToggleService,
          useClass: MockNotificationToggleService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
