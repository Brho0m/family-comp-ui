import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSource = new BehaviorSubject<any>(null);
  private adminMessageSource = new BehaviorSubject<any[]>([]);  // For admin updates
  public message$ = this.messageSource.asObservable();
  public adminMessage$ = this.adminMessageSource.asObservable();  // Expose as Observable for Admin component

  constructor(private router: Router) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const serverUrl = 'http://localhost:8080/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, (frame: any) => {
      this.subscribeToClickOrders();
      this.subscribeToNavigationCommands();
    }, this.errorCallBack);
  }

  private subscribeToClickOrders(): void {
    this.stompClient.subscribe('/topic/clickOrder', (message: any) => {
      if (message.body) {
        const data = JSON.parse(message.body);
        this.messageSource.next(data);  // Updates for all components
        this.adminMessageSource.next(data);  // Specific updates for Admin
      }
    });
  }

  private subscribeToNavigationCommands(): void {
    this.stompClient.subscribe('/topic/navigate', (message: any) => {
      if (message.body === 'go-to-score') {
        this.router.navigate(['/scores']).then(() => {
        });
      } else if (message.body === 'go-to-competition') {
        this.router.navigate(['/competition']);
      }
    });
  }

  private errorCallBack(error: string) {
    console.log('WebSocket connection error:', error);
    setTimeout(() => {
      this.initializeWebSocketConnection();
    }, 5000);
  }

  sendMessage(message: any) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/clickReceived', {}, JSON.stringify(message));
    } else {
      console.log('Cannot send message when WebSocket is disconnected.');
    }
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    this.messageSource.complete();
    this.adminMessageSource.complete();  // Clean up the BehaviorSubject on disconnect
  }
}
