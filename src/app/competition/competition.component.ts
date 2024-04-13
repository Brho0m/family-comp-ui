import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent {

  constructor(private userService: UserService, private router: Router,private webSocketService: WebSocketService) {}

  onButtonClick(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.id) {
      const message = { userId: currentUser.id, timeClicked: new Date() };  // Create a message payload
      this.webSocketService.sendMessage(message);  // Send message via WebSocket

      // Navigate to the Click Order Component to view live updates
      this.router.navigate(['/click-order']).then(() => {
        console.log('Navigated to click order component');
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } else {
      console.error('User not logged in or data missing');
      // Optionally handle user not found or logged in scenario
    }
  }
}
  

