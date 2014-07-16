app.controller('EventShowController',['$scope','$filter','$route','Auth','Note','Event','Task','Topic','Comment','User','Contributor','Show','Map',
   function($scope,$filter,$route,Auth,Note,Event,Task,Topic,Comment,User,Contributor,Show,Map) {
//HKA 14.11.2013 Controller to show Events and add comments
   $scope.isSignedIn = false;
     $scope.immediateFailed = false;
     $scope.nextPageToken = undefined;
     $scope.prevPageToken = undefined;
     $scope.isLoading = false;
     $scope.pagination = {};
     $scope.currentPage = 01;
     $scope.pages = [];
     $scope.paginationcomment = {};
     $scope.currentPagecomment = 01;
     $scope.pagescomment = [];
     $scope.addresses=[];
     $scope.event={};
     $scope.notes = [];
     $scope.users = [];
     $scope.user = undefined;
     $scope.slected_memeber = undefined;
     $scope.role= 'participant';
     $scope.showEndsCalendar=false;
     $scope.showStartsCalendar=false;
     $scope.ends_at=null;
     // What to do after authentication
     $scope.runTheProcess = function(){
          var eventid = {'id':$route.current.params.eventId};
          Event.get($scope,eventid);
          User.list($scope,{});
     };   
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };
     $scope.$watch('event.starts_at', function(newValue, oldValue) {
              $scope.patchDate($scope.event.starts_at,"Start");
              $scope.showStartsCalendar=false;

     });
     $scope.$watch('event.ends_at', function(newValue, oldValue) {
              console.log('changed');
              $scope.patchDate($scope.event.ends_at,"End");
              $scope.showEndsCalendar=false;
              
     });
     $scope.patchDate = function(newValue,when){
      if (when=="Start"){
        var starts_at = $filter('date')(newValue,['yyyy-MM-ddTHH:mm:00.000000']);

        var params = {
                    'entityKey':$scope.event.entityKey,
                    'starts_at':starts_at
        };
      }
      if (when=="End"){
        var ends_at = $filter('date')(newValue,['yyyy-MM-ddTHH:mm:00.000000']);

        var params = {
                    'entityKey':$scope.event.entityKey,
                    'ends_at':ends_at
        };
      }
        if ((!$scope.isLoading) && (params.entityKey != undefined )){
            Event.patch($scope,params);
        }
     }
      $scope.listNextPageItemscomment= function(){

         console.log('i am in list next comment page')
        var nextPage = $scope.currentPagecomment + 1;

        var params = {};
          if ($scope.pagescomment[nextPage]){
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                       'order':'-updated_at',
                      'pageToken':$scope.pagescomment[nextPage]
                     }
          }else{
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                      'order':'-updated_at',}
          }
          console.log('in listNextPageItems');
          $scope.currentPagecomment = $scope.currentPagecomment + 1 ;
          Comment.list($scope,params);
     }

     $scope.listPrevPageItemscomment = function(){

       var prevPage = $scope.currentPagecomment - 1;
       var params = {};
          if ($scope.pagescomment[prevPage]){
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                      'order':'-updated_at',
                      'pageToken':$scope.pagescomment[prevPage]
                     }
          }else{
            params = {'limit':5,
            'order':'-updated_at',
            'discussion':$scope.eventt.entityKey}
          }
          $scope.currentPagecomment = $scope.currentPagecomment - 1 ;
          Comment.list($scope,params);
     };

     $scope.renderMaps = function(){
         // Map.render($scope);
          Map.destroy();
          console.log("oooooooooo");
          console.log($scope);
          Map.searchLocation($scope,$scope.event.where);
      };



     $scope.showModal = function(){
        console.log('button clicked');
        $('#addAccountModal').modal('show');

      };

    $scope.addComment = function(comment){

      var params ={
                  'about':$scope.event.entityKey,
                  'content':$scope.comment.content
                };
      Comment.insert($scope,params);
      $scope.comment.content='';


    };
    $scope.ListComments = function(){
      var params = {
                    'about':$scope.event.entityKey,
                    'limit':7
                   };
      Comment.list($scope,params);


    };
