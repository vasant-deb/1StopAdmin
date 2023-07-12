import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';

import { NgxSpinnerService } from 'ngx-spinner';
import Fuse from 'fuse.js';
// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Product {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  email:string;
  active:number,
  user_password:string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  assetsUrl = environment.assetsUrl;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPage = 1;
  pageSize = 50;
  searchText = '';
 
  constructor(private spinner:NgxSpinnerService,private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    
    this.http.get<Product[]>(apiUrl+'admingetusers')
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.products = response;
          this.displayedProducts = response.slice(0, this.pageSize);
          this.onSearch();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  updateStatus(productId: number) {
    this.http.post<any>(apiUrl+'adminupdateuserstatus', { id: productId})
      .subscribe(
        (response) => {
          console.log(response);
          this.getAllProducts();
          if(response.status=='success'){
          this.snackBar.open('Updated', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
        if(response.status=='failed'){
          this.snackBar.open('Failed', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  editProduct(productId: number) {
    this.router.navigate(['/edit-user'], { queryParams: { id: productId  } }).then(() => {
      window.open(window.location.href, '_blank');
    });
  }

  
  deleteProduct(productId: number, productName: string) {
    if (confirm(`Are you sure you want to delete ${productName}?`)) {
      this.spinner.show();
      this.http.post<any>(apiUrl+'admindeleteuser', { id: productId })
        .subscribe(
          (response) => {
            console.log(response);
            this.getAllProducts();
            this.spinner.hide();
            this.snackBar.open(response.message, 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }


  onSearch() {
    if (!this.searchText) {
      this.displayedProducts = this.products.slice(0, this.pageSize);
    } else {
      const fuse = new Fuse(this.products, {
        keys: ['name', 'email','phone','id'],
        threshold: 0.4, // adjust this to control the fuzziness of the search
        includeMatches: true
      });
      const results = fuse.search(this.searchText);
      const filteredProducts = results.map(result => result.item);
      this.displayedProducts = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }
}
