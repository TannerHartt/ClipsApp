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
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class ClipService {
   public clipsCollection: AngularFirestoreCollection<iClip>

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
     this.clipsCollection = db.collection('clips');
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
     return this.clipsCollection.doc(id).update({
       title
     }); // Allows you to grab a document by its id from firebase.
  }

  async deleteClip(clip: iClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`); // Creates a reference to the desired clip to delete.
    await clipRef.delete(); // Deletes the reference to the specific clip in firebase.
    await this.clipsCollection.doc(clip.docId).delete(); // Deletes the clip and its data in the clips collection in firebase.
  }

}
