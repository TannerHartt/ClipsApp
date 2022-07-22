import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ClipService } from '../../services/clip.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  isDragOver: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertMsg: string = 'Please wait! Your clip i being uploaded.';
  inSubmission: boolean = false;
  percentage: number = 0;
  showPercentage: boolean = false;
  user: firebase.User | null = null;


  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true // Makes the title input not able to be empty.
  });

  uploadForm = new FormGroup({
    title: this.title
  });

  constructor(private storage: AngularFireStorage, private auth: AngularFireAuth, private clipsService: ClipService) {
    auth.user.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
  }

  storeFile(event: Event) {
    this.isDragOver = false;

    // Nullish coalescing statement that grabs the file from the dataTransfer object in the browser in the first index position [0];
    // If the file/item is empty it returns null.
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      return; // Restricts the function to only run if the uploaded file is not null or isn't a video/mp4.
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, '')); // Regular expression
    this.nextStep = true;
    console.log(this.file); // Logs the file object along with its metadata.

  }

  uploadFile() {
    this.uploadForm.disable();
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`; // Creates designated file directory in firebase for video storage.

    this.showAlert = true; // For custom alert component
    this.alertColor = 'blue'; // For custom alert component
    this.alertMsg = 'Please wait! Your clip is being updated.'; // For custom alert component
    this.inSubmission = true;
    this.showPercentage = true;

    const task = this.storage.upload(clipPath, this.file);
    const clipReference = this.storage.ref(clipPath); // Creates a reference to the specific location of a file.

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100; // Corrects the percentage format from range from 0-100% completion.
    });

    task.snapshotChanges().pipe(
      last(), // Grabs the last item emitted by the observable returned by the snapshotChanges function (most recent).
      switchMap(() => clipReference.getDownloadURL())
    ).subscribe({
      next: (url) => { // Runs if the observable successfully completes the subscription.
        const clip = { // Creates a clip object and filling it necessary data from the observable.
          uid: this.user?.uid as string, // Grabs the unique id for the file.
          displayName: this.user?.displayName as string, // Grabs the display name of the user that uploaded the file.
          title: this.title.value, // Grabs the title specified by the user when uploading.
          fileName: `${clipFileName}.mp4`, // Grabs the original file name as it was when uploaded from users pc.
          url // Grabs the url where the file upload can be found.
        };
        this.clipsService.createClip(clip);
        console.log(clip); // Logs the clip object with all metadata filled.

        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip is now uploaded.'; // Update to display success message.
        this.showPercentage = false;
      },
      error: (error) => { // Runs if an error occurred during the subscription / while viewing the observable.
        this.uploadForm.enable(); // Enables the form controls if there is an error.
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed, please try again later.'; // Update to display error message.
        this.inSubmission = true;
        this.showPercentage = false;
        console.error(error); // Logs the error object with its addition data.
      }
    });
  }
}
