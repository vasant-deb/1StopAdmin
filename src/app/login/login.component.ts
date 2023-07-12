import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../environment';


// access the API URL like this:
const apiUrl = environment.apiUrl;




interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  email: string;
  error:boolean;
  role:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onSubmit() {
    const loginData: LoginData = { email: this.email, password: this.password };
    this.http.post<LoginResponse>(apiUrl+'adminlogin', loginData)
      .subscribe(
        (response) => {
          console.log(response);
          // handle successful login
          const message = response.message;
          const error=response.error;
          const role=response.role;
          this.snackBar.open(message, 'Close', {
            duration: 2000
          });
          if(error===false){
            localStorage.setItem('token', response.token);
            localStorage.setItem('email', response.email);
            localStorage.setItem('role', response.role);
            // navigate to products page
            this.router.navigate(['/products']);
          }         

          // save token and email in local storage
        
        },
        (error) => {
          console.log(error);
          // handle login error
          const message = error.error.message;
          this.snackBar.open(message, 'Close', {
            duration: 2000
          });
        }
      );
  }
}
