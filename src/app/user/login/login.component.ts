import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  }

  // Default custom alert property values.
  showAlert = false;
  alertMsg = 'Please wait, we are logging you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true; // Toggles the custom alert modal on.
    this.alertMsg = 'Please wait, we are logging you in.'; // Resets the alert message back to it default.
    this.alertColor = 'blue'; // Sets the alert background to the default blue to match the theme.
    this.inSubmission = true;
    try {
      // Calls the firebase provided sign in method and passes in the user credentials to check if they are registered.
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
    } catch(e) { // If an error occurs... ==>
        this.inSubmission = false;
        this.alertMsg = 'An unexpected error occurred, please try again later'; // Sets a new message indicating an error.
        this.alertColor = 'red'; // Sets the background to an alerting color of red.
        return // Ends the login attempt and returns from the function.
    }

    // If no error occurs it reaches the success properties.
    this.alertMsg = 'Success! You are logged in'; // Display message indicating success.
    this.alertColor = 'green'; // Makes the background green.
  }

}
