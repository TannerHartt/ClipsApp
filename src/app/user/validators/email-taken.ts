import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {

  constructor(private auth: AngularFireAuth) {
  }

  // Custom validator that calls the firebase function to check if the emailTaken property on the form control is true.
  validate = (control: AbstractControl): Promise<ValidationErrors | null> =>     {
    return this.auth.fetchSignInMethodsForEmail(control.value).then(
      response => response.length ? { emailTaken: true } : null
    );
  }
}
