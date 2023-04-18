import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';


// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Product {
  id: number;
  name: string;
  price: number;
  image:string;
  active:number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  assetsUrl = environment.assetsUrl;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPage = 1;
  pageSize = 50;
  searchText = '';
 
  constructor(private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    
    this.http.get<Product[]>(apiUrl+'admingetproducts')
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.products = response;
          this.displayedProducts = response.slice(0, this.pageSize);
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
  copyProduct(productId: number) {
    this.http.post<any>(apiUrl+'admincopyproduct', { id: productId })
      .subscribe(
        (response) => {
          console.log(response);
          this.snackBar.open(response.message, 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.getAllProducts();
          //this.router.navigate(['/edit-product'], { queryParams: { id: response.id } });
          const editUrl = `${window.location.origin}/edit-product?id=${response.id}`;
          const newWindow = window.open(editUrl, '_blank');
          if (newWindow !== null) {
            newWindow.focus();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  editProduct(productId: number) {
  /*
    this.router.navigate(['/edit-product'], { queryParams: { id: productId  } }).then(() => {
      window.open(window.location.href, '_blank');
    });
    */
    const editUrl = `${window.location.origin}/edit-product?id=${productId}`;
    const newWindow = window.open(editUrl, '_blank');
    if (newWindow !== null) {
      newWindow.focus();
    }
   
  }

  deleteProduct(productId: number, productName: string) {
    if (confirm(`Are you sure you want to delete ${productName}?`)) {
      this.http.post<any>(apiUrl+'admindeleteproduct', { id: productId })
        .subscribe(
          (response) => {
            console.log(response);
            this.getAllProducts();
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

  updateStatus(productId: number) {
    debugger;
    this.http.post<any>(apiUrl+'adminupdatestatus', { id: productId})
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
  onSearch() {
    if (!this.searchText) {
      this.displayedProducts = this.products.slice(0, this.pageSize);
    } else {
      const filteredProducts = this.products.filter(
        (product) => product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.displayedProducts = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }
}
