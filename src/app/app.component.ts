import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
    <notifier-container></notifier-container>
  `,
})
export class AppComponent {
  title = 'SneakerShop-frontend';
  
  constructor(private router: Router){
    console.log(window);
    // console.log(window.performance.memory);
    console.log(performance.getEntries());
    
    console.log(performance);
    // console.log(localStorage);
    // console.log(JSON.parse(localStorage['loadedListProductSearched']));
    // localStorage['loadedListProductSearched'] = null;
    
    // this.router.routeReuseStrategy.shouldReuseRoute = () => true;
  }
}
