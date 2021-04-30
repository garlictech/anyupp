import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ALLERGENS } from '@bgap/admin/shared/utils';
import { IAllergen } from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-allergens',
  templateUrl: './form-allergens.component.html',
  styleUrls: ['./form-allergens.component.scss'],
})
export class FormAllergensComponent {
  @Input() caption = ''; // Language key!!!
  @Input() control!: FormControl;

  public allergens = ALLERGENS;

  public allergenIsChecked(allergen: IAllergen): boolean {
    return (
      (this.control?.value || [])
        .indexOf(allergen.id) >= 0
    );
  }

  public toggleAllergen(allergen: IAllergen): void {
    const allergensArr: string[] = this.control?.value;
    const idx = allergensArr.indexOf(allergen.id);

    if (idx < 0) {
      allergensArr.push(allergen.id);
    } else {
      allergensArr.splice(idx, 1);
    }
    this.control?.setValue(allergensArr);
  }
}
