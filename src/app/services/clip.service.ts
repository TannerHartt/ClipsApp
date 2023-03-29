import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { iClip } from '../models/clip.model'  ;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<iClip | null> {
   public clipsCollection: AngularFirestoreCollection<iClip>
   pageClips: iClip[] = []; // An array of clips to be displayed on the home page.
   pendingRequest: boolean = false; // To track if a request is pending.

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage, private router: Router) {
     this.clipsCollection = db.collection('clips'); // Grabs the 'clips' collection found in firebase (A list of all clips uploaded by the user).
  }

  createClip(data: iClip) : Promise<DocumentReference<iClip>> {
     return this.clipsCollection.add(data); // Inserts a document into the 'clips' collection on firebase created in the constructor.
  }

  getUserClips(sort$: BehaviorSubject<string>) {
     return combineLatest([this.auth.user, sort$]).pipe(
       switchMap(values => {
         const [user, sort] = values;

         if (!user) {
           return of([]); // If user is null (not logged in) it returns an empty array.
         }

         // Variable to check if the uid property is equal to the uid of the currently logged-in user, if so it returns the document.
         const query = this.clipsCollection.ref.where('uid', '==', user.uid)
           .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');

         return query.get(); // If the query was successful then it grabs an array of all clips that user has uploaded.
       }),
       map(snapshot => (snapshot as QuerySnapshot<iClip>).docs)
     );
  }

  updateClip(id: string, title: string) {
     return this.clipsCollection.doc(id).update({ // Allows you to grab a document by its id from firebase.
       title
     }); // Then updates the title property in the specified clip (Allows user to change the title of any clip they upload).
  }

  async deleteClip(clip: iClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`); // Creates a reference to the desired clip to delete.
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`); // Creates a reference to the desired screenshot to delete.
    await clipRef.delete(); // Deletes the reference to the specific clip in firebase.
    await screenshotRef.delete(); // Deletes the reference to the specific screenshot in firebase.
    await this.clipsCollection.doc(clip.docId).delete(); // Deletes the clip and its data in the clips collection in firebase.
  }

  async getClips() {
    if (this.pendingRequest) return; // If a request is pending then it returns.
  
    this.pendingRequest = true; // If a request is not pending then it sets the pendingRequest property to true.
    let query = this.clipsCollection.ref
      .orderBy('timestamp', 'desc') // Grabs all clips from the clips collection in firebase and orders them by the timestamp property in descending order.
      .limit(6); // Limits the amount of clips to 6.

    const { length } = this.pageClips; // Grabs the length of the pageClips array.

    if (length) {
      const lastDocID = this.pageClips[length - 1].docId; // Grabs the last document id in the pageClips array.
      const lastDoc = await this.clipsCollection.doc(lastDocID).get().toPromise(); // Grabs the last document in the pageClips array.

      query = query.startAfter(lastDoc); // Starts the query after the last document in the pageClips array.
    }

    const snapshot = await query.get(); // Grabs the query and stores it in a variable called snapshot.

    snapshot.forEach(doc => {
      this.pageClips.push({
        docId: doc.id,
        ...doc.data(),
      });
    }); 

    this.pendingRequest = false; // Sets the pendingRequest property to false.
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): iClip | Observable<iClip | null> | Promise<iClip | null> | null {
     return this.clipsCollection.doc(route.params.id)
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data();

          if (!data) {
            this.router.navigate(['/']);
            return null;
          }

          return data;
        })
      )
  }
}
