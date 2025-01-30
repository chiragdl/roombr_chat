// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SignupDialogComponent } from './component/signup-dialog/signup-dialog.component';
import { LoginDialogComponent } from './component/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: ` 
    <div class="container">
      <div class="auth-buttons">
        <button mat-raised-button color="primary" (click)="openSignupDialog()">Sign Up</button>
        <button mat-raised-button color="accent" (click)="openLoginDialog()">Login</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .auth-buttons {
      display: flex;
      gap: 20px;
    }
  `]
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}

  openSignupDialog() {
    this.dialog.open(SignupDialogComponent, {
      width: '400px'
    });
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px'
    });
  }
}