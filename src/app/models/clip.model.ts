import firebase from 'firebase/compat/app';

export interface iClip {
  uid: string;
  displayName: string;
  title: string;
  fileName: string;
  url: string;
  timeStamp: firebase.firestore.FieldValue;
  docId?: string;
}
