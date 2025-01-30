// components/signup-dialog/signup-dialog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../service/authservice.service';

@Component({
  selector: 'app-signup-dialog',
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
    <h2 mat-dialog-title>Sign Up</h2>
    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username">
          <mat-error *ngIf="signupForm.get('username')?.hasError('required')">
            Username is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password">
          <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onClose()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="signupForm.invalid">
          Sign Up
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
  `]
})
export class SignupDialogComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<SignupDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.snackBar.open('Sign-up successful! Please log in.', 'Close', { duration: 3000 });
          this.dialogRef.close();
        },
        error: (error: { error: { message: string; }; }) => {
          this.errorMessage = error.error?.message || 'Sign-up failed. Please try again.';
        },
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}