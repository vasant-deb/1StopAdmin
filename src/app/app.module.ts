import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'; // Add this line
import { HttpClientModule } from '@angular/common/http'; // add this line
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductOrderComponent } from './product-order/product-order.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NewproductOrderComponent } from './newproduct-order/newproduct-order.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { BulkEditComponent } from './bulk-edit/bulk-edit.component';

import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ProductsComponent,
    EditProductComponent,
    ProductOrderComponent,
    NewproductOrderComponent,
    SalesOrderComponent,
    BulkEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
