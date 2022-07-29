import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import { iClip } from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder: string = '1';
  clips: iClip[] = [];
  activeClip: iClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(private route: ActivatedRoute, private router: Router, private clipService: ClipService, private modal: ModalService) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = []; // Resets the array back to empty to avoid duplicate entries.

      docs.forEach(doc => { // Loops through the docs property from firebase and stores each object in the clips array for implementation..
        this.clips.push({
          docId: doc.id,
          ...doc.data()
        });
      });
    });
  }

  async sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);

    await this.router.navigate([], { // Uses the router service to navigate to the page with the current desired query parameter / sort method.
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal(event: Event, clip: iClip) {
    event.preventDefault(); // Prevents the default behavior of the browser with handling events and reloading the page.

    this.activeClip = clip; // Sets the current clip to be edited to the class variable to be handled.

    this.modal.toggleModal('editClip'); // Toggles the modal if the given value meets a criteria.
  }

  update(event: iClip) {
    this.clips.forEach((element, index) => { // Loops through the clips array which is filled with all the clips that user has uploaded.
      if(element.docId == event.docId) { // A check to stop at the index of the array where the currently being updated clip is located.
        this.clips[index].title = event.title; // Updates the title of the clip to the new title the user entered.
      }
    });
  }

  async deleteClip(event: Event, clip: iClip) {
    event.preventDefault(); // Prevents the browser from reloading the page when the event occurs by default.

    await this.clipService.deleteClip(clip); // Calls the delete function in the service and passes it the clip to be deleted.

    this.clips.forEach((element, index) => { // Loops through the clips array and finds the clip to be deleted.
      if(element.docId == clip.docId) {
        this.clips.splice(index, 1); // Removes the clip from the array.
      }
    });
  }

}
