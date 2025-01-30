import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule
  ],
  template: `
    <div class="file-item">
      <img [src]="preview" class="file-preview" *ngIf="preview">
      <button mat-raised-button color="warn" (click)="onRemove()">Delete</button>
    </div>
  `,
  styles: [`
    .file-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
    }
    .file-preview {
      max-width: 200px;
      max-height: 200px;
      object-fit: cover;
      margin-bottom: 10px;
    }
  `]
})
export class FilePreviewComponent {
  @Input() preview: string | ArrayBuffer | null = null;
  @Output() remove = new EventEmitter<void>();

  onRemove() {
    this.remove.emit();
  }
}