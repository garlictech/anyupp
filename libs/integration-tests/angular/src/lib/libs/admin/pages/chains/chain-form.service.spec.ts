import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ChainFormService } from '@bgap/admin/pages/chains';

describe('ChainFormService', () => {
  let service: ChainFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [ChainFormService],
    });

    service = TestBed.get(ChainFormService);
  });

  it('#createChainFormGroup should create chain form', () => {
    expect(service.createChainFormGroup().value).toMatchSnapshot();
  });
});
