import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';
import Fuse from 'fuse.js';

import { NgxSpinnerService } from 'ngx-spinner';

// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Product {
  id: number;
  name: string;
  price: number;
  image:string;
  active:number;
  checked:boolean;
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
  filterActive: string = 'all';
  filterType: string = 'all';
  isCheckboxChecked = false;

  constructor(private spinner:NgxSpinnerService,private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProducts();
  }
  onFilterChange() {
    this.currentPage = 1;
    this.getAllProducts();
  }
  getAllProducts() {
    const filterParams: any = {
      active: this.filterActive,
      type: this.filterType === 'new' ? 'newarrival' : (this.filterType === 'sale' ? 'hot_product' : null)
    };
    this.http.get<Product[]>(apiUrl+'admingetproducts', { params: filterParams })
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.products = response;
         
          this.onSearch(); // Update displayed products after getting all products
        
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
    if (!this.searchText) {
      this.displayedProducts = this.products.slice(startIndex, endIndex);
    } else {
      const filteredProducts = this.products.filter(
        (product) => product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.displayedProducts = filteredProducts.slice(startIndex, endIndex);
    }
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
  selectAllCheckboxes() {
    const areAllChecked = this.displayedProducts.every((product) => product.checked);
    const newCheckedValue = !areAllChecked;
    
    this.displayedProducts.forEach((product) => {
      product.checked = newCheckedValue;
    });
    
    this.showblock();
  }
  showblock() {
    this.isCheckboxChecked = this.displayedProducts.some((product) => product.checked);
  }
  action(state: string) {
    this.spinner.show();
    // Retrieve all the checked checkboxes
    const checkboxes = this.displayedProducts.filter(product => product.checked);
    
    // Get the values of the checked checkboxes
    const checkedValues = checkboxes.map(product => product.id);
    
    // Use the checkedValues as needed
    const newOrderJson = JSON.stringify(checkedValues);

    // Send the new order to the server with a delay of 2 seconds
    setTimeout(() => {
      this.http.post('https://nodeapi.1stopwireless.ca/adminupdateproduct', { id: newOrderJson,action: state }).subscribe(response => {
        // Reload the products after updating the order
        this.snackBar.open('Updated Successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.spinner.hide();
this.getAllProducts();
      });
    }, 2000);
    
    // Rest of your code...
  }
  
  onSearch() {
    if (!this.searchText) {
      this.displayedProducts = this.products.slice(0, this.pageSize);
    } else {
      const searchKeywords = this.searchText.split(' '); // Split search query into separate keywords
      const fuseOptions: Fuse.IFuseOptions<Product> = {
        keys: ['name', 'id'],
        threshold: 0.4, // Adjust this to control the fuzziness of the search
        includeMatches: true,
      };
      const fuse = new Fuse(this.products, fuseOptions);
      const searchResults = fuse.search(this.searchText);
      const filteredProducts = searchResults
        .filter(result => this.matchesAllKeywords(result, searchKeywords))
        .map(result => result.item);
      this.displayedProducts = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }
  
  matchesAllKeywords(result: Fuse.FuseResult<Product>, keywords: string[]): boolean {
    if (!result.matches) {
      return false;
    }
    for (const keyword of keywords) {
      const matched = result.matches.some(match => match.value && match.value.toLowerCase().includes(keyword.toLowerCase()));
      if (!matched) {
        return false;
      }
    }
    return true;
  }
  
  

  
  
  
}
