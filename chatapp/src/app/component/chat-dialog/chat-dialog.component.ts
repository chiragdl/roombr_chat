import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../service/authservice.service';
import { MediaPreviewDialogComponent } from '../mediapreview-dialog/mediapreview-dialog.component';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <div class="chat-container">
  <!-- Left sidebar - User list -->
  <div class="user-list">
    <div class="user-list-header">
      <h3>Chats</h3>
    </div>
    <mat-divider></mat-divider>
    <mat-nav-list>
      <mat-list-item
        *ngFor="let user of users"
        (click)="selectUser(user)"
        [class.selected]="selectedUser?.id === user.id"
      >
        <div class="user-list-item">
          <div class="user-avatar">{{ user.name.charAt(0) }}</div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="last-message">{{ user.lastMessage }}</div>
          </div>
          <button mat-icon-button (click)="deleteUser(user)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </mat-list-item>
    </mat-nav-list>
  </div>

  <!-- Right side - Chat area -->
  <div class="chat-area">
    <div class="chat-header">
      <div *ngIf="selectedUser" class="selected-user">
        <div class="user-avatar">{{ selectedUser.name.charAt(0) }}</div>
        <div class="user-name">{{ selectedUser.name }}</div>
        <button mat-icon-button (click)="onClose()"> x </button>
      </div>
    </div>

    <mat-divider></mat-divider>

    <!-- Messages area -->
<div class="messages-container" #messagesContainer>
  <div *ngIf="!selectedUser" class="no-chat-selected">
    <p>Select a chat to start messaging</p>
  </div>

  <div *ngIf="selectedUser" class="messages">
    <div
      *ngFor="let message of messages"
      class="message"
      [ngClass]="{ 'message-sent': message.sent, 'message-received': !message.sent }"
    >
      <div class="message-content">
        <div *ngIf="message.text">{{ message.text }}</div>
        <div *ngIf="message.images?.length">
          <div class="file-gallery">
            <div *ngFor="let file of message.images.slice(0, 4); let i = index" class="file-item">
              <img [src]="file" class="file-preview" (click)="openImageDialog(i)" alt="Image">
              <div *ngIf="i === 3 && message.images.length > 4" class="more-overlay" (click)="openImageDialog(i)">
                <span>+{{ message.images.length - 4 }}</span>
              </div>
            </div>
          </div>
        </div>
        <span class="message-time">
          {{ message.time | date: 'shortTime' }}
        </span>
      </div>
    </div>
  </div>
</div>

<!-- Image preview area -->
<div *ngIf="selectedFiles.length > 0" class="image-preview">
  <button mat-icon-button (click)="previousImage()" [disabled]="currentImageIndex === 0">
    <mat-icon>chevron_left</mat-icon>
  </button>
  <div class="image-container">
    <img *ngIf="selectedFiles.length > 0" [src]="selectedFiles[currentImageIndex]?.preview" alt="Image Preview">
    <button mat-icon-button class="delete-button" (click)="removeImage(currentImageIndex)">
      <mat-icon>close</mat-icon>
    </button>
  </div>
  <button mat-icon-button (click)="nextImage()" [disabled]="currentImageIndex === selectedFiles.length - 1">
    <mat-icon>chevron_right</mat-icon>
  </button>
</div>

    <!-- Input area -->
    <div class="input-area" *ngIf="selectedUser">
      <input
        #fileInput
        type="file"
        (change)="onFileSelected($event)"
        style="display: none"
        multiple
      />

      <button mat-icon-button (click)="fileInput.click()" class="attach-button">
        <mat-icon>attach_file</mat-icon>
      </button>

      <mat-form-field appearance="outline" class="message-input">
        <input
          matInput
          [(ngModel)]="newMessage"
          placeholder="Type a message"
          (keyup.enter)="sendMessage()"
        />
      </mat-form-field>

      <button
        mat-icon-button
        color="primary"
        [disabled]="!newMessage?.trim() && selectedFiles.length === 0"
        (click)="sendMessage()"
      >
        <mat-icon>send</mat-icon>
      </button>
    </div>
  </div>
</div>
  `,
  styles: [`
  .chat-container {
    display: flex;
    height: 100%; 
    width: 100%;   
    background-color: #fff;
  }

/* User list styles */
.user-list {
  width: 30%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}

.user-list-header {
  padding: 16px;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
}

.user-list-header h3 {
  margin: 0;
}

.user-list-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1px;
  font-weight: 500;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 425;
}

.last-message {
  font-size: 12px;
  color: #666;
}

.selected {
  background-color: #e3f2fd;
}

/* Chat area styles */
.chat-area {
  width: 70%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
}

.close-button {
  margin-right: auto;
}

