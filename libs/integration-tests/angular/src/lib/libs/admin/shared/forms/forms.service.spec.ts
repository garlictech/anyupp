import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsService } from '@bgap/admin/refactor';
import { StoreModule } from '@ngrx/store';

describe('FormsService', () => {
  let service: FormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, StoreModule.forRoot({})],
    });

    service = TestBed.inject(FormsService);
  });

  it('createProductVariantFormGroup should create form group', () => {
    expect(service.createProductVariantFormGroup().value).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  it('createProductAvailabilityFormGroup should create form group', () => {
    expect(
      service.createProductAvailabilityFormGroup().value,
    ).toMatchSnapshot();
  });

  it('createCustomDailyScheduleFormGroup should create form group', () => {
    expect(
      service.createCustomDailyScheduleFormGroup().value,
    ).toMatchSnapshot();
  });

  it('createLaneFormGroup should create form group', () => {
    expect(service.createLaneFormGroup().value).toMatchSnapshot({
      id: expect.any(String),
    });
  });

  it('createProductConfigSetFormGroup should create form group', () => {
    expect(service.createProductConfigSetFormGroup().value).toMatchSnapshot();
  });

  it('createProductConfigSetItemFormGroup should create form group', () => {
    expect(
      service.createProductConfigSetItemFormGroup().value,
    ).toMatchSnapshot();
  });

  it('createRkeeperFormGroup should create form group with anyupp password', () => {
    expect(service.createRkeeperFormGroup().value).toMatchSnapshot();
  });

  it('createRkeeperFormGroup should create form group without anyupp password', () => {
    expect(service.createRkeeperFormGroup().value).toMatchSnapshot();
  });

  it('createRatingPolicyFormGroup should create form group ', () => {
    expect(service.createRatingPolicyFormGroup().value).toMatchSnapshot();
  });

  it('createTipPolicyFormGroup should create form group ', () => {
    expect(service.createTipPolicyFormGroup().value).toMatchSnapshot();
  });

  it('createServiceFeePolicyFormGroup should create form group ', () => {
    expect(service.createServiceFeePolicyFormGroup().value).toMatchSnapshot();
  });

  it('addUnitTipPercent should add percent value to an array', () => {
    expect(service.addUnitTipPercent('10', [])).toMatchInlineSnapshot(`
      Array [
        10,
      ]
    `);
    expect(service.addUnitTipPercent('30', [10, 20])).toMatchInlineSnapshot(`
      Array [
        10,
        20,
        30,
      ]
    `);
    expect(service.addUnitTipPercent('20', [10, 30])).toMatchInlineSnapshot(`
      Array [
        10,
        20,
        30,
      ]
    `);
  });

  it('removeUnitTipPercent should remove percent value from an array', () => {
    expect(service.removeUnitTipPercent('10', [])).toMatchInlineSnapshot(
      `Array []`,
    );
    expect(service.removeUnitTipPercent('10', [10, 20, 30]))
      .toMatchInlineSnapshot(`
      Array [
        20,
        30,
      ]
    `);
    expect(service.removeUnitTipPercent('30', [10, 20, 30]))
      .toMatchInlineSnapshot(`
      Array [
        10,
        20,
      ]
    `);
    expect(service.removeUnitTipPercent('33', [10, 20])).toMatchInlineSnapshot(`
      Array [
        10,
        20,
      ]
    `);
  });
});
