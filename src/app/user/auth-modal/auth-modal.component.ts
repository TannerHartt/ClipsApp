import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
})
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(public modal: ModalService) { }

  ngOnInit(): void {
    this.modal.register('auth'); // Registers the 'auth' modal in the modal array for toggling in the DOM.
  }

  ngOnDestroy() {
    this.modal.unRegister('auth'); // Removes the 'auth' modal from the array and DOM.
  }


}
