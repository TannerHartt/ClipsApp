import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = new FormControl('', [Validators.minLength(4), Validators.required]);
  email = new FormControl('', [Validators.email, Validators.required]);
  age = new FormControl('',[Validators.required, Validators.min(18), Validators.max(120)]);
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
  });

  register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait while your account is being created';
    this.alertColor = 'blue';
  }

}
