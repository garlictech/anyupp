import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-color-picker',
  templateUrl: './form-color-picker.component.html',
  styleUrls: ['./form-color-picker.component.scss'],
})
export class FormColorPickerComponent implements OnInit {
  @Input() control: FormControl;
  @Input() caption: string; // Language key!!!
  public color: string;

  ngOnInit(): void {
    this.color = this.control.value || '#fff';
  }

  public onChange($event: any): void {
    this.control.setValue($event);
  }
}
