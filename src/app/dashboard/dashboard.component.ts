import { Component ,OnInit} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environment';


// access the API URL like this:
import Fuse from 'fuse.js';
// access the API URL like this:
const apiUrl = environment.apiUrl;

interface Product {
  id: number;
  first_name: string;
  company: string;
  last_name: string;
  phone: string;
  email:string;
  total_cart_items:number;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chart: any;
  chartOptions:any;

  productview=false;
  salesview=false;
  userview=false;
  chartLeastOptions:any;
  chartmonthly:any;
  chartdaily:any;
  chartmonthlyuser:any;
  chartdailyuser:any;
  userlist:any;
  chartpie:any;
  chartmap:any;
  chartcitymap:any;
  salesstats:any;
  salesstatss:any;
  charttopproduct:any;
  chartdata:any;
  chartleastproduct:any;
  tablemin:any;
  tablemax:any;
  mtd:any;
  ytm:any;
  prostats:any;
  userstats:any;
  totalcategories:any;
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentPage = 1;
  pageSize = 50;
  searchText = '';
  role='';
  constructor(private http: HttpClient,private router: Router, private snackBar: MatSnackBar) { }

	ngOnInit(): void {
    this.checkauth();
    this.initial();
    this.salesanalytics();
    this.salesmonthly();
    this.piechart();
  }
  checkauth(){
   
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
   if(email && token){
    const requestData = {
      email:email,
      token:token
    };
  //start
  this.http.get<any>(apiUrl + 'admincheckauth', { params: requestData })
        .subscribe(
          response => {
            if(response.error===false && response.role=='superadmin'){
             
            }else if(response.error===false && response.role=='admin'){
              this.router.navigate(['/products']);
            }else{
              this.router.navigate(['/login']);
            }
          
          },
          error => {
            // Handle any errors from the API request
          }
        );
  //end
   }


  }
  initial(){
    this.productview=false;
    this.salesview=true;
    this.userview=false;
    this.salesstats=true;
    this.salesmonthly();
   
  }

  viewproducts(){
    this.productview=true;
    this.salesview=false;
    this.userview=false;
    this.salesstats=false;
  }

