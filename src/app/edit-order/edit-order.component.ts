

import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {
  productId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];

  product: any = {};
  selectedItems: any[] = [];

  order_items:any[]=[];
  orders:any={};
  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
    });
    this.getProductDetails(this.productId);
  }
getid(){
  this.route.queryParams.subscribe((params) => {
    this.productId = params['id'];
  });
  this.getProductDetails(this.productId);
}
  print(): void {
    // Perform any custom print logic here
    window.print();
  }
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event: Event): void {
    // Add any logic to hide the button or modify the content for printing
    // For example, you can add a CSS class to hide the button during printing
    const button = document.querySelector('button');
    if (button) {
      button.classList.add('hide-print');
    }
  }

  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event: Event): void {
    // Remove any modifications made during printing
    const button = document.querySelector('button');
    if (button) {
      button.classList.remove('hide-print');
    }
  }
  getProductDetails(orderId:number){
    this.http.post(apiUrl+'admineditinvoice', {id : this.productId}).subscribe((response: any) => {
      this.orders = response.orders;
      this.order_items = response.order_items;
    
    });
  }

  toggleItemSelection(order: any) {
    const index = this.selectedItems.indexOf(order);
    if (index === -1) {
      this.selectedItems.push(order);
    } else {
      this.selectedItems.splice(index, 1);
    }
  }

  newstatus=0;
  updateStatus() {  
    const payload = this.selectedItems.map((order: any) => {
      if(order.itemstatus==0){
        this.newstatus=1;
      }
      if(order.itemstatus==1){
        this.newstatus=0;
      }
      return {
        id: order.order_id,
        status:this.newstatus,
        productId: order.product_id,
      };
    });
  
    this.http
      .post<any>(apiUrl + 'adminupdateorderitemstatus', payload)
      .subscribe(
        (response) => {
          console.log(response);
          this.getid();
          
          if (response.status === 'success') {
            this.snackBar.open('Updated', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
          if (response.status === 'failed') {
            this.snackBar.open('Failed', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
          window.location.reload();
        },
        (error) => {
          console.log(error);
        }
      );
  }


}
