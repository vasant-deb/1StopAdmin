
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  productId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];

  product: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
    });
    this.getProductDetails(this.productId);
  
  }
 
  getProductDetails(id: number) {
   
    const data = { id };
    this.http.post(apiUrl+'admingetuser', data).subscribe((response: any) => {
      this.product = response.product;
  
      this.product.active=response.product.active;
      if(this.product.active=="0"){
        this.product.active='';
      }
    });
  }
 
 

  updateProduct() {

    const url = `updateuser`;
    const formData = new FormData();
    formData.append('id', this.productId.toString());
    formData.append('first_name', this.product.first_name);
    formData.append('last_name', this.product.last_name);
    formData.append('middle_name', this.product.middle_name);
    formData.append('email', this.product.email);
    formData.append('phone', this.product.phone);
    formData.append('gst', this.product.gst);
    formData.append('user_password', this.product.user_password);
 
    if (this.product.active === '' || this.product.active === false) {
      this.product.active = '0';
    } else {
      this.product.active = '1';
    }
   
  
    formData.append('active', this.product.active);
    formData.append('doc_type', this.product.doc_type);
   
  
    
  
    this.http.post(apiUrl+url, formData).subscribe((response: any) => {
      console.log(response); // log success message or handle response as needed
      this.snackBar.open('Updated Successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.getProductDetails(this.productId);
    });
  }
  
}