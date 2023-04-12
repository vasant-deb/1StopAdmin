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
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'edit-product', component: EditProductComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'product-order', component: ProductOrderComponent },
  { path: 'newproduct-order', component: NewproductOrderComponent },
  { path: 'sales-order', component: SalesOrderComponent },
  { path: 'bulk-edit', component: BulkEditComponent },
  { path: '**', redirectTo: '/404' }
 //{ path: 'product/:slug', component: ProductComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
