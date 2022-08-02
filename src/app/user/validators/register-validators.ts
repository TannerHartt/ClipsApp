import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class RegisterValidators {


  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName); // The value entered into the 'Password' section in the form.
      const matchingControl = group.get(matchingControlName); // The value entered into the 'Confirm Password' section in the form.

      if(!control || !matchingControl) { // If either form controls are null/empty then return.
        console.error('Form Controls cannot be found in the form group');
        return { controlNotFound: false };
      }

      // Check if the two values entered by the user match, if they don't it returns null, if they do it sets the noMatch property to true.
      const error = control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    }

  }
}
