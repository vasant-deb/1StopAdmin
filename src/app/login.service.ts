import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router: Router) { }

  login(username: string, password: string) {
    // Perform authentication logic here
    // ...
    // If authentication is successful, redirect to products page
    this.router.navigate(['/products']);
  }
}
