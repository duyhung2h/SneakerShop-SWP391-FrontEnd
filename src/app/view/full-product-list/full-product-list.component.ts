import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { UserModel } from 'src/app/model/UserModel';
import { AuthService } from 'src/app/controller/auth.service';
import { CategoryService } from 'src/app/controller/CategoryService';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { Category } from "src/app/model/Category";
import { DiscountProduct } from "src/app/model/DiscountProduct";
import { OrderDetail } from "src/app/model/OrderDetail";
import { NotifierService } from 'angular-notifier';
import { TextController } from 'src/app/controller/TextController';
import { ProductController } from 'src/app/controller/ProductController';
import { CategoryController } from 'src/app/controller/CategoryController';
declare var $: any;

@Component({
  selector: 'app-full-product-list',
  templateUrl: './full-product-list.component.html',
  styleUrls: ['./full-product-list.component.css']
})
export class FullProductListComponent implements OnInit {


  listProductSearched: DiscountProduct[] = [];
  categoryController: CategoryController = new CategoryController(this.productService,this.router,this.activatedRoute, this.authService, this.categoryService, this.favoriteProductService, this.notifier)
  /**
   * This section declare services
   * 
   * @param productService 
   * @param router 
   * @param activatedRoute 
   * @param authService 
   * @param categoryService 
   * @param favoriteProductService 
   * @param notifier 
   */
  constructor(
    private productService: DiscountProductService,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryService,
    private favoriteProductService: FavoriteProductService,
    private notifier: NotifierService,
  ) { 

  }

  ngOnInit(): void {
  }



}
