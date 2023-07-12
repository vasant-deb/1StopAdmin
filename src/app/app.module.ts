import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
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
import { AddProductComponent } from './add-product/add-product.component';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxSpinnerModule } from 'ngx-spinner';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryOrderComponent } from './category-order/category-order.component';
import { BannersComponent } from './banners/banners.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { OrdersComponent } from './orders/orders.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { DeviceOrderComponent } from './device-order/device-order.component';
import { SettingsComponent } from './settings/settings.component';

import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditOrderComponent } from './edit-order/edit-order.component';


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
    BulkEditComponent,
    AddProductComponent,
    CategoriesComponent,
    EditCategoryComponent,
    AddCategoryComponent,
    CategoryOrderComponent,
    BannersComponent,
    AddBannerComponent,
    EditBannerComponent,
    OrdersComponent,
    ViewOrderComponent,
    UsersComponent,
    EditUserComponent,
    DeviceOrderComponent,
    SettingsComponent,
    DashboardComponent,
    EditOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CanvasJSAngularChartsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    DragDropModule,
    NgxPaginationModule,
    NgSelectModule,
    NgxSpinnerModule,
    MatSelectModule
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
