import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NgIf,RouterModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  profileForm = this.formBuilder.group({
    email: ['admin@example.com', Validators.required],
    password: ['password',Validators.required],
  });
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Login', console.warn(this.profileForm.value));
    const credentials = {
      email: this.profileForm.value.email || '',
      password: this.profileForm.value.password || ''
    };
    this.authService.login(credentials).subscribe(
      (response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Save token in localStorage
          this.router.navigate(['/emails']); // Redirect to emails
        } else {
          // Handle invalid credentials
          this.errorMessage = 'Invalid email or password';
          console.error('Login failed:', response);
        }
      },
      (error) => {
        this.errorMessage = 'Invalid email or password';
        console.error('Login failed:', error);
      }
    );
  }
}