import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-email-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './email-detail.component.html',
  styleUrl: './email-detail.component.css'
})
export class EmailDetailComponent {
  @Input() email: any;

  markFavorite() {
    if (this.email) {
      this.email.isFavorite = true;
    }
  }
}
