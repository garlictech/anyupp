import { ComponentFixture, TestBed } from '@angular/core/testing';
import { commonStorybookMockedImports } from '../../pure';
import { ToggleButtonUiComponent } from './toggle-button-ui.component';
import { ButtonUIComponent } from '../button-ui/button-ui.component';

describe('ToggleButtonUiComponent', () => {
  let component: ToggleButtonUiComponent;
  let fixture: ComponentFixture<ToggleButtonUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleButtonUiComponent, ButtonUIComponent],
      imports: [...commonStorybookMockedImports],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleButtonUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
