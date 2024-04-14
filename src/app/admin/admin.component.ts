import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  clicks: any[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, private http: HttpClient, private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Fetch initial state when component loads
    this.subscriptions.add(
      this.userService.getClicks().subscribe(clicks => {
        this.clicks = clicks;
        console.log('Initial clicks loaded:', clicks);
      })
    );

    // Subscribe to real-time updates via WebSocket
    this.subscriptions.add(
      this.webSocketService.message$.subscribe(click => {
        if (click) {
          this.updateClicksList(click);
        }
      })
    );
  }

  updateClicksList(newClick: any): void {
    // Assuming newClick is already an object properly formatted for the list
    this.clicks.push(newClick);
    // Assuming clicks are sorted by a timestamp
    this.clicks.sort((a, b) => new Date(a.timeClicked).getTime() - new Date(b.timeClicked).getTime());
    console.log('Updated clicks list:', this.clicks);
  }

  ngOnDestroy(): void {
    // Unsubscribe to all subscriptions
    this.subscriptions.unsubscribe();
  }


  loadClicks(): void {
    this.userService.getClicks().subscribe(data => {
      this.clicks = data;
    });
  }

  updateScore(click: any, scoreChange: number): void {
    console.log("Updating score for user ID:", click.userId, "Score change:", scoreChange);  // Ensure 'userId' is the correct property
    this.userService.updateScore(click.userId, scoreChange).subscribe(() => {
      alert('Score updated');
      this.loadClicks(); // Reload to see updated scores
    }, error => {
      console.error('Failed to update score:', error);
    });
  }
  


  resetGame(): void {
    this.userService.resetClicks().subscribe(() => {
      alert('Game has been reset');
      this.loadClicks();
    });
  }

  
  forceNavigateScore(): void {
    this.http.post('http://localhost:8080/api/force-navigate-score', {}).subscribe(
      response => console.log('Navigate to score command sent'),
      error => console.error('Error sending navigate to score command', error)
    );
  }

  forceNavigateCompetition(): void {
    this.http.post('http://localhost:8080/api/force-navigate-competition', {}).subscribe(
      response => console.log('Navigate to competition command sent'),
      error => console.error('Error sending navigate to competition command', error)
    );
  }
}
