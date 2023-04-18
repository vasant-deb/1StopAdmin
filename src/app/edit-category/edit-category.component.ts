
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];

  category: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.categoryId = params['id'];
    });
    this.getCategoryDetails(this.categoryId);
    this.getcategories();
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
  getCategoryDetails(id: number) {
   
    const data = { id };
    this.http.post(apiUrl+'admingetcategory', data).subscribe((response: any) => {
      this.category = response.category;
  
      this.category.active=response.category.active;
      if(this.category.active=="0"){
        this.category.active='';
      }
      this.category.top_business_category=response.category.top_business_category;
      if(this.category.top_business_category=="0"){
        this.category.top_business_category='';
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
      this.category[imageType] = formData.get(imageType);
    }
  }
  
  
  
  onFileChange(event: Event, fieldName: string) {
    if (event.target && event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.category[fieldName] = file;
    }
  }

  updateCategory() {

    const url = `updatecategory`;
    const formData = new FormData();
    formData.append('id', this.categoryId.toString());
    formData.append('name', this.category.name);
    formData.append('parent_id', this.category.parent_id);
 
    if (this.category.active === '' || this.category.active === false) {
      this.category.active = '0';
    } else {
      this.category.active = '1';
    }
    if (this.category.top_business_category === '' || this.category.top_business_category === false) {
      this.category.top_business_category = '0';
    } else {
      this.category.top_business_category = '1';
    }
   
  
    formData.append('active', this.category.active);
    formData.append('top_business_category', this.category.top_business_category);
  
    
    console.log(this.category.image);
  
    if (this.category.image instanceof File) {
      formData.append('image', this.category.image, this.category.image.name);
    }
  
  
    this.http.post(apiUrl+url, formData).subscribe((response: any) => {
      console.log(response); // log success message or handle response as needed
      this.snackBar.open('Updated Successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.getCategoryDetails(this.categoryId);
    });
  }
  
}