import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-static-text',
  templateUrl: './form-static-text.component.html',
  styleUrls: ['./form-static-text.component.scss'],
})
export class FormStaticTextComponent {
  @Input() caption = ''; // Language key!!!
  @Input() staticCaption?: string;
  @Input() value = '';
}
