import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Product {
  id: number;
  name: string;
  image: string;
  selected: boolean;
}
// access the API URL like this:
const apiUrl = environment.apiUrl;

@Component({
  selector: 'app-newproduct-order',
  templateUrl: './newproduct-order.component.html',
  styleUrls: ['./newproduct-order.component.css']
})
export class NewproductOrderComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: number = 0;
  products: any[] = [];
  assetsUrl = environment.assetsUrl;

  constructor(private changeDetectorRef: ChangeDetectorRef,private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    // Fetch all categories from the API
    this.onCategorySelect();
  }


  onCategorySelect() {
    // Fetch all products associated with the selected category from the API
    this.http.post(apiUrl + 'admingetpageproduct', { type: 'newarrival' })
    .subscribe(
    (response: any) => {
    this.products = response.products.map((product: any) => ({
    ...product,
    selected: false // Add a 'selected' property to each product and set it to false
    }));
    },
    (error: any) => {
    console.log(error);
    }
    );
    }
    
    drop(event: CdkDragDrop<string[]>) {
      // Get the selected products
      const selectedProducts = this.products.filter(product => product.selected);
    
      // Move the selected products to the new positions
      if (selectedProducts.length) {
        const currentIndex = event.currentIndex;
        const firstSelectedIndex = this.products.indexOf(selectedProducts[0]);
        const previousIndex = firstSelectedIndex < currentIndex ? currentIndex - selectedProducts.length : currentIndex;
        for (let i = 0; i < selectedProducts.length; i++) {
          const selectedProduct = selectedProducts[i];
          const index = previousIndex + i;
          moveItemInArray(this.products, this.products.indexOf(selectedProduct), index);
        }
        this.saveProductOrder();
      }
    }
    
saveProductOrder() {
  // Create an array of all product IDs in the new order
  const newOrder = this.products.map(product => product.id);

  // Send the new order to the server
  this.http.post(apiUrl + '/adminupdateproductorder', { order: newOrder }).subscribe(response => {
    // Reload the products after updating the order

    this.snackBar.open('Updated Successfully', 'Close', {
      duration: 2000
    });

    this.onCategorySelect();
  });
}

toggleProductSelection(product: any) {
  // Toggle the 'selected' property of the product
  product.selected = !product.selected;

  // Highlight the product when it is selected
  const element = document.querySelector(`[id="${product.id}"]`);
  if (element) {
    if (product.selected) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  }
}

}