//HKA 18.11.2013 highlight the comment
   $scope.hilightComment = function(){
        console.log('Should higll');
       $('#comment_0').effect( "bounce", "slow" );
       $('#comment_0 .message').effect("highlight","slow");
     };

 //HKA 02.12.2013 Add Contributor

    $scope.addNewContributor = function(selected_user,role){
      console.log('*************** selected user ***********************');
      console.log(selected_user);

      var params = {
                      'discussionKey': $scope.eventt.entityKey,

                      'type': 'user',
                      'value': selected_user.email,
                      'name': selected_user.google_display_name,
                      'photoLink': selected_user.google_public_profile_photo_url,
                      'role': role


                      // Create Contributor Service
                      // Create contributors.list api
                      //list all contributors after getting the task.


        }
        console.log('selected member');
      
     $('#addContributor').modal('hide');
     };
//HKA 02.12.2013 Select member
$scope.selectMember = function(){

        $scope.slected_memeber = $scope.user;
        $scope.user = $scope.slected_memeber.google_display_name;

     };
//HKA 02.12.2013 List contributors
$scope.listContributors = function(){
      var params = {'discussionKey':$scope.eventt.entityKey,
                     'order':'-created_at'};
      Contributor.list($scope,params);
      };
//HKA 20.01.2014 Add
 $scope.getshow = function(showId){
     var show = Show.get($scope.showId);
     return show;

 }
 // HKA 22.06.2014 Delete Event


 $scope.editbeforedelete = function(){
     $('#BeforedeleteEvent').modal('show');
   };
$scope.deleteEvent = function(){

     var params = {'entityKey':$scope.event.entityKey};
     
     Event.delete($scope, params);
      $('#BeforedeleteEvent').modal('hide');

     };
  $scope.eventDeleted = function(resp){

        window.location.replace('/#/calendar');

     };
