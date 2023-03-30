import { Component, Input, Output, OnChanges, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { iClip } from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: iClip | null = null;
  @Output() update = new EventEmitter();
  showAlert: boolean = false;
  alertMsg: string = 'Please wait, updating clip.';
  inSubmission: boolean = false;
  alertColor: string = 'blue';

  clipId = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true // Makes the title input not able to be empty.
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  });

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnInit(): void { // Adds the 'editClip' modal to the DOM when it is initialized / viewed
    this.modal.register('editClip');
  }

  ngOnDestroy() { // Removes the 'editClip' modal from the DOM when its closed / no longer being viewed.
    this.modal.unRegister('editClip');
  }

  ngOnChanges() {
    if(!this.activeClip) {
      return; // Check if the active clip object is null, if so return.
    }

    this.inSubmission = false; // Re-enables the submit button for another edit submission attempt.
    this.showAlert = false; // Toggles the alert component off.
    this.clipId.setValue(this.activeClip.docId as string); // Programmatically sets the value of the in the ID form control to the ID of the currently viewed clip.
    this.title.setValue(this.activeClip.title); // Programmatically sets the value of the title form control to the title of the currently edited clip.
  }


  async submit() { // Function used for handling the submission of the update clip form.
    if(!this.activeClip) {
      return; // If the form is submitted without a clip being selected (Active clip is null), return.
    }

    this.inSubmission = true; // Disables the submit button to prevent duplicate submissions.
    this.showAlert = true; // Toggles the alert box on.
    this.alertColor = 'blue'; // Colors the background blue to match the theme.
    this.alertMsg = 'Please wait, updating clip.'; // Information text for user.

    try {
      // Calls the function in the service to communicate with firebase with the update clip information.
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    }
    catch (error) { // Catch any errors that occur by the async operation and update alert data to indicate an error to the user.
      this.inSubmission = false; // Stops the submission process and signals an error has occurred.
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Try again later';
      return;
    }

    // If no errors occur it reaches here and emits the clip data and updates variables to reflect a successful operation.
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }

}
