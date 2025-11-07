import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';

import { EmailValidatorService } from '../services/email-validator.service';

export function emailExisteValidator(
  emailService: EmailValidatorService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return of(emailService.verificarSeEmailExiste(control.value)).pipe(
      map((existe) => (existe ? { emailExiste: true } : null))
    );
  };
}