// HKA 23.06.2014 update description
  $scope.updateEvent = function(description){
    console.log(description);
    if (description['where']){
      console.log("wheeeeeeeeeeeeeeee");
      var params = {'entityKey':$scope.event.entityKey,
                   'where':description['where']};


    }
     if (description['description']){
      console.log("descrripppppp");
      var params = {'entityKey':$scope.event.entityKey,
                   'description':description['description']};
            
    }
   
 Event.patch($scope,params);

        };

  
  // Google+ Authentication
  Auth.init($scope);
}]);
app.controller('EventListController',['$scope','$filter','$route','Auth','Note','Event','Task','Topic','Comment','User','Contributor','Show','Map',
   function($scope,$filter,$route,Auth,Note,Event,Task,Topic,Comment,User,Contributor,Show,Map) {
//HKA 14.11.2013 Controller to show Events and add comments

   $("ul.page-sidebar-menu li").removeClass("active");
   $("#id_Calendar").addClass("active");

   document.title = "Calendar: Home";
     $scope.isSignedIn = false;
     $scope.immediateFailed = false;
     $scope.nextPageToken = undefined;
     $scope.prevPageToken = undefined;
     $scope.isLoading = false;
     $scope.pagination = {};
     $scope.currentPage = 01;
     $scope.pages = [];
     $scope.paginationcomment = {};
     $scope.currentPagecomment = 01;
     $scope.pagescomment = [];
     $scope.addresses=[];
     $scope.event={};
     $scope.notes = [];
     $scope.users = [];
     $scope.user = undefined;
     $scope.slected_memeber = undefined;
     $scope.role= 'participant';
     $scope.isContentLoaded = true;
     $scope.title_event="New Event" ;
     $scope.permet_clicking=true ;
     // What to do after authentication

     $scope.runTheProcess = function(){
          var eventid = {'id':$route.current.params.eventId};
          $scope.renderCalendar();
         // Event.list($scope);
          User.list($scope,{});





     };
     $scope.renderCalendar = function(){

        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          defaultView:'agendaWeek',
          editable: true,
          eventSources: [{
            events: function(start, end, timezone, callback) {
              // events client table to feed the calendar .  // hadji hicham  08-07-2014 10:40
              var events=[];

              var params = {
                            'events_list_start':moment(start).format('YYYY-MM-DDTH:mm:00.000000'),
                            'events_list_end':moment(end).format('YYYY-MM-DDTH:mm:00.000000')
                            };
              var params1={}  
              $scope.isLoading = true;
 
                 // load events 
              gapi.client.crmengine.events.list_fetch(params).execute(function(resp) { 
                                if(!resp.code){
                                  $scope.events_cal_list= resp.items;

                                  $scope.$apply();  
                                }
                                else{
                                    if(resp.code==401){
                                            $scope.refreshToken();
                                            $scope.isLoading = false;
                                            $scope.$apply();
                                    };
                                }
               });  


               // load tasks 
                      gapi.client.crmengine.tasks.listv2(params1).execute(function(resp) {
                                if(!resp.code){

                                  $scope.tasks_list=resp.items;
                                  $scope.$apply();

                                   try {
                                      // feed events client table with events .hadji hicham  08-07-2014 10:40
                                     if($scope.events_cal_list){
                                      for(var i=0;i<$scope.events_cal_list.length;i++ ){

                                              var allday= ($scope.events_cal_list[i].allday=="false") ? false :true ;
                                        
                                                
                                                events.push({ 
                                                           id: $scope.events_cal_list[i].id ,
                                                           title:$scope.events_cal_list[i].title,
                                                           start:moment($scope.events_cal_list[i].starts_at),
                                                           end: moment($scope.events_cal_list[i].ends_at),
                                                           entityKey:$scope.events_cal_list[i].entityKey,
                                                           url:'/#/events/show/'+$scope.events_cal_list[i].id.toString(),
                                                           allDay:allday,
                                                           my_type:"event"
                                                       })

                                                
                                      };
                                     }else{
                                       console.log("events list is empty");
                                     }
                                     // feed events client table with tasks  hadji hicham  08-07-2014 10:40
                                     
                                     if($scope.tasks_list){
                                            for(var i=0;i<$scope.tasks_list.length;i++ ){
                                        

                                            events.push({ 
                                                           id: $scope.tasks_list[i].id ,
                                                           title:$scope.tasks_list[i].title,
                                                           start:moment($scope.tasks_list[i].due),
                                                           entityKey:$scope.tasks_list[i].entityKey,
                                                           url:'/#/tasks/show/'+$scope.tasks_list[i].id.toString(),
                                                           backgroundColor:$scope.tasks_list[i].status_color,
                                                           color:$scope.tasks_list[i].status_color,
                                                           allDay:true,
                                                           due:moment($scope.tasks_list[i].due),
                                                           my_type:"task"
                                                       })
                                                
                                      }
                                     }else{
                                      console.log("tasks list is empty");
                                     }

                                        
                                    
                                      
                                      
                                     
                                         
                                      
                                       
                                  
                                    
                                       // feed the calendar client table with events and tasks . hadji hicham  08-07-2014 10:40
                                       callback(events); 
                            
                                       }catch (e){
                                               console.log(e.message);
                                               callback(events);
                                          }
                                          $scope.$apply();

                                }
                                 else{
                                    if(resp.code==401){
                                            $scope.refreshToken();
                                            $scope.isLoading = false;
                                            $scope.$apply();
                                    };
                                }

                 });  
               // end  

                  $scope.isLoading = false;  
                                
            }
          }
          ],
          dayClick: function(date,  jsEvent, view) {

              if(view.name=="month"){
                $scope.allday=true ;
                $scope.start_event= moment(date).format('YYYY-MM-DDTHH:mm:00.000000')
                $scope.start_event_draw=date.format();
                $scope.end_event_draw= date.add('days',1).format();
                $scope.end_event= moment(date.add('hours',23).add('minute',59).add('second',59)).format('YYYY-MM-DDTHH:mm:00.000000');
                console.log($scope.end_event)
                $scope.$apply();

                }else{
               $scope.allday=false ;
               $scope.start_event= moment(date).format('YYYY-MM-DDTHH:mm:00.000000')
               $scope.start_event_draw=date.format();
               $scope.end_event_draw= date.add('hours',1).format();
               $scope.end_event= moment(date.add('hours',1)).format('YYYY-MM-DDTHH:mm:00.000000');
               $scope.$apply();
              }
               
    
            if( $scope.permet_clicking){
              // $scope.end_event=date.add('hours',1).format('YYYY-MM-DDTHH:mm:00.000000');
            var eventObject = {
                    title: $scope.title_event 
                };
                    eventObject.id ="new";
                    eventObject.start = moment($scope.start_event_draw);
                 

                    eventObject.allDay = $scope.allday;
                 
              eventObject.className = $(this).attr("data-class");
    
              $('#calendar').fullCalendar('renderEvent', eventObject, false);     
                   $scope.showEventModal();
               }
                             }, 
      // Triggered when event dragging begins. hadji hicham  08-07-2014 10:40
       eventDragStart: function( event, jsEvent, ui, view ) { },
       // Triggered when event dragging stops. 
       eventDragStop:function( event, jsEvent, ui, view ) {

           
        },
       // Triggered when dragging stops and the event has moved to a different day/time. hadji hicham  08-07-2014 10:40
       eventDrop:function( event, revertFunc, jsEvent, ui, view ) { 


                   // drag the events is allow in all cases !  hadji hicham  08-07-2014 10:40
                   if(event.my_type=="event"){
                    


                      if(event.allDay){

                    var params={
                                 'id':event.id,
                                 'entityKey':event.entityKey,
                                 'starts_at':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'ends_at':moment(event.start.add('hours',23).add('minute',59).add('second',59)).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'allday':event.allDay.toString()
                    }
                   
                   }else{
                       
                    if(event.end){
                        var params={
                                 'id':event.id,
                                 'entityKey':event.entityKey,
                                 'starts_at':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'ends_at':moment(event.end).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'allday':event.allDay.toString()
                    }
                  }else{
                   
                      var params={
                                 'id':event.id,
                                 'entityKey':event.entityKey,
                                 'starts_at':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'ends_at':moment(event.start.add('hours',2)).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'allday':event.allDay.toString()
                    }
                  }
                   
                   }
                 
                   
                   Event.patch($scope,params);
                   }
                   // drag tasks is allow only in the case all day  hadji hicham  08-07-2014 10:40
                   else if(event.my_type=="task"){
                       if(event.allDay){
                        // this function make the task change their color of status . hadji hicham  08-07-2014 10:40
                           $scope.changeColorState(event); 

                             var params={
                                 'id':event.id,
                                 'entityKey':event.entityKey,
                                 'due':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000')             
                                  }
                              


                              

                            Task.patch($scope,params);

                       }else{
                        $('#calendar').fullCalendar( 'refetchEvents' );

                    
                       }


                   } 
                   
                 

                 
               
                
           },

     //Triggered when event resizing begins.
       eventResizeStart:function( event, jsEvent, ui, view ) { },
       //Triggered when event resizing stops.
       eventResizeStop:function( event, jsEvent, ui, view ) { },
       //Triggered when resizing stops and the event has changed in duration.
       eventResize:function( event, jsEvent, ui, view ) {
       var params={}; 
        if(event.allDay){
              params={
                                'id':event.id,
                                'entityKey':event.entityKey,
                                'starts_at':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000'),
                                'ends_at':moment(event.end).format('YYYY-MM-DDTHH:mm:00.000000'),
                                'allday':'false'
                    }
            }else{
              params={
                                'id':event.id,
                                'entityKey':event.entityKey,
                                'starts_at':moment(event.start).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'ends_at':moment(event.end).format('YYYY-MM-DDTHH:mm:00.000000'),
                                 'allday':'false'
                    }

            }
                  
                    Event.patch($scope,params);
        }
         // the end of initialisation   . hadji hicham  08-07-2014       


        });
     }



     // show event modal 

     $scope.showEventModal= function(){  
     $('#newEventModal').modal('show');
};



// change color status of the tasks when we drag them . hadji hicham 08-07-2014.

$scope.changeColorState= function(event){


   var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
   DueDate=new Date(event.start);
   NowDate=new Date(Date.now());


   var diffDays = Math.round((DueDate.getTime() - NowDate.getTime())/(oneDay));



   if(diffDays >=0 && diffDays <= 2){
      event.color="orange"
      event.backgroundColor="orange"
   }else if(diffDays<0){
        event.color="red"
      event.backgroundColor="red"
   }else {
      event.color="green"
      event.backgroundColor="green"
   }
  
 
}
// cancel add event operation 

$scope.cancelAddOperation= function(){
  var events =$('#calendar').fullCalendar( 'clientEvents' ,["new"] );
   var event= events[events.length-1];
   
    $('#calendar').fullCalendar( 'removeEvents' ,

 function(event){

    if(event.title == "New Event"){

   return true;
   }
   return false;
  }
      );
    $scope.start_event="" ;
    $scope.end_event="";
     $scope.permet_clicking=true ;
}


// add event operation 


 $scope.addEvent = function(ioevent){

          $scope.permet_clicking=false ;

          var params ={};


        $scope.updateEventRender(ioevent) ;
        $('#newEventModal').modal('hide');


            if(ioevent.title!=""){

              params ={'title': ioevent.title,
                      'starts_at':  $scope.start_event,
                      'ends_at': $scope.end_event,
                      'where': ioevent.where,
                      'allday':$scope.allday.toString()
                        }
              
            }else{
                 params ={
                      'starts_at':$scope.start_event,
                      'ends_at': $scope.end_event,
                      'where': ioevent.where,
                      'allday':$scope.allday.toString()
                        }
            };

 

           console.log(params);
          Event.insert($scope,params);
            $scope.ioevent={};

            $scope.start_event="";
            $scope.end_event="";       
       
     }

$scope.updateEventRender=function(ioevent){
 
     
    var events =$('#calendar').fullCalendar( 'clientEvents' ,["new"] );
    events[0].title=ioevent.title ;
    $('#calendar').fullCalendar('updateEvent', events[0]);
   
   
    ///  $('#calendar').fullCalendar( 'refetchEvents' );
};

//
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };
     $scope.$watch('event.starts_at', function(newValue, oldValue) {
              $scope.patchDate($scope.event.starts_at);
     });
     $scope.patchDate = function(newValue){
        var starts_at = $filter('date')(newValue,['yyyy-MM-ddTHH:mm:00.000000']);
        var params = {
                    'entityKey':$scope.event.entityKey,
                    'starts_at':starts_at
        };
        if ((!$scope.isLoading) && (params.entityKey != undefined )){
            Event.patch($scope,params);
        }
     }
      $scope.listNextPageItemscomment= function(){

         console.log('i am in list next comment page')
        var nextPage = $scope.currentPagecomment + 1;

        var params = {};
          if ($scope.pagescomment[nextPage]){
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                       'order':'-updated_at',
                      'pageToken':$scope.pagescomment[nextPage]
                     }
          }else{
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                      'order':'-updated_at',}
          }
          console.log('in listNextPageItems');
          $scope.currentPagecomment = $scope.currentPagecomment + 1 ;
          Comment.list($scope,params);
     }

     $scope.listPrevPageItemscomment = function(){

       var prevPage = $scope.currentPagecomment - 1;
       var params = {};
          if ($scope.pagescomment[prevPage]){
            params = {'limit':5,
                      'discussion':$scope.eventt.entityKey,
                      'order':'-updated_at',
                      'pageToken':$scope.pagescomment[prevPage]
                     }
          }else{
            params = {'limit':5,
            'order':'-updated_at',
            'discussion':$scope.eventt.entityKey}
          }
          $scope.currentPagecomment = $scope.currentPagecomment - 1 ;
          Comment.list($scope,params);
     };

     $scope.renderMaps = function(){
          console.log("hhhhhhhhhhhhh");
          Map.render($scope);
          //Map.searchLocation($scope,$scope.event.where);
      };



     $scope.showModal = function(){
        console.log('button clicked');
        $('#addAccountModal').modal('show');

      };

    $scope.addComment = function(comment){

      var params ={
                  'about':$scope.event.entityKey,
                  'content':$scope.comment.content
                };
      Comment.insert($scope,params);
      $scope.comment.content='';


    };
    $scope.ListComments = function(){
      var params = {
                    'about':$scope.event.entityKey,
                    'limit':7
                   };
      Comment.list($scope,params);


    };
