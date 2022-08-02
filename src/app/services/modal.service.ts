import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = []; // Empty array for storing and managing custom modals.

  constructor() { }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(element => element.id === id)?.visible; // Checks if the specific modal is visible / toggled on.
  }

  toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id); // Grabs it from the DOM if it exists.

    if(modal) {
      modal.visible = !modal.visible; // Toggles visibility of a modal on/off.
    }
  }

  register(id: string) {
    this.modals.push({id, visible: true}); // Pushes a new modal with a given ID to the end of the array of modals making them known to the project.
  }

  unRegister(id: string) {
    this.modals.filter(element => element.id !== id); // Removes a specified modal from the array of modals given the ID.
  }
}


interface IModal { // Single in-class usage from tracking and managing modals given them type safety.
  id: string;
  visible: boolean;
}
