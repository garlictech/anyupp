import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'bgap-form-color-picker',
  templateUrl: './form-color-picker.component.html',
  styleUrls: ['./form-color-picker.component.scss'],
})
export class FormColorPickerComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() caption = ''; // Language key!!!
  public color = '';

  ngOnInit(): void {
    this.color = this.control?.value || '#fff';
  }

  public onChange($event: string): void {
    this.control?.setValue($event);
  }
}
