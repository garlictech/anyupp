import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  UNPAY_INCOME_CATEGORIES_ARR,
  UNPAY_NO_INCOME_CATEGORIES_ARR,
} from '@bgap/crud-gql/api';
import { UnpayCategory } from '@bgap/domain';
import { NbDialogRef } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unpay-categories',
  templateUrl: './unpay-categories.component.html',
})
export class UnpayCategoriesComponent implements OnInit {
  public unpayCategories: UnpayCategory[] = [
    ...UNPAY_NO_INCOME_CATEGORIES_ARR,
    ...UNPAY_INCOME_CATEGORIES_ARR,
  ];
  public selectedCategory?: UnpayCategory;
  public clickCallback: (unpayCategory: UnpayCategory) => void = () => {
    /**/
  };

  constructor(
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._changeDetectorRef.detectChanges();
  }

  public select() {
    if (this.clickCallback && this.selectedCategory) {
      this.clickCallback(this.selectedCategory);
    }

    this._nbDialogRef.close();
  }

  public close() {
    this._nbDialogRef.close();
  }

  public onCategorySelected() {
    this._changeDetectorRef.detectChanges();
  }
}
