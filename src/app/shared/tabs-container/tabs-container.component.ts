import {Component, OnInit, ContentChildren, AfterContentInit, QueryList} from '@angular/core';
import {TabComponent} from "../tab/tab.component";

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
})
export class TabsContainerComponent implements OnInit, AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList<TabComponent>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    );

    if (!activeTabs || activeTabs.length == 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) { // Controls which tab in the login/register modal is active.
    this.tabs?.forEach(tab => {
      tab.active = false;
    }); // Loops through list of tabs (login and register tabs) and sets them all to false.

    tab.active = true; // Then sets the correct one to true (the one being viewed).

    return false;
  }

}
