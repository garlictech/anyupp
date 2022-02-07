import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-color-picker',
  templateUrl: './form-color-picker.component.html',
  styleUrls: ['./form-color-picker.component.scss'],
})
export class FormColorPickerComponent implements OnInit {
  @Input() control?: FormControl | null;
  @Input() caption = ''; // Language key!!!
  @Input() disabled = false;
  public color = '';

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.color = this.control?.value || '#ffffff';
  }

  public onChange($event: string): void {
    this.control?.setValue($event);

    this._changeDetectorRef.detectChanges();
  }
}
