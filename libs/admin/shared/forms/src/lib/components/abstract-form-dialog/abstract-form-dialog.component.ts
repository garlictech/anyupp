import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { ToasterService } from '@bgap/admin/shared/utils';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'bgap-abstract-form-dialog',
  template: '',
})
export class AbstractFormDialogComponent {
  public dialogForm!: FormGroup;
  protected _dataService: DataService;
  protected _formBuilder: FormBuilder;
  protected _toasterService: ToasterService;
  private _nbDialogRef: NbDialogRef<unknown>;

  constructor(protected _injector: Injector) {
    this._nbDialogRef = this._injector.get(NbDialogRef);
    this._dataService = this._injector.get(DataService);
    this._formBuilder = this._injector.get(FormBuilder);
    this._toasterService = this._injector.get(ToasterService);
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
