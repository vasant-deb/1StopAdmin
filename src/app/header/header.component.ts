import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role:string='admin';
  constructor(private router: Router) {}
 
  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
  ngOnInit(): void {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole ? storedRole : 'admin';
  }
  logout() {
    localStorage.clear();
    localStorage.setItem('justLoggedOut', 'true');

    this.router.navigate(['']);
  }

}
