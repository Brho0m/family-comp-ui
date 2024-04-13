import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-click-order',
  templateUrl: './click-order.component.html',
  styleUrls: ['./click-order.component.css']
})
export class ClickOrderComponent implements OnInit, OnDestroy {
  clicks: any[] = [];
  private subscriptions = new Subscription();

  constructor(private userService: UserService, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Fetch initial state when component loads
    this.subscriptions.add(
      this.userService.getClicks().subscribe(clicks => {
        this.clicks = clicks;
        console.log('Initial clicks loaded:', clicks);
      })
    );

    // Subscribe to real-time updates
    this.subscriptions.add(
      this.webSocketService.message$.subscribe(click => {
        if (click) {
          this.updateClicksList(click);
        }
      })
    );
  }

  updateClicksList(newClick: any): void {
    this.clicks.push(newClick);
    this.clicks.sort((a, b) => a.timeClicked - b.timeClicked); // Sort by timeClicked if it's a timestamp
    console.log('Updated clicks list:', this.clicks);
  }

  ngOnDestroy(): void {
    // Clean up the subscriptions
  }
}
