import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messageSubject = new BehaviorSubject<any>(null); // Holds the latest message
  messageUpdates$ = this.messageSubject.asObservable(); // Expose as an observable

  constructor(private http: HttpClient) {}

  // Send message
  sendMessage(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://localhost:5000/api/chat/upload-message', formData, { headers });
  }

  // Emit new message to subscribers
  emitMessageUpdate(newMessage: any): void {
    this.messageSubject.next(newMessage);
  }
}