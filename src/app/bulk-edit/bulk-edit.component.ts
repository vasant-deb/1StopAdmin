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
  image:string;
  price: number;
  category_id:number;
  active: string;
  changed: boolean; // add the 'changed' property here
}
@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.css']
})

export class BulkEditComponent implements OnInit {
  assetsUrl = environment.assetsUrl;
  products: Product[] = [];
  filteredProducts: any[] = []; // initialize an array to hold the filtered products data
categories:any[]=[];
  displayedProducts: Product[] = [];
  searchTerm: string = ''; // initialize a search term variable
  currentPage: number = 1; // initialize a current page variable
  selectedCategoryId: number = 0;

  pageSize = 50;
  searchText = '';
 
  

  constructor(private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllProducts();
    this.getcategories();
  }

  getAllProducts() {
    
    this.http.get<Product[]>(apiUrl+'admingetproducts')
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.products = response;
          this.filteredProducts = response; // assign the data to the filteredProducts array

          this.displayedProducts = response.slice(0, this.pageSize);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  saveChanges() {
    const changedProducts = this.products.filter(product => product.changed);

    this.http.post<any>(apiUrl+'adminupdatemyproduct',changedProducts).subscribe(
      response => {
        console.log(response);
        this.getAllProducts();
        if(response.status=='success'){
        this.snackBar.open('Updated', 'Close', {
          duration: 2000
        });
      }
      if(response.status=='failed'){
        this.snackBar.open('Failed', 'Close', {
          duration: 2000
        });
      }
      },
      error => {
        // handle error
      }
    );
  }
  getcategories() {
    this.http.get<any>(apiUrl + 'admingetcategories')
      .subscribe(
        (response: any) => {
          this.categories = response;

        },
        (error) => {
          console.log(error);
        }
      );
  }
 

  onCategorySelect() {
    this.filterProducts();
  }
 filterProducts() {
    // filter the products array based on the search term and selected category
    this.filteredProducts = this.products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const categoryMatch = this.selectedCategoryId === 0 || product.category_id === this.selectedCategoryId;
      return nameMatch && categoryMatch;
    });
    
    // reset the displayed products array
    this.displayedProducts = this.filteredProducts.slice(0, this.pageSize);
  }





}
