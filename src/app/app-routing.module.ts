import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from 'src/app/view/homepage/homepage.component'
import { CartlistComponent } from 'src/app/view/cartlist/cartlist.component';
import { FullProductListComponent } from './view/full-product-list/full-product-list.component';

const routes: Routes = [
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
