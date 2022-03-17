import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { NotifierModule, NotifierOptions } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './view/homepage/homepage.component';
import { HeaderComponent } from './view/_components/header/header.component';
import { FooterComponent } from './view/_components/footer/footer.component';
import { ProductListComponent } from './view/_components/product-list/product-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CartlistComponent } from './view/cartlist/cartlist.component';
import { OrdereditemlistComponent } from './view/_components/ordereditemlist/ordereditemlist.component';
import { FullProductListComponent } from './view/full-product-list/full-product-list.component';
import { ErrorPageComponent } from './view/error-page/error-page.component';


const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    ProductListComponent,
    CartlistComponent,
    OrdereditemlistComponent,
    FullProductListComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    IvyCarouselModule,
    NotifierModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,


    NotifierModule.withConfig(customNotifierOptions),

    BrowserAnimationsModule,
  ],
  providers: [
    FullProductListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
