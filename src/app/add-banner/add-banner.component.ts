import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environment';
import { NgxSpinnerService } from 'ngx-spinner';

const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {
  categoryId: number=0;
  assetsUrl = environment.assetsUrl;
  categories:any[]=[];
  category: any = {};

  constructor(private spinner :NgxSpinnerService,private http: HttpClient, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  
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

  addCategory(){
this.spinner.show();
    const url = `adminaddbanner`;
    const formData = new FormData();
  

    
    formData.append('name', this.category.name);
   
   

   
    if (this.category.image instanceof File) {
      formData.append('image', this.category.image, this.category.image.name);
    }
    
  
    this.http.post(apiUrl+url, formData).subscribe((response: any) => {
      console.log(response); // log success message or handle response as needed
    
        /** spinner ends after 5 seconds */
        this.spinner.hide();
     
        this.snackBar.open('Updated Successfully', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
  
      this.router.navigate(['/banners']);
    });
  }
  
}