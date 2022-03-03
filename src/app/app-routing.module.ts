import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from 'src/app/view/homepage/homepage.component'
import { CartlistComponent } from 'src/app/view/cartlist/cartlist.component';
import { FullProductListComponent } from './view/full-product-list/full-product-list.component';
import { ErrorPageComponent } from './view/error-page/error-page.component';

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
    component: HomepageComponent
  },
  {
    path: 'product-list',
    component: FullProductListComponent
  },
  {
    path: 'cart',
    component: CartlistComponent
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
