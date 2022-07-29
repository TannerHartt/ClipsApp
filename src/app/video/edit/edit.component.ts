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
    if(!this.activeClip) { // Check for if the active clip object is null.
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docId as string);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait, updating clip.';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    }
    catch (error) { // Catch any errors that occur by the async operation and reset all values if one occurs.
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
