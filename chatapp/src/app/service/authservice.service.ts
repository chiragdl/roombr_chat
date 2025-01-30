import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'authToken';
  private userIdKey = 'userId'; // Key to store user ID in local storage

  constructor(private http: HttpClient) {}

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  saveUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  clearUserId(): void {
    localStorage.removeItem(this.userIdKey);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, userData);
  }
  
}