  viewusers(){
    this.productview=false;
    this.salesview=false;
    this.userview=true;
    this.salesstats=false;
    this.getAllProducts();
  }
 

 
 
 
  getAllProducts() {
    
    this.http.get<Product[]>(apiUrl+'admingetdashusers')
      .subscribe(
        (response: Product[]) => {
          console.log(response);
          this.products = response;
          this.displayedProducts = response.slice(0, this.pageSize);
          this.onSearch();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSearch() {
    if (!this.searchText) {
      this.displayedProducts = this.products.slice(0, this.pageSize);
    } else {
      const fuse = new Fuse(this.products, {
        keys: ['name', 'email','phone','id'],
        threshold: 0.4, // adjust this to control the fuzziness of the search
        includeMatches: true
      });
      const results = fuse.search(this.searchText);
      const filteredProducts = results.map(result => result.item);
      this.displayedProducts = filteredProducts.slice(0, this.pageSize);
    }
    this.currentPage = 1;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.products.slice(startIndex, endIndex);
  }

  chartpro(data:any){
    this.charttopproduct = {
      title:{
        text: "Top Selling Products"  
      },
      animationEnabled: true,
      data: [{        
        type: "column",
        dataPoints: data.map((item: any) => ({
          label: item.product_name,
          y: parseFloat(item.total_orders)        
        }))
      }]
    }	
  }



  salesanalytics(){
    this.http.get<any>(apiUrl + 'admindashboardusers')
    .subscribe(
      (response: any) => {
        console.log(response);
        this.salesstats = response.stats;
        this.chartmaxbuyer(response.stats);
     	 this.chartminbuyer(response.chartdata);
        this.mapchart(response.provincedata);
        this.mapcitychart(response.citydata);
        this.userstats=response.userstats;
        this.userlist=response.userlist;
        this.onUserChange();

      },
      (error) => {
        console.log(error);
      }
    );
}


mapchart(provincedata: any) {
  this.chartmap = {
    title: {
      text: "Top Buying Provinces"
    },
    animationEnabled: true,
    data: [{
      type: "column",
      toolTipContent: "{label} : ${y}<br/>Orders: {count}",
      dataPoints: provincedata.map((item: any) => ({
        label: item.label,
        count: item.total_orders,
        y: parseFloat(item.y),
      
      }))
    }]
  };
}


mapcitychart(citydata:any){
  this.chartcitymap = {
    title:{
      text: "Top Buying Cities"  
    },
    animationEnabled: true,
    data: [{        
      type: "column",
      toolTipContent: "{label} : ${y}<br/>Orders: {count}",
      dataPoints:citydata.map((item: any) => ({
        label: item.label,
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
    }]
  }	
}




chartminbuyer(chartdata:any){
  this.chartLeastOptions = {
    title:{
      text: "Least Buyers"
    },
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "$"
    },
    data: [{
      type: "bar",
      toolTipContent: "{label} : ${y}<br/>Orders: {count}",
      indexLabel: "{y}",
      yValueFormatString: "#,###$",
      dataPoints: chartdata.map((item: any) => ({
        label: item.label,
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
    }]
  }	
}


chartmaxbuyer(salesstats:any){
  this.chartOptions = {
    title:{
      text: "Top Buyers"
    },
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "$"
    },
    data: [{
      type: "bar",
      toolTipContent: "{label} : ${y}<br/>Orders: {count}",
      indexLabel: "{y}",
      yValueFormatString: "#,###$",
      dataPoints: salesstats.map((item: any) => ({
        label: item.label,
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
    }]
  }
}


selectedView: string = 'daily';

userselectedView: string = 'daily';
userselected : number =0;
onViewUserChange() {
  this.sendDataToApi();
}

onUserChange() {
 
  console.log('User changed:', this.userselected);
  this.sendDataToApi();
}

sendDataToApi() {
  const requestData = {
    userselectedView: this.userselectedView,
    userselected: this.userselected
  };
//start
this.http.get<any>(apiUrl + 'admindashboarduserchart', { params: requestData })
      .subscribe(
        response => {
          this.chartdemodateuser(response.chartdatadate);
        this.chartdemouser(response.chartdata);
        },
        error => {
          // Handle any errors from the API request
        }
      );
//end
}



onViewChange() {
  if (this.userselectedView === 'monthly') {
    // Call the API for monthly data
  //  this.salesmonthly('monthly');

  } else if (this.userselectedView === 'daily') {
    // Call the API for daily data
   // this.salesmonthly('daily');

  }
}






chartdemodateuser(chartdata:any){
  this.chartdailyuser = {
    animationEnabled: true,
    theme: "light1",
    title:{
      text: "Total Sales Per Day"
    },
    axisX:{
      valueFormatString: "YYYY-MM-DD", // Adjust the date format here
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      title: "Total Sales",
      crosshair: {
        enabled: true
      }
    },
    toolTip:{
      shared:true
    },  
    legend:{
      cursor: "pointer",
      verticalAlign: "bottom",
      horizontalAlign: "right",
      dockInsidePlotArea: true,
      itemclick: function(e: any) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else{
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [
    {
      type: "line",
      toolTipContent: "Date : {x} <br/> Total Sales: ${y}<br/>Orders: {count}",

      showInLegend: true,
      name: "Total Sales",
      dataPoints: chartdata.map((item: any) => ({
        x: new Date(item.x),
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
    }]
  }	

  }

chartdemouser(chartdata:any){
  if(chartdata){
  this.chartmonthlyuser = {
		animationEnabled: true,
		theme: "light1",
		title: {
			text: "Monthly Sales"
		},
		axisX: {
			valueFormatString: "MMM",
			intervalType: "month",
			interval: 1
		},
		axisY: {
			title: "Total Sales in CAD",
		  suffix: "$"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: function(e: any){
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else{
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type:"line",
      toolTipContent: "Date : {x} <br/> Total Sales: ${y}<br/>Orders: {count}",
			name: "Total Sales",
			showInLegend: true,
			yValueFormatString: "#,### $",
			dataPoints: chartdata.map((item: any) => ({
        x: new Date(item.x),
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
		}]
	}			

}
}



salesmonthly() {
  this.http.get<any>(apiUrl + 'admindashboardsales')
    .subscribe(
      (response: any) => {
        console.log(response);
        this.salesstats = response.stats;
        this.chartdata = response.chartdata;
        console.log(this.chartdata);

        const chartdata = response.chartdata;
        this.ytm = response.ytm;
        this.mtd = response.mtd;
        this.chartdemodate(response.chartdatadate);
        this.chartdemo(this.chartdata);
      },
      (error) => {
        console.log(error);
      }
    );
}

chartdemodate(chartdata:any){
  this.chartdaily = {
    animationEnabled: true,
    theme: "light1",
    title:{
      text: "Total Sales Per Day"
    },
    axisX:{
      valueFormatString: "YYYY-MM-DD", // Adjust the date format here
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      title: "Total Sales",
      crosshair: {
        enabled: true
      }
    },
    toolTip:{
      shared:true
    },  
    legend:{
      cursor: "pointer",
      verticalAlign: "bottom",
      horizontalAlign: "right",
      dockInsidePlotArea: true,
      itemclick: function(e: any) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else{
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [
    {
      type: "line",
      toolTipContent: "Date : {x} <br/> Total Sales: ${y}<br/>Orders: {count}",

      showInLegend: true,
      name: "Total Sales",
      dataPoints: chartdata.map((item: any) => ({
        x: new Date(item.x),
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
    }]
  }	

  }

chartdemo(chartdata:any){
  if(chartdata){
  this.chartmonthly = {
		animationEnabled: true,
		theme: "light1",
		title: {
			text: "Monthly Sales"
		},
		axisX: {
			valueFormatString: "MMM",
			intervalType: "month",
			interval: 1
		},
		axisY: {
			title: "Total Sales in CAD",
		  suffix: "$"
		},
		toolTip: {
			shared: true
		},
		legend: {
			cursor: "pointer",
			itemclick: function(e: any){
				if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else{
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		data: [{
			type:"line",
      toolTipContent: "Date : {x} <br/> Total Sales: ${y}<br/>Orders: {count}",
			name: "Total Sales",
			showInLegend: true,
			yValueFormatString: "#,### $",
			dataPoints: chartdata.map((item: any) => ({
        x: new Date(item.x),
        count: item.total_orders,
        y: parseFloat(item.y)
      }))
		}]
	}			

}
}

piechart(){

  this.http.get<any>(apiUrl + 'admindashboardproducts')
  .subscribe(
    (response: any) => {
      console.log(response);
      this.salesstatss = response.stats;
      this.chartcat(this.salesstatss);
      this.chartpro(response.chartpromax);
      this.prostats = response.prostats;
      this.totalcategories=response.totalcategories;
      this.tablemax = response.tablemax;
      this.tablemin = response.tablemin;
    },
    (error) => {
      console.log(error);
    }
  );
}

chartcat(salesstats:any){
  this.chartpie = {
	  animationEnabled: true,
	  title: {
		text: "Sales by Category"
	  },
	  data: [{
		type: "pie",
    toolTipContent: "Category : {x} <br/> Total Sales: ${y}<br/>Orders: {count}",
		startAngle: -90,
		indexLabel: "{x}: {y}",
		yValueFormatString: "'$'#,###.##",
		dataPoints: salesstats.map((item: any) => ({
      x: item.parent_name,
      count: item.total_count,
      y: parseFloat(item.total_order_amount)
    }))
	  }]
	}	
}
}
