import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://your-backend-api.com/api'; // Replace with your API URL
  private signupData: { name: string; email: string; password: string }[] = [];


  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const response = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjcxOTg2MjM0LCJleHAiOjE2NzIwNzI2MzR9.TGG0uZGNyV09BNmFfMJzCNXOXVevYttK1A79FKUdmGE",
      user: {
        id: 1,
        name: "John Doe",
        email: "admin@example.com",
        password: "password",
      },
    };

    if(credentials.email === response.user.email && credentials.password === response.user.password) {
    // Convert the response to an Observable
    return of(response);}
 
      return of('Invalid email or password');
    
  }

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    this.signupData.push(data);
   
    const response = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjcxOTg2MjM0LCJleHAiOjE2NzIwNzI2MzR9.TGG0uZGNyV09BNmFfMJzCNXOXVevYttK1A79FKUdmGE",
      user: {
        id: 1,
        name: "John Doe",
        email: "admin@example.com",
      },
    };
      console.log('Signup', this.signupData);
    return of(response);
  }

  logout() {
    localStorage.removeItem('token'); // Clear token
    this.router.navigate(['/login']); // Redirect to login page
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}