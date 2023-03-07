import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  constructor(private auth: AuthService, private emailTaken: EmailTaken) { }

  inSubmission = false;

  name = new FormControl('', [Validators.minLength(4), Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required], [this.emailTaken.validate]);
  age = new FormControl<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]);
  password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  confirm_password = new FormControl('', [Validators.required]);
  number = new FormControl('',[Validators.required, Validators.minLength(13), Validators.maxLength(13)]);

  showAlert: boolean = false;
  alertMsg: string = 'Please wait while your account is being created.';
  alertColor: string = 'blue';

  registerForm = new FormGroup({ // Programmatically store and handle the values entered into the register form and form validation.
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    number: this.number
  }, [RegisterValidators.match('password', 'confirm_password')]);

  async register() {
    this.showAlert = true; // Toggles the alert component on.
    this.alertMsg = 'Please wait while your account is being created'; // Displays relevant submission message.
    this.alertColor = 'blue';
    this.inSubmission = true; // Toggles the circle loader and percentage tracker.

    try {
        // Calls the firebase provided create user function and passes in the values entered by the user in the register form.
        await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) { // If an error occurs, display relevant info to the user indicating an error occurred.
        console.log(e);
        this.alertMsg = 'An unexpected error occurred';
        this.alertColor = 'red';
        this.inSubmission = false;
        return; // End function compilation and return.
    }

    // If no error occurs if reaches these success properties indicating a successful account registration.
    this.alertMsg = 'Success! Your account has been created';
    this.alertColor = 'green';
  }

}
