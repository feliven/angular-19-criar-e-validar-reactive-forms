import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService {
  private emailsCadastrados = ['f@g.com', 'admin@admin.gov'];

  constructor() {}

  verificarSeEmailExiste(email: string): Observable<boolean> {
    return of(this.emailsCadastrados.includes(email.toLowerCase())).pipe(
      delay(1000)
    );
  }
}
