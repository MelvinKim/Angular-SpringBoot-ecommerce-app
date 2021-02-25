import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config' ;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  //inject Okta Auth service
  constructor(private oktaAuthService: OktaAuthService) {

    //new okta signin entity
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: { 
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });
   }

  ngOnInit() {

    //remove any previous elements
    this.oktaSignin.remove();

    //render signin widget
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'
    ,},
    (response) => {
      if(response.status === 'SUCCESS') {
        this.oktaAuthService.signInWithRedirect();
      }
    },
    (error) => {
      throw error;
    }
    );

  }

}
