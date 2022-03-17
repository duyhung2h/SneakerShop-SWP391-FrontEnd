import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from 'src/app/view/homepage/homepage.component'
import { CartlistComponent } from 'src/app/view/cartlist/cartlist.component';
import { FullProductListComponent } from './view/full-product-list/full-product-list.component';
import { ErrorPageComponent } from './view/error-page/error-page.component';
import { ProductListComponent } from './view/_components/product-list/product-list.component';
import { CheckoutComponent } from './view/checkout/checkout.component';

const routes: Routes = [
  //Wild Card Route for 404 request
  // { path: '**', pathMatch: 'full', 
  //     component: ErrorPageComponent },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: HomepageComponent
  },
  {
    path: 'product-list',
    pathMatch: 'full',
    component: FullProductListComponent
  },
  {
    path: 'checkout',
    pathMatch: 'full',
    component: CheckoutComponent
  },
  {
    path: 'cart',
    pathMatch: 'full',
    component: CartlistComponent
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
