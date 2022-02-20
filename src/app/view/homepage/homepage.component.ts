import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/Category';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  carouselWidth = 1000;

  listCategory: Category[] = [];


  images = [
    { path: './assets/img/carousel/slide1.jpg' },
    { path: './assets/img/carousel/slide2.jpg' },
    { path: './assets/img/carousel/slide3.png' },
    { path: './assets/img/carousel/slide4.png' },
    { path: './assets/img/carousel/slide5.png' }
  ]

  constructor(private router: Router) {

  }

  ngOnInit(): void {

  }
}
