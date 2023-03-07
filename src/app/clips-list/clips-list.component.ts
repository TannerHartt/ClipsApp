import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html'  
})
export class ClipsListComponent implements OnInit {

  constructor(public clipService: ClipService) { 
    this.clipService.getClips();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop, scrollHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === scrollHeight;

    if (bottomOfWindow) {
      this.clipService.getClips();
    }
  }

}
