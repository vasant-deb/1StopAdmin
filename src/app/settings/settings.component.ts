import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { NgxSpinnerService } from 'ngx-spinner';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
 
    productId: number=0;
    assetsUrl = environment.assetsUrl;
    categories:any[]=[];
  
    product: any = {};
  
    constructor(private spinner:NgxSpinnerService,private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) { }
  
    ngOnInit(): void {
     
      this.getProductDetails();
    }
   
    getProductDetails() {
     
    
      this.http.get(apiUrl+'admingetsettings').subscribe((response: any) => {
        this.product = response.product;
        this.product.status=response.product.status;
      if(this.product.status=="0"){
        this.product.status='';
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
  this.spinner.show();
      const url = `updatesettings`;
      const formData = new FormData();


      formData.append('id', '1');
      formData.append('name', this.product.name);
      formData.append('email', this.product.email);
      formData.append('email_contact', this.product.email_contact);
      formData.append('address1', this.product.address1);
      formData.append('address2', this.product.address2);
      formData.append('address3', this.product.address3);
      formData.append('contact_number', this.product.contact_number);
      formData.append('contact_number2', this.product.contact_number2);
      formData.append('header_text', this.product.header_text);
      if (this.product.status === '' || this.product.status === false) {
        this.product.status = '0';
      } else {
        this.product.status = '1';
      }
      formData.append('status', this.product.status);

      if (this.product.image instanceof File) {
        formData.append('image', this.product.image, this.product.image.name);
      }
      
    
      this.http.post(apiUrl+url, formData).subscribe((response: any) => {
        console.log(response); // log success message or handle response as needed
        this.spinner.hide();
        this.snackBar.open('Updated Successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.getProductDetails();
      });
    }
    
  }