import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [NgFor, DatePipe, NgIf],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.css',
})
export class EmailListComponent implements OnInit {
  emails: any[] = [];
  filteredEmails: any[] = [];
  selectedEmail: any = null;
  filters = { favorite: false, read: false, unread: false };
  selectedEmailBody: any = null;

  constructor(
    private emailService: EmailService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadEmails();
    this.applyFilter();
  }

  loadEmails(page: number = 1) {
    this.emailService.getEmailList().subscribe(
      (data) => {
        this.emails = data.list.map((email: any) => ({
          ...email,
          avatar: email.from.name.charAt(0).toUpperCase(),
          isFavorite: false,
          isRead: false,
        }));
        this.filteredEmails = this.emails;
      },
      (error) => {
        console.error('Error fetching emails:', error);
      }
    );
  }

  onEmailSelect(email: any) {
    this.selectedEmail = email;
    this.selectedEmail.isRead = true;
    this.emailService.getEmailBody(email.id).subscribe((body) => {
      this.selectedEmailBody = body;
    });
  }
  toggleFavorite(email: any) {
    email.isFavorite = !email.isFavorite;
  }

  filter: string = '';

  setFilter(filter: string) {
    this.filter = filter;
    this.applyFilter();
  }
  filterEmails(type: string) {
    this.filter = type;
    if (type === 'unread') {
      this.filteredEmails = this.emails.filter((email) => !email.isRead);
    } else if (type === 'read') {
      this.filteredEmails = this.emails.filter((email) => email.isRead);
      console.log(this.filteredEmails, 'Filter');
    } else if (type === 'favorites') {
      this.filteredEmails = this.emails.filter((email) => email.isFavorite);
    } else {
      this.filteredEmails = [...this.emails];
    }
  }
  applyFilter() {
    if (this.filter === 'read') {
      this.filteredEmails = this.emails.filter((email) => email.isRead);
    } else if (this.filter === 'unread') {
      this.filteredEmails = this.emails.filter((email) => !email.isRead);
    } else if (this.filter === 'favorites') {
      this.filteredEmails = this.emails.filter((email) => email.isFavorite);
    } else {
      this.filteredEmails = this.emails;
    }
  }

  markAsFavorite(email: any) {
    email.isFavorite = !email.isFavorite;
  }
}
