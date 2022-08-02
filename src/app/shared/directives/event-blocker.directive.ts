import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]'
})
export class EventBlockerDirective { // Custom directive that prevents the default browser behavior for handling drag & drop events.

  @HostListener('drop', ['$event']) // Listens for the drop event on the element with this directive.
  @HostListener('dragover', ['$event']) // Listens for the dragover event on the element with this directive.
  public handleEvent(event: Event) {
    event.preventDefault(); // Prevents default browser event handling behavior.
    event.stopPropagation(); // Prevents the event from propagating in the capturing and bubbling phases.
  }

}
