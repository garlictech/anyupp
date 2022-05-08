import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploaderUIComponent } from './file-uploader-ui.component';
import { ButtonUIComponent } from '../button-ui/button-ui.component';

describe('FileUploaderUIComponent', () => {
  let component: FileUploaderUIComponent;
  let fixture: ComponentFixture<FileUploaderUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploaderUIComponent, ButtonUIComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploaderUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
