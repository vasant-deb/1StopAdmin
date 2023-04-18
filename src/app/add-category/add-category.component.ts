import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { NgxSpinnerService } from 'ngx-spinner';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];
  category: any = {};

  constructor(private spinner: NgxSpinnerService,private http: HttpClient, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
   this.getcategories();
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
  addCategory(){
    this.spinner.show();
    const url = `adminaddcategory`;
    const formData = new FormData();
  

    if (this.category.parent_id === '' || this.category.parent_id === false || this.category.parent_id===undefined) {
      this.category.parent_id = '0';
    } 
    

    if (this.category.active === '' || this.category.active === false || this.category.active===undefined) {
      this.category.active = '0';
    } else {
      this.category.active = '1';
    }
  
    if (this.category.top_business_category === '' || this.category.top_business_category === false || this.category.top_business_category===undefined) {
      this.category.top_business_category = '0';
    } else {
      this.category.top_business_category = '1';
    }
    formData.append('parent_id', this.category.parent_id);
    formData.append('name', this.category.name);
   
    formData.append('active', this.category.active);
    formData.append('top_business_category', this.category.top_business_category);

   
    if (this.category.image instanceof File) {
      formData.append('image', this.category.image, this.category.image.name);
    }
    
  
    this.http.post(apiUrl+url, formData).subscribe((response: any) => {
      this.spinner.hide();
      console.log(response); // log success message or handle response as needed
      this.snackBar.open('Updated Successfully', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
  
      this.router.navigate(['/categories']);
    });
  }
  
}