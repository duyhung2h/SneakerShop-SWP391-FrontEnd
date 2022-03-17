import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
    <h1>Hello World</h1>
    <notifier-container></notifier-container>
  `,
})
export class AppComponent {
  title = 'SneakerShop-frontend';
  constructor(private router: Router){
    this.router.routeReuseStrategy.shouldReuseRoute = () => true;
  }
}
