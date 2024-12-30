import { Routes } from '@angular/router';
import { EmailListComponent } from './email-list/email-list.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,data: { title: 'Login | My Outlook' } },
  { path: 'signup', component: SignupComponent ,data: { title: 'Sign Up | My Outlook' }},
  { path: 'emails', component: EmailListComponent, canActivate: [authGuard] , data:{title:'My Outlook'}}, // Protected route
];
 
