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

  get bgColor() {
    return `bg-${this.color}-400`;
  }
}
