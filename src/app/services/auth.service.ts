import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IUser } from '../models/user.model';
import { map, Observable, delay, filter, switchMap, of } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private router: Router, private route: ActivatedRoute) {
    this.usersCollection = db.collection('users'); // Grabs the 'users' collection found in our firebase server and stores it in a variable for use throughout the app.
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(event => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false;
    });
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error('Password not provided'); // Throw error if the user did not enter a password when registering.
    }

    // Make a call to the firebase function to create a user with the email and password they entered.
    const userCreds = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);

    if(!userCreds.user) {
      throw new Error('User not found!'); // Throws an error if the user was not correctly created / is null.
    }

    // Sets the unique data entered by the user to their account / profile information.
    await this.usersCollection.doc(userCreds.user.uid).set({
      name: userData.name, // User name.
      email: userData.email, // User email.
      age: userData.age, // User age.
      number: userData.number // User phone number.
    });

    // Gives the user a unique display name property to refer to the account as.
    await userCreds.user.updateProfile({
      displayName: userData.name,
    });
  }

  public async logout($event?: Event) {
    if($event) { // If an event happens, prevent the default browser behavior of refreshing the page.
      $event.preventDefault();
    }
    await this.auth.signOut(); // Call the firebase given sign out method

    if(this.redirect) {
      await this.router.navigateByUrl('/'); // Automatically redirects user to the home page of an unauthorized user.
    }
  }
}
