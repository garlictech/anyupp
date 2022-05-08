import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerUploadFormComponent } from './banner-upload-form.component';
import { ButtonUIComponent } from '../../ui-widgets/button-ui/button-ui.component';
import {
  AbsImageCompressorService,
  AbsStorageService,
  AbsUnitAdBannerService,
  AbsUnitRepository,
} from '@bgap/domain';
import {
  MockImageCompressionService,
  MockStorageService,
  MockUnitAdBannerService,
  MockUnitRepositoryService,
} from '../../services';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploaderUIComponent } from '../../ui-widgets/file-uploader-ui/file-uploader-ui.component';

describe('BannerUploadFormComponent', () => {
  let component: BannerUploadFormComponent;
  let fixture: ComponentFixture<BannerUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BannerUploadFormComponent,
        ButtonUIComponent,
        FileUploaderUIComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AbsUnitAdBannerService, useClass: MockUnitAdBannerService },
        { provide: AbsStorageService, useClass: MockStorageService },
        {
          provide: AbsImageCompressorService,
          useClass: MockImageCompressionService,
        },
        { provide: AbsUnitRepository, useClass: MockUnitRepositoryService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerUploadFormComponent);
    component = fixture.componentInstance;
    component.unitId = 'dummyUnitId';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
