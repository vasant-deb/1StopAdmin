import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';


// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Order {
  id: number;
  customer_name: string;
  customer_email:string;
  customer_phone:string;
  total: number;
  item_count: number;
  status: string;
  shipping_method:string;
  shipping_address:string;
  created:string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {


  assetsUrl = environment.assetsUrl;
  orders: Order[] = [];
  displayedOrders: Order[] = [];
  currentPage = 1;
  pageSize = 50;
  searchText = '';
order:any;
details:any;
 
  constructor(private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllOrders();
    this.getdetails();
  }
  getdetails(){
    this.http.get<any>(apiUrl+'admingetdetails')
      .subscribe(
        (response: any) => {
          console.log(response);
          this.details = response.stats;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getAllOrders() {
    this.http.get<Order[]>(apiUrl+'admingetorders')
      .subscribe(
        (response: Order[]) => {
          console.log(response);
          this.orders = response;
          this.displayedOrders = response.slice(0, this.pageSize);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedOrders = this.orders.slice(startIndex, endIndex);
  }
  
  viewOrder(orderId: number) {
    this.router.navigate(['/view-order'], { queryParams: { id: orderId  } }).then(() => {
      window.open(window.location.href, '_blank');
    });
  }

  deleteOrder(orderId: number) {
    if (confirm(`Are you sure you want to delete Order Id #${orderId}?`)) {
      this.http.post<any>(apiUrl+'admindeleteorder', { id: orderId })
        .subscribe(
          (response) => {
            console.log(response);
            this.getAllOrders();
            this.snackBar.open(response.message, 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  updateStatus(event: Event, orderId: number) {
   
    const newstatus = (event.target as HTMLSelectElement).value;
    this.http.post<any>(apiUrl+'adminupdateorderstatus', { id: orderId, status: newstatus })
      .subscribe(
        (response) => {
          console.log(response);
          this.getAllOrders();
          if (response.status == 'success') {
            this.snackBar.open('Updated', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
          if (response.status == 'failed') {
            this.snackBar.open('Failed', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  
  /*
  updateStatus(orderId: number) {
    debugger;
  
    const newstatus = this.order.status;

    this.http.post<any>(apiUrl+'adminupdateorderstatus', { id: orderId, status: newstatus })
      .subscribe(
        (response) => {
          console.log(response);
          this.getAllOrders();
          if (response.status == 'success') {
            this.snackBar.open('Updated', 'Close', {
              duration: 2000
            });
          }
          if (response.status == 'failed') {
            this.snackBar.open('Failed', 'Close', {
              duration: 2000
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  */
  onSearch() {
    if (!this.searchText) {
      this.displayedOrders = this.orders.slice(0, this.pageSize);
    } else {
      const filteredProducts = this.orders.filter(
        (order) => order.customer_name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.displayedOrders = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }
}
