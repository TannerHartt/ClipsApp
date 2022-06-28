import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() { }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(element => element.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find(element => element.id === id);

    if(modal) {
      modal.visible = !modal.visible;
    }
  }

  register(id: string) {
    this.modals.push({id, visible: true});
  }

  unRegister(id: string) {
    this.modals.filter(element => element.id !== id);
  }
}


interface IModal {
  id: string;
  visible: boolean;
}
