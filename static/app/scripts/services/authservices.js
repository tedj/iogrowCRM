var accountservices = angular.module('crmEngine.authservices',[]);
accountservices.factory('Auth', function($http) {
  var Auth = function(data) {
    angular.extend(this, data);
  };
  Auth.init = function($scope){
      
      var timeNow = new Date().getTime()/1000;
      Auth.$scope = $scope;
      if (window.is_signed_in){
          
          
          var diff = window.authResultexpiration - timeNow;

          if (diff>0){
             Auth.processAuth(window.authResult); 
          }
          else{
              // refresh token
              Auth.refreshToken();

          }
          
      }else{
            gapi.signin.render('myGsignin', {
            'callback': Auth.signIn,
            'clientid': '987765099891.apps.googleusercontent.com',
            'requestvisibleactions': 'http://schemas.google.com/AddActivity ' +
                'http://schemas.google.com/ReviewActivity',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar',
            'theme': 'dark',
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'offline'
            });
            
      }
  };
  Auth.signIn = function(authResult){
      
      //Auth.connectServer(authResult);
      Auth.processAuth(authResult);
  };
  Auth.connectServer = function(authResult){
    
      $.ajax({
        type: 'POST',
        url: '/gconnect',
        success: function(result) {
          // success
        },
        data: {code:authResult.code}
      });
  };
  Auth.processAuth = function(authResult) {
   
      Auth.$scope.immediateFailed = true;
      if (authResult['access_token']) {
          
          Auth.$scope.immediateFailed = false;
          Auth.$scope.isSignedIn = true;
          if (!window.authResult) {
              
              window.is_signed_in = true;
              window.authResult = authResult;
              window.authResultexpiration =  authResult.expires_at;
          }
          
          // run the process
          Auth.$scope.runTheProcess();
      } else if (authResult['error']) {
          if (authResult['error'] == 'immediate_failed') {
            Auth.$scope.immediateFailed = true;
            console.log(authResult);
            //window.location.replace('/sign-in');
          } else {
            console.log('Error:' + authResult['error']);
          }
      };
      
  };

  Auth.refreshToken = function(){
     window.location.reload(true);    
  };

  return Auth;
});

