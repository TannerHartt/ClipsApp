import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ClipService } from '../../services/clip.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragOver: boolean = false; // To track if a file is being dragged over an element.
  file: File | null = null; // To store and manage the file uploaded by the user.
  nextStep: boolean = false; // To track if the first part of file upload was successful, prevents the continuation of the upload if an error occurs.
  showAlert: boolean = false; // To toggle alert box on/off.
  alertColor: string = 'blue'; // To make alert box an appropriate color.
  alertMsg: string = 'Please wait! Your clip i being uploaded.'; // Default alert message.
  inSubmission: boolean = false; // To disable/enable the submission button.
  percentage: number = 0; // A starting point for the upload percentage tracker.
  showPercentage: boolean = false; // Toggles the upload percentage tracker on/off.
  user: firebase.User | null = null; // To track and manage the user that is logged in.
  task?: AngularFireUploadTask; // To track and manage the upload submission task with help from firebase.


  title = new FormControl('', {
    validators: [
      Validators.required, // Makes the title form field required to be filled before form submission.
      Validators.minLength(3) // Sets the minimum clip title to 3 characters.
    ],
    nonNullable: true // Makes the title input not able to be empty. This is false by default.
  });

  uploadForm = new FormGroup({
    title: this.title // Registers the title field in the form.
  });

  constructor(private storage: AngularFireStorage, private auth: AngularFireAuth, private clipsService: ClipService, private router: Router) {
    auth.user.subscribe(user => this.user = user); // Grabs the user information from firebase.
  }

  ngOnDestroy() {
    this.task?.cancel(); // If there is a current upload, cancel it to avoid memory leak.
  }

  storeFile(event: Event) {
    this.isDragOver = false;

    // Nullish coalescing statement that grabs the file from the dataTransfer object in the browser in the first index position [0];
    // If the file/item is empty it returns null.
    this.file = (event as DragEvent).dataTransfer ?
      (event as DragEvent).dataTransfer?.files.item(0) ?? null :
      (event.target as HTMLInputElement).files?.item(0) ?? null; // Asserting type to avoid unknown element bug.
    if(!this.file || this.file.type !== 'video/mp4') { // Sets condition to
      return; // Restricts the function to only run if the uploaded file is not null or isn't a video/mp4.
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, '')); // Regular expression
    this.nextStep = true;
    console.log(this.file); // Logs the file object along with its metadata.

  }

  uploadFile() {
    this.uploadForm.disable(); // Programmatically disables the upload form to prevent duplicate submissions.
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`; // Creates designated file directory in firebase for video storage.

    this.showAlert = true; // For custom alert component
    this.alertColor = 'blue'; // For custom alert component
    this.alertMsg = 'Please wait! Your clip is being updated.'; // For custom alert component
    this.inSubmission = true; // Disables the submission button if a task is already in progress.
    this.showPercentage = true; // Shows the percentage tracker when uploading.

    this.task = this.storage.upload(clipPath, this.file);
    const clipReference = this.storage.ref(clipPath); // Creates a reference to the specific location of a file.

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100; // Corrects the percentage format from range from 0-100% completion.
    });

    this.task.snapshotChanges().pipe(
      last(), // Grabs the last item emitted by the observable returned by the snapshotChanges function (most recent).
      switchMap(() => clipReference.getDownloadURL())
    ).subscribe({
      next: async (url) => { // Runs if the observable successfully completes the subscription.
        const clip = { // Creates a clip object and filling it necessary data from the observable.
          uid: this.user?.uid as string, // Grabs the unique id for the file.
          displayName: this.user?.displayName as string, // Grabs the display name of the user that uploaded the file.
          title: this.title.value, // Grabs the title specified by the user when uploading.
          fileName: `${clipFileName}.mp4`, // Grabs the original file name as it was when uploaded from users pc.
          url, // Grabs the url where the file upload can be found.
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const clipDocRef = await this.clipsService.createClip(clip);
        console.log(clip); // Logs the clip object with all metadata filled.

        this.alertColor = 'green'; // Gives the alert background a 'success' color.
        this.alertMsg = 'Success! Your clip is now uploaded.'; // Update to display success message.
        this.showPercentage = false; // Turns the percentage tracker feature off after a successful upload.

        setTimeout(() => { // Sets a 1s delay after a successful upload, then redirects the user to the clip.
          this.router.navigate([
            'clip', clipDocRef.id
          ]);
        }, 1000);
      },
      error: (error) => { // Runs if an error occurred during the subscription / while viewing the observable.
        this.uploadForm.enable(); // Enables the form controls if there is an error.
        this.alertColor = 'red'; // Turns modal background to red to visually show there was an error.
        this.alertMsg = 'Upload failed, please try again later.'; // Update to display error message.
        this.inSubmission = true;
        this.showPercentage = false; // Resets the percentage tracker when uploading.
        console.error(error); // Logs the error object with its addition data.
      }
    });
  }
}
