import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { iClip } from '../models/clip.model'  ;


@Injectable({
  providedIn: 'root'
})
export class ClipService {
   public clipsCollection: AngularFirestoreCollection<iClip>

  constructor(private db: AngularFirestore) {
     this.clipsCollection = db.collection('clips');
  }

  async createClip(data: iClip) {
     await this.clipsCollection.add(data);
  }

}
