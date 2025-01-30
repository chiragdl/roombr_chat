import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-media-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './media-preview-dialog.component.html',
  styleUrls: ['./media-preview-dialog.component.css']
})
export class MediaPreviewDialogComponent {
  currentIndex: number;

  constructor(
    public dialogRef: MatDialogRef<MediaPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentIndex = data.currentIndex;
  }

  nextImage() {
    if (this.currentIndex < this.data.images.length - 1) {
      this.currentIndex++;
    }
  }

  previousImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}