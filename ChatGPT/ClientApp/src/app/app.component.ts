import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styles:[`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
  `],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
}
