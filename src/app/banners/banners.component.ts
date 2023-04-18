
  import { Component, OnInit,ChangeDetectorRef,ElementRef,ViewChild} from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { MatSnackBar } from '@angular/material/snack-bar';
  
  import { environment } from '../../environment';
  import { NgxSpinnerService } from 'ngx-spinner';
  
  import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

  interface Product {
    id: number;
    name: string;
    image: string;
    selected: boolean;
  }
  // access the API URL like this:
  
    // access the API URL like this:
    const apiUrl = environment.apiUrl;
    
    @Component({
      selector: 'app-banners',
      templateUrl: './banners.component.html',
      styleUrls: ['./banners.component.css']
    })
    export class BannersComponent implements OnInit {
      @ViewChild('dropListContainer') dropListContainer?: ElementRef;
      multiSelect: boolean = false;
      selectedProducts: any[] = [];
  
      categories: any[] = [];
      selectedCategoryId: number = 0;
      products: any[] = [];
      assetsUrl = environment.assetsUrl;
      dropListReceiverElement?: HTMLElement;
      dragDropInfo?: {
      dragIndex: number;
      dropIndex: number;
    };
      constructor(private spinner:NgxSpinnerService,private changeDetectorRef: ChangeDetectorRef,private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }
    
      ngOnInit() {
        // Fetch all categories from the API
        this.onCategorySelect();
      }
      onCategorySelect() {
        this.spinner.show();
  
        // Fetch all products associated with the selected category from the API
        this.http.get(apiUrl + 'admingetallbanners')
        .subscribe(
        (response: any) => {
        this.products = response.products.map((product: any) => ({
        ...product,
        selected: false // Add a 'selected' property to each product and set it to false
        }));
        this.spinner.hide();
  
        },
        (error: any) => {
        console.log(error);
        }
        );
        }
        editBanner(productId: number) {
  
          this.router.navigate(['/edit-banner'], { queryParams: { id: productId  } }).then(() => {
            window.open(window.location.href, '_blank');
          });
        }
        saveProductOrder() {
          this.spinner.show();
  
          // Create an array of all product IDs in the new order
          const newOrder = this.products.map(product => product.id);
        
          // Send the new order to the server with a delay of 2 seconds
          setTimeout(() => {
            this.http.post(apiUrl + '/adminupdatebannertorder', { order: newOrder }).subscribe(response => {
              // Reload the products after updating the order
              this.snackBar.open('Updated Successfully', 'Close', {
                duration: 2000
              });
              this.onCategorySelect();
              this.spinner.hide();
  
            });
          }, 2000);
        }
    
        refresh(){
          window.location.reload();
        }

        deleteBanner(orderId: number) {
          
          if (confirm(`Are you sure you want to delete Banner Id #${orderId}?`)) {
            this.spinner.show();
            this.http.post<any>(apiUrl+'admindeletebanner', { id: orderId })
              .subscribe(
                (response) => {
                  console.log(response);
                  this.onCategorySelect();
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
      
    
    
  
    
  
        drop(event: CdkDragDrop<string[]>) {
          moveItemInArray(this.products, event.previousIndex, event.currentIndex);
        }
  
    
    }
  