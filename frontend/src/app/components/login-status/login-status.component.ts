import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit() {

    //subscribe to the authentication state
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        this.getUserDetails();
      }
    )
  }

  getUserDetails() {
    if(this.isAuthenticated) {

      //fetch logged user details
      //
      //user full name is exposed as a property name
      this.oktaAuthService.getUser().then(
        res => {
          this.userFullName = res.name;
        }
      );

    }
  }

  logout() {
    
    //terminate the session with Okta and remove current tokens
    this.oktaAuthService.signOut();
  }

}
