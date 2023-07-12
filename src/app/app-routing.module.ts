import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';

import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductsComponent } from './products/products.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { NewproductOrderComponent } from './newproduct-order/newproduct-order.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { BulkEditComponent } from './bulk-edit/bulk-edit.component';


import { EditCategoryComponent } from './edit-category/edit-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryOrderComponent } from './category-order/category-order.component';
import { CategoriesComponent } from './categories/categories.component';

import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { BannersComponent } from './banners/banners.component';

import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';

import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';

import { DeviceOrderComponent } from './device-order/device-order.component';

import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'edit-category', component: EditCategoryComponent },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'category-order', component: CategoryOrderComponent },
  { path: 'device-order', component: DeviceOrderComponent },
  { path: 'edit-order', component: EditOrderComponent },
  { path: 'banners', component: BannersComponent },
  { path: 'edit-banner', component: EditBannerComponent },
  { path: 'add-banner', component: AddBannerComponent },

  { path: 'orders', component: OrdersComponent },
  { path: 'view-order', component: ViewOrderComponent },

  { path: 'products', component: ProductsComponent },
  { path: 'edit-product', component: EditProductComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'product-order', component: ProductOrderComponent },
  { path: 'newproduct-order', component: NewproductOrderComponent },
  { path: 'sales-order', component: SalesOrderComponent },
  { path: 'bulk-edit', component: BulkEditComponent },

  { path: 'users', component: UsersComponent },
  { path: 'edit-user', component: EditUserComponent },

  { path: 'settings', component: SettingsComponent },

  { path: '**', redirectTo: '/404' }
 //{ path: 'product/:slug', component: ProductComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
