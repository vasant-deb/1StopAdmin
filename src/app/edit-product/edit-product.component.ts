import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId: number=0;
  assetsUrl = environment.assetsUrl;

  product: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.productId = params['id'];
    });
    this.getProductDetails(this.productId);
  }

  getProductDetails(id: number) {
   
    const data = { id };
    this.http.post(apiUrl+'admingetproduct', data).subscribe((response: any) => {
      this.product = response.product;
      this.product.active=response.product.active;
      if(this.product.active=="0"){
        this.product.active='';
      }
      this.product.newarrival=response.product.newarrival;
      if(this.product.newarrival=="0"){
        this.product.newarrival='';
      }
      this.product.hot_product=response.product.hot_product;
      if(this.product.hot_product=="0"){
        this.product.hot_product='';
      }
    });
  }
 
  displayImage(event: any, imageType: string) {
    const file = event.target.files[0];
    const previewImg = document.getElementById(`${imageType}-preview`) as HTMLImageElement;
  
    if (previewImg) {
      const reader = new FileReader();
      reader.onload = (function (aImg) {
        return function (e) {
          aImg.src = e.target?.result as string || '';
        };
      })(previewImg);
      reader.readAsDataURL(file);
  
      // Append image to FormData
      const formData = new FormData();
      formData.append(imageType, file, file.name);
      this.product[imageType] = formData.get(imageType);
    }
  }
  
  
  
  onFileChange(event: Event, fieldName: string) {
    if (event.target && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.product[fieldName] = file;
    }
  }
  
  updateProduct() {

    const url = `updateproduct`;
    const formData = new FormData();
    formData.append('id', this.productId.toString());
    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('meta_title', this.product.meta_title);
    formData.append('meta_desc', this.product.meta_desc);
    formData.append('meta_keyword', this.product.meta_keyword);
  debugger;
    if (this.product.active === '' || this.product.active === false) {
      this.product.active = '0';
    } else {
      this.product.active = '1';
    }
    if (this.product.newarrival === '' || this.product.newarrival === false) {
      this.product.newarrival = '0';
    } else {
      this.product.newarrival = '1';
    }
    if (this.product.hot_product === '' || this.product.hot_product === false) {
      this.product.hot_product = '0';
    } else {
      this.product.hot_product = '1';
    }
  
    formData.append('active', this.product.active);
    formData.append('newarrival', this.product.newarrival);
    formData.append('hot_product', this.product.hot_product);
    
    console.log(this.product.image);
  
    if (this.product.image instanceof File) {
      formData.append('image', this.product.image, this.product.image.name);
    }
    if (this.product.back_image instanceof File) {
      formData.append('back_image', this.product.back_image, this.product.back_image.name);
    }
  
    this.http.post(apiUrl+url, formData).subscribe((response: any) => {
      console.log(response); // log success message or handle response as needed
      this.getProductDetails(this.productId);
    });
  }
  
}