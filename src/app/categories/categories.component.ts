import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';


// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Category {
  id: number;
  name: string;
  image:string;
  active:number;
  tag:number;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  assetsUrl = environment.assetsUrl;
  categories: Category[] = [];
  displayedCategories: Category[] = [];
  currentPage = 1;
  pageSize = 50;
  searchText = '';
 
  constructor(private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    
    this.http.get<Category[]>(apiUrl+'admingetallcategories')
      .subscribe(
        (response: Category[]) => {
          console.log(response);
          this.categories = response;
          this.displayedCategories = response.slice(0, this.pageSize);
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
    this.displayedCategories = this.categories.slice(startIndex, endIndex);
  }

  editCategory(categoryId: number) {
  
    this.router.navigate(['/edit-category'], { queryParams: { id: categoryId  } }).then(() => {
      window.open(window.location.href, '_blank');
    });
  }

  deleteCategory(categoryId: number, categoryName: string) {
    if (confirm(`Are you sure you want to delete ${categoryName}?`)) {
      this.http.post<any>(apiUrl+'admindeletecategory', { id: categoryId })
        .subscribe(
          (response) => {
            console.log(response);
            this.getAllCategories();
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
   
    this.http.post<any>(apiUrl+'adminupdatecategorystatus', { id: productId})
      .subscribe(
        (response) => {
          console.log(response);
          this.getAllCategories();
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
  updateTagStatus(productId: number) {
   
    this.http.post<any>(apiUrl+'adminupdatecategorytag', { id: productId})
      .subscribe(
        (response) => {
          console.log(response);
          this.getAllCategories();
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
  refresh(){
    window.location.reload();
  }
  onSearch() {
    if (!this.searchText) {
      this.displayedCategories = this.categories.slice(0, this.pageSize);
    } else {
      const filteredProducts = this.categories.filter(
        (category) => category.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.displayedCategories = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }
}
