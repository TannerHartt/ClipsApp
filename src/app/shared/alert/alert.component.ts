import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() color: string = 'blue';

  constructor() { }

  ngOnInit(): void {
  }

  // a getter function to allow re-usability of this component by simply passing in the desired color when using it.
  get bgColor() {
    return `bg-${this.color}-400`;
  }
}
