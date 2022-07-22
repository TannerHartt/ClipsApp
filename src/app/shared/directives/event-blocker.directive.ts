import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]'
})
export class EventBlockerDirective {

  @HostListener('drop', ['$event']) // Listens for the drop event on the element with this directive.
  @HostListener('dragover', ['$event']) // Listens for the dragover event on the element with this directive.
  public handleEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