.selected-user {
  display: flex;
  align-items: center;
}

.messages-container {
  flex: 1;
  padding: 16px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  height: calc(100vh - 150px); 
}

.no-chat-selected {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  margin: 4px 0;
}

.message-sent {
  align-self: flex-end;
  background-color: #e3f2fd;
}

.message-received {
  align-self: flex-start;
  background-color: #fff;
  border: 1px solid #ddd;
}

.message-content {
  position: relative;
  padding-bottom: 15px;
  width: 130px;
}

.message-time {
  position: absolute;
  bottom: -5px;
  right: 0;
  font-size: 10px;
  color: #666;
}

/* Input area styles */
.input-area {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  position: sticky;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

/* Image preview styles */
.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}

.image-container {
  position: relative;
}

.image-container img {
  max-width: 100%;
  max-height: 50vh;  
  border-radius: 8px;
}

.delete-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.message-input {
  flex: 1;
  margin-bottom: -0.3em;
  margin-right: 1em;
}

.attach-button,
.send-button {
  height: 36px;
  width: 36px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

::ng-deep .message-input .mat-mdc-form-field-subscript-wrapper {
  display: none;
}

.file-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.file-item {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
}

.file-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  border-radius: 8px;
}

  `]
})

export class ChatDialogComponent implements OnInit, OnDestroy {
  newMessage: string = '';
  selectedFiles: any[] = [];
  messages: any[] = [];
  currentImageIndex: number = 0;
  users: any[] = [];
  selectedUser: any = null;
  displayedFiles: any[] = [];
  refreshInterval: any;
  images: any;

  constructor(private http: HttpClient, private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      if (this.selectedUser) {
        this.fetchMessages(this.selectedUser.id);
      }
    }, 2000); // Refresh every 2 seconds
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFiles.push({ file, preview: e.target.result, caption: '' });
      };
      reader.readAsDataURL(file);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.selectedFiles.length - 1) {
      this.currentImageIndex++;
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    if (this.currentImageIndex >= this.selectedFiles.length) {
      this.currentImageIndex = this.selectedFiles.length - 1;
    }
  }

  sendMessage() {
    if (!this.selectedUser) return;

    const formData = new FormData();
    formData.append('caption', this.newMessage || '');
    const senderId = this.authService.getUserId();
    if (senderId) {
      formData.append('senderId', senderId);
    } else {
      console.error('Sender ID is null');
      return;
    }
    formData.append('recipientId', this.selectedUser.id);
    this.selectedFiles.forEach((file) => {
      formData.append('images', file.file);
    });

    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:5000/api/chat/upload-message', formData, { headers }).subscribe({
      next: (response: any) => {
        this.messages.push({
          text: response.data.caption,
          images: response.data.files.map((file: any) => file.minioUrl),
          time: new Date(),
          sent: true,
        });
        this.newMessage = '';
        this.selectedFiles = [];
      },
      error: (err) => console.error('Error sending message:', err),
    });
  }

  fetchUsers() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const currentUserId = this.authService.getUserId();

    this.http.get<{ message: string; data: any[] }>('http://localhost:5000/api/users', { headers })
      .subscribe({
        next: (response) => {
          if (response.message === 'Users fetched successfully') {
            this.users = response.data.filter((user) => user._id !== currentUserId).map((user) => ({
              id: user._id,
              name: user.username || 'Unnamed User',
              lastMessage: user.lastMessage || 'No messages yet',
            }));
          }
        },
        error: (err) => console.error('Error fetching users:', err),
      });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.fetchMessages(user.id);
  }

  fetchMessages(recipientId: string) {
    const senderId = this.authService.getUserId();
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ message: string; data: any[] }>(`http://localhost:5000/api/chat/history?senderId=${senderId}&recipientId=${recipientId}`, { headers })
      .subscribe({
        next: (response) => {
          if (response.message === 'Chat history fetched successfully') {
            this.messages = response.data.map((msg) => ({
              text: msg.message,
              images: msg.files.map((file: any) => file.signedUrl),
              time: new Date(msg.timestamp),
              sent: msg.sender === senderId,
            }));
          }
        },
        error: (err) => console.error('Error fetching messages:', err),
      });
  }

  openImageDialog(index: number): void {
    const dialogRef = this.dialog.open(MediaPreviewDialogComponent, {
      data: {
        images: this.images,
        currentIndex: index
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  onClose() {
    this.selectedUser = null;
    this.messages = [];
  }

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`http://localhost:5000/api/users/${user.id}`, { headers })
        .subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            if (this.selectedUser?.id === user.id) {
              this.selectedUser = null;
              this.messages = [];
            }
          },
          error: (err) => console.error('Error deleting user:', err),
        });
    }
  }
}