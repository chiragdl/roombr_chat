// file-preview-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-file-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="preview-dialog">
      <div class="preview-header">
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
        <span class="preview-title">{{ files.length }} {{ files.length === 1 ? 'Photo' : 'Photos' }}</span>
      </div>

      <div class="preview-content">
        <div class="preview-grid">
          <div *ngFor="let file of files; let i = index" class="preview-item" [class.active]="i === currentIndex">
            <img [src]="previewUrls[i]" alt="Preview">
            <button mat-icon-button class="delete-button" (click)="removeFile(i)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <mat-form-field appearance="outline" class="caption-input">
          <input matInput [(ngModel)]="caption" placeholder="Add a caption...">
        </mat-form-field>
      </div>

      <div class="preview-actions">
        <button mat-icon-button (click)="previousFile()" [disabled]="currentIndex === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button (click)="nextFile()" [disabled]="currentIndex === files.length - 1">
          <mat-icon>chevron_right</mat-icon>
        </button>
        <button mat-raised-button color="primary" (click)="onSend()">
          <mat-icon>send</mat-icon>
          Send
        </button>
      </div>
    </div>
  `,
  styles: [`
    .preview-dialog {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 80vh;
    }

    .preview-header {
      display: flex;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }

    .preview-title {
      margin-left: 8px;
      font-weight: 500;
    }

    .preview-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .preview-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .preview-item {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      display: none;
    }

    .preview-item.active {
      display: block;
    }

    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .delete-button {
      position: absolute;
      top: 4px;
      right: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
    }

    .caption-input {
      width: 100%;
      margin-top: 16px;
    }

    .preview-actions {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #ddd;
    }
  `]
})
export class FilePreviewDialogComponent {
  files: File[];
  previewUrls: string[] = [];
  caption: string = '';
  currentIndex: number = 0;

  constructor(
    private dialogRef: MatDialogRef<FilePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { files: File[] }
  ) {
    this.files = data.files;
    this.generatePreviews();
  }

  private generatePreviews() {
    this.files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.previewUrls.splice(index, 1);
    if (this.files.length === 0) {
      this.onClose();
    } else {
      this.currentIndex = Math.min(this.currentIndex, this.files.length - 1);
    }
  }

  previousFile() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextFile() {
    if (this.currentIndex < this.files.length - 1) {
      this.currentIndex++;
    }
  }

  onSend() {
    this.dialogRef.close({
      files: this.files,
      caption: this.caption
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}