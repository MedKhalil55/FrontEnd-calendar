import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './service/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'calendar-test';
  isAuthenticated : boolean = false;
  isAdmin : boolean = false;
  isUser : boolean = false;
  
  constructor(private readonly userService:  AuthServiceService){ }

  ngOnInit() : void{

    this.isAuthenticated = this.userService.isAuthenticated();
    this.isAdmin = this.userService.isAdmin();
    this.isUser = this.userService.isUser();
  }

  logout() : void {
    this.userService.logout();
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.isUser = false;
  }
}
