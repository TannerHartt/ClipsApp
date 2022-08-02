import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() modalId: string = '';

  constructor(public modal: ModalService, public elRef: ElementRef) { }

  ngOnInit(): void {
    document.body.appendChild(this.elRef.nativeElement); // Adds the element to the DOM when component is opened/ initialized.
  }

  ngOnDestroy() {
    document.body.removeChild(this.elRef.nativeElement); // Removes the element from the DOM when the modal is closed.
  }

  closeModal() {
    this.modal.toggleModal(this.modalId); // Gives functionality to the close modal when clicking the 'X' button.
  }

}
