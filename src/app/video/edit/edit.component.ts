import { Component, Input, Output, OnChanges, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { iClip } from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
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

  ngOnInit(): void { // Runs when component is initialized.
    this.modal.register('editClip');
  }

  ngOnDestroy() { // Runs when the component is destroyed.
    this.modal.unRegister('editClip');
  }

  ngOnChanges() {
    if(!this.activeClip) { // Check if the active clip object is null, if so return.
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docId as string);
    this.title.setValue(this.activeClip.title);
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
      this.inSubmission = false;
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
