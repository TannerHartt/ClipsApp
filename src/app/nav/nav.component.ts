import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: []
})
export class NavComponent implements OnInit {


  constructor(
    public modal: ModalService,
    public auth: AuthService,
    ) {
  }

  ngOnInit(): void {
  }

  openModal(event: Event) {
    event.preventDefault(); // Prevents default browser event handling behavior.
    this.modal.toggleModal('auth'); // Toggles the given modal in the DOM.
  }
}
