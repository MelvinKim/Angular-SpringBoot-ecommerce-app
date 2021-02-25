export default {

  //oidc => Open ID connect
  oidc:{
    clientId: "0oa9jiznqqsj6pG155d6",
    issuer: "https://dev-33084191.okta.com/oauth2/default",
    redirectUri:"http://localhost:4200/login/callback",
      //setting up a properties file
    scopes: ['openid', 'profile', 'email']
  }
}
