import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

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
  screenSize: number = window.innerWidth;
  currentPage: number = 1;
  emailsPerPage: number = 10; // Number of emails per page
  totalPages: number = 0;
  paginatedEmails: any[] = [];
  loading: boolean = false; // New property to track loading state
  loadingEmailBody: boolean = false; // Spinner for email body

  constructor(
    private emailService: EmailService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadEmails();
    this.totalPages = Math.ceil(this.emails.length / this.emailsPerPage);
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['page'] ? +params['page'] : 1;
      this.updatePagination();
    });
    this.applyFilter();
    window.addEventListener('resize', () => {
      this.screenSize = window.innerWidth;
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.emailsPerPage;
    const endIndex = startIndex + this.emailsPerPage;
    this.paginatedEmails = this.filteredEmails.slice(startIndex, endIndex);
  }

  loadEmails(page: number = 1) {

    const storedEmails =    this.getWithExpiry('emails')// localStorage.getItem('emails'); // Check if emails are already in local storage
    if (storedEmails) {
      // Use stored emails
      this.emails = JSON.parse(storedEmails);
      this.filteredEmails = [...this.emails];
      this.updatePagination();
    }
    else {
    this.loading = true; // Start loading
    this.emailService.getEmailList().subscribe(
      (data) => {
        this.emails = data.list.map((email: any) => ({
          ...email,
          avatar: email.from.name.charAt(0).toUpperCase(),
          isFavorite: false,
          isRead: false,
        }));
        this.filteredEmails = this.emails;
         // Calculate total pages and update pagination
        // localStorage.setItem('emails', JSON.stringify(this.emails)); // Save emails in local storage
         this.setWithExpiry('emails', JSON.stringify(this.emails), 1000*60*60 ); // Save emails in local storage with expiry
      this.totalPages = Math.ceil(this.filteredEmails.length / this.emailsPerPage);
      this.updatePagination();
      this.loading = false; // Start loading
      },
      (error) => {
        console.error('Error fetching emails:', error);
        this.loading = false; // Start loading
      }
    );
  }
  }
  deselectEmail() {
    this.selectedEmail = null;
  }
  onEmailSelect(email: any) {
    
    this.selectedEmail = email;
    this.selectedEmail.isRead = true;

    const cachedEmailBody = this.getWithExpiry(`emailBody_${email.id}`); //localStorage.getItem(`emailBody_${email.id}`);
    if (cachedEmailBody) {
      // Use cached email body
      this.selectedEmailBody = JSON.parse(cachedEmailBody);
    }
    else {
    this.loadingEmailBody = true; // Start spinner for email body  
    this.emailService.getEmailBody(email.id).subscribe((body) => {
      this.selectedEmailBody = body;
      this.setWithExpiry(`emailBody_${email.id}`, JSON.stringify(body), 1000*60*60 ); // Save email body in local storage with expiry
      //localStorage.setItem(`emailBody_${email.id}`, JSON.stringify(body)); // Save email body in local storage
      this.loadingEmailBody = false; // Stop spinner for email body
    });
  }
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

    this.totalPages = Math.ceil(this.filteredEmails.length / this.emailsPerPage);
  this.updatePagination();
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

    this.totalPages = Math.ceil(this.filteredEmails.length / this.emailsPerPage);
    this.updatePagination();
  }

  markAsFavorite(email: any) {
    email.isFavorite = !email.isFavorite;
  }

  navigateToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  setWithExpiry(key: string, value: any, ttl: number) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
  
    const item = JSON.parse(itemStr);
    const now = new Date();
  
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key); // Clear expired item
      return null;
    }
  
    return item.value;
  }
}
