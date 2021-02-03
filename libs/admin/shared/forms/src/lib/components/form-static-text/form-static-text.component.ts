import { Component, Input } from '@angular/core';

@Component({
  selector: 'bgap-form-static-text',
  templateUrl: './form-static-text.component.html',
  styleUrls: ['./form-static-text.component.scss'],
})
export class FormStaticTextComponent {
  @Input() caption = ''; // Language key!!!
  @Input() staticCaption?: string; // Language key!!!
  @Input() value = '';
}