//HKA 18.11.2013 highlight the comment
   $scope.hilightComment = function(){
        console.log('Should higll');
       $('#comment_0').effect( "bounce", "slow" );
       $('#comment_0 .message').effect("highlight","slow");
     };

 //HKA 02.12.2013 Add Contributor

    $scope.addNewContributor = function(selected_user,role){
      console.log('*************** selected user ***********************');
      console.log(selected_user);

      var params = {
                      'discussionKey': $scope.eventt.entityKey,

                      'type': 'user',
                      'value': selected_user.email,
                      'name': selected_user.google_display_name,
                      'photoLink': selected_user.google_public_profile_photo_url,
                      'role': role


                      // Create Contributor Service
                      // Create contributors.list api
                      //list all contributors after getting the task.


        }
        console.log('selected member');
        console.log(params);
        Contributor.insert($scope,params);
     $('#addContributor').modal('hide');
     };
//HKA 02.12.2013 Select member
$scope.selectMember = function(){

        $scope.slected_memeber = $scope.user;
        $scope.user = $scope.slected_memeber.google_display_name;

     };
//HKA 02.12.2013 List contributors
$scope.listContributors = function(){
      var params = {'discussionKey':$scope.eventt.entityKey,
                     'order':'-created_at'};
      Contributor.list($scope,params);
      };
//HKA 20.01.2014 Add
 $scope.getshow = function(showId){
     var show = Show.get($scope.showId);
     return show;

 }

  // Google+ Authentication
  Auth.init($scope);
}]);
