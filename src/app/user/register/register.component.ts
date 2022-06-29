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
  age = new FormControl('',[Validators.required]);
  password = new FormControl('', [Validators.required, Validators.minLength(5)]);
  confirm_password = new FormControl('', [Validators.required]);
  number = new FormControl('',[Validators.required]);


  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    number: this.number
  });

}
