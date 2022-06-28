import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {

  @Input() modalId: string = '';

  constructor(public modal: ModalService, public elRef: ElementRef) { }

  ngOnInit(): void {
    document.body.appendChild(this.elRef.nativeElement);
  }

  closeModal() {
    this.modal.toggleModal(this.modalId);
  }

}
