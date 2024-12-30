import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private baseUrl = 'https://flipkart-email-mock.now.sh';

  constructor(private http: HttpClient) {}

  getEmails(page: number = 1): Observable<any> {
    return this.http.get(`${this.baseUrl}/?page=${page}`);
  }

  getEmailList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getEmailBody(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/?id=${id}`);
  }
}
