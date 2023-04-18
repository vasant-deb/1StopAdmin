import { Component, OnInit } from '@angular/core';
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


  getProductDetails(orderId:number){

   
    this.http.post(apiUrl+'adminviewinvoice', {id : this.productId}).subscribe((response: any) => {
      this.orders = response.orders;
      this.order_items = response.order_items;
    
    });


  }


}
