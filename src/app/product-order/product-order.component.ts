import { Component, OnInit,ChangeDetectorRef,ElementRef,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';
import { NgxSpinnerService } from 'ngx-spinner';

import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
    selector: 'app-product-order',
    templateUrl: './product-order.component.html',
    styleUrls: ['./product-order.component.css']
  })
  export class ProductOrderComponent implements OnInit {
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
  ngOnInit(): void {
    this.getcategories();
  }
    getcategories() {
      this.spinner.show();

      this.http.get<any>(apiUrl + 'admingetcategories')
        .subscribe(
          (response: any) => {
            this.categories = response;
            this.spinner.hide();

          },
          (error) => {
            console.log(error);
          }
        );
    }
  
    onCategorySelect() {
      this.spinner.show();

      // Fetch all products associated with the selected category from the API
      this.http.post(apiUrl + 'admingetcatproduct', { id: this.selectedCategoryId })
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
      
      saveProductOrder() {
        this.spinner.show();
debugger;
        // Create an array of all product IDs in the new order
        const newOrder = this.products.map(product => product.id);
      
        // Send the new order to the server with a delay of 2 seconds
        setTimeout(() => {
      //  this.http.post(apiUrl + '/adminupdateproductorder', { order: newOrder }).subscribe(response => {
         this.http.post('https://nodeapi.yusyah.com/adminupdateproductorder', { order: newOrder }).subscribe(response => {
            // Reload the products after updating the order
            this.snackBar.open('Updated Successfully', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
            this.onCategorySelect();
            this.spinner.hide();

          });
        }, 2000);
      }
  

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;
    
    this.dragDropInfo = { dragIndex, dropIndex };
    console.log('dragEntered', { dragIndex, dropIndex });
    
    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');
    
    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);
    
      // Update the product order in the products array
      moveItemInArray(this.products, dragIndex, dropIndex);
    
      // Save the updated product order
    //  this.saveProductOrder();
    }
  }
  refresh(){
    window.location.reload();
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }

  
  }
