import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

const apiUrl = environment.apiUrl;


@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  productId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];

  product: any = {};
  order_items:any[]=[];
  orders:any={};
  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
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

   
    this.http.post(apiUrl+'adminviewinvoice', {id : this.productId}).subscribe((response: any) => {
      this.orders = response.orders;
      this.order_items = response.order_items;
    
    });


  }


}
