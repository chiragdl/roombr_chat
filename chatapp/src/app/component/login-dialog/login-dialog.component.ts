import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../service/authservice.service';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Login</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" [class.error-field]="showErrors">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" [class.error-field]="showErrors">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password">
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
          Login
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .error-message {
      color: #f44336;
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
    }
    .error-field {
      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        color: #f44336;
      }
      ::ng-deep .mat-mdc-form-field-outline {
        color: #f44336;
      }
      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: rgba(244, 67, 54, 0.04);
      }
    }
    .required-label {
      color: #f44336;
    }
    .required-star {
      color: #f44336;
      margin-left: 4px;
    }
  `]
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showErrors: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: { token: any; user: { _id: any; }; }) => {
          // Save the token to the AuthService
          this.authService.saveToken(response.token);
  
          // Save the user ID for later use
          if (response.user && response.user._id) {
            this.authService.saveUserId(response.user._id);
            console.log('User ID saved:', response.user._id);
          } else {
            console.error('Login response does not contain a user ID:', response);
          }
  
          // Show success message
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.dialogRef.close();
          this.openChatDialog();
        },
        error: (error: { error: { message: string; }; }) => {
          this.showErrors = true;
          this.errorMessage = error.error?.message || 'Invalid email or password';
  
          // Mark fields as touched to trigger error states
          this.loginForm.get('email')?.markAsTouched();
          this.loginForm.get('password')?.markAsTouched();
        }
      });
    }
  }
  

  onClose() {
    this.dialogRef.close();
  }

  openChatDialog() {
    this.dialog.open(ChatDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100vw',
      height: '100vh',
      panelClass: 'full-screen-dialog',
      hasBackdrop: true,
      disableClose: true
    });
  }
}