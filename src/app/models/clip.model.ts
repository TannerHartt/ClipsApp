import firebase from 'firebase/compat/app';

export interface iClip {
  uid: string;
  displayName: string;
  title: string;
  fileName: string;
  url: string;
  timestamp: firebase.firestore.FieldValue;
  docId?: string;
  screenshotURL: string;
  screenshotFileName: string;
}
