import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { UNPAY_CATEGORIES_ARR } from '@bgap/crud-gql/api';
import { NbDialogRef } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unpay-categories',
  templateUrl: './unpay-categories.component.html',
})
export class UnpayCategoriesComponent implements OnInit {
  public clickCallback: (unpayCategory: CrudApi.UnpayCategory) => void = () => {
    /**/
  };
  public unpayCategories: CrudApi.UnpayCategory[] = UNPAY_CATEGORIES_ARR;
  public selectedCategory?: CrudApi.UnpayCategory;

  constructor(
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._changeDetectorRef.detectChanges();
  }

  public select(): void {
    if (this.clickCallback && this.selectedCategory) {
      this.clickCallback(this.selectedCategory);
    }

    this._nbDialogRef.close();
  }

  public close(): void {
    this._nbDialogRef.close();
  }

  public onCategorySelected(): void {
    this._changeDetectorRef.detectChanges();
  }
}
