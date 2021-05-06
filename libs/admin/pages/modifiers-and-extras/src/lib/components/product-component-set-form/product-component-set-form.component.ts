import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { NGXLogger } from 'ngx-logger';
import { combineLatest } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productComponentSetsSelectors } from '@bgap/admin/shared/data-access/product-component-sets';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  clearDbProperties,
  EToasterType,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import {
  EProductComponentSetType,
  IChain,
  IGroup,
  IKeyValue,
  IKeyValueObject,
  IProductComponent,
  IProductComponentSet,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import {
  getProductComponentObject,
  getProductComponentOptions,
  maxSelectionValidator,
} from '../../fn';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-set-form',
  templateUrl: './product-component-set-form.component.html',
})
export class ProductComponentSetFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy {
  public componentForm!: FormGroup;
  public productComponentSet!: IProductComponentSet;
  public chainOptions: IKeyValue[] = [];
  public typeOptions: IKeyValue[] = [];
  public productComponentOptions: IKeyValue[] = [];
  public productComponentObject: IKeyValueObject = {};
  public eProductComponentSetType = EProductComponentSetType;

  private _productComponentSets: IProductComponentSet[] = [];

  constructor(
    protected _injector: Injector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _amplifyDataService: AmplifyDataService,
    private _logger: NGXLogger,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group(
      {
        chainId: ['', [Validators.required]],
        type: ['', [Validators.required]],
        maxSelection: [''],
        name: this._formBuilder.group(
          {
            hu: ['', [this._uniqueNameValidator('hu')]],
            en: ['', [this._uniqueNameValidator('en')]],
            de: ['', [this._uniqueNameValidator('de')]],
          },
          { validators: multiLangValidator },
        ),
        description: [''],
        items: [[]],
      },
      { validators: maxSelectionValidator },
    );

    this.componentForm = this._formBuilder.group({
      productComponentId: ['', [Validators.required]],
    });

    this.typeOptions = [
      {
        key: EProductComponentSetType.EXTRAS,
        value: 'productComponentSets.type.extras',
      },
      {
        key: EProductComponentSetType.MODIFIER,
        value: 'productComponentSets.type.modifier',
      },
    ];

    // Used for the validator
    this._store
      .pipe(
        select(productComponentSetsSelectors.getAllProductComponentSets),
        untilDestroyed(this),
      )
      .subscribe((productComponentSets: IProductComponentSet[]): void => {
        this._productComponentSets = productComponentSets;
      });
  }

  ngOnInit(): void {
    if (this.productComponentSet) {
      this.dialogForm.patchValue(
        clearDbProperties<IProductComponentSet>(this.productComponentSet),
      );
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.controls.chainId.patchValue(selectedChainId);
          }
        });
    }

    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: IChain[]): void => {
        this.chainOptions = chains.map(
          (chain): IKeyValue => ({
            key: chain.id,
            value: chain.name,
          }),
        );

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._store.pipe(
        select(productComponentsSelectors.getAllProductComponents),
      ),
      this.dialogForm.controls['items'].valueChanges.pipe(
        startWith(this.dialogForm.value.items || []),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productComponents, items]: [IProductComponent[], string[]]): void => {
          this.productComponentOptions = getProductComponentOptions(
            productComponents,
            items,
          );
          this.productComponentObject = getProductComponentObject(
            productComponents,
          );

          this._changeDetectorRef.markForCheck();
        },
      );

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _uniqueNameValidator = (lang: string): ValidatorFn => (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const names = this._productComponentSets
      .filter(c => c.id !== this.productComponentSet?.id)
      .map(c => c.name[lang]);

    return names.includes(control.value) ? { existing: true } : null;
  };

  public addComponentToList(): void {
    const componentIdsArr: string[] = this.dialogForm.controls['items'].value;
    componentIdsArr.push(this.componentForm.value.productComponentId);

    this.dialogForm.controls['items'].setValue(componentIdsArr);
    this.componentForm.patchValue({ productComponentId: '' });
  }

  public removeComponentFromList(productComponentId: string): void {
    const componentsArr: string[] = (
      this.dialogForm.controls['items'].value || []
    ).filter((i: string) => i !== productComponentId);

    this.dialogForm.controls['items'].setValue(componentsArr);
  }

  public move(idx: number, change: number) {
    const componentIdsArr: string[] = this.dialogForm.controls['items'].value;
    const itemId = componentIdsArr[idx];

    componentIdsArr.splice(idx, 1);
    componentIdsArr.splice(idx + change, 0, itemId);
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = this.dialogForm.value;

      if (this.dialogForm.value.type === EProductComponentSetType.MODIFIER) {
        value.maxSelection = null;
      }

      if (this.productComponentSet?.id) {
        try {
          await this._amplifyDataService.update<IGroup>(
            'getProductComponentSet',
            'updateProductComponentSet',
            this.productComponentSet.id,
            () => value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `PRODUCT COMPONENT SET UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        try {
          await this._amplifyDataService.create(
            'createProductComponentSet',
            value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `PRODUCT COMPONENT SET INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }
}
