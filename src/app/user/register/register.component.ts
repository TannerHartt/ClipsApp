import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    number: this.number
  }, [RegisterValidators.match('password', 'confirm_password')]);

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait while your account is being created';
    this.alertColor = 'blue';
    this.inSubmission = true;


    try {
        await this.auth.createUser(this.registerForm.value as IUser);
    } catch (e) {
        console.log(e);
        this.alertMsg = 'An unexpected error occurred';
        this.alertColor = 'red';
        this.inSubmission = false;
        return;
    }
    this.alertMsg = 'Success! Your account has been created';
    this.alertColor = 'green';
  }

}
