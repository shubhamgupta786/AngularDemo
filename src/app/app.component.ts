import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailService } from './email.service';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { EmailListComponent } from './email-list/email-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,EmailDetailComponent,EmailListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Outlook';
  selectedEmail!:any;
  constructor(private email:EmailService){
    this.selectedEmail=email.getEmails(1);
  }
}
