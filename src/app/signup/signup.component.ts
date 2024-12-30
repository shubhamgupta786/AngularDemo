import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,NgIf,RouterModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);
    profileForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['',Validators.required],
    });
  data = { name: '', email: '', password: '' };
errorMessage: string = '';

constructor(private authService: AuthService, private router: Router) {}

signup() {
  const signupData = {
    name: this.profileForm.value.fullname || '',
    email: this.profileForm.value.email || '',
    password: this.profileForm.value.password || '',
  };
  this.authService.signup(signupData).subscribe(
    () => {
      this.router.navigate(['/login']); // Redirect to login page
    },
    (error) => {
      this.errorMessage = 'Signup failed. Please try again.';
      console.error('Signup failed:', error);
    }
  );
}
}