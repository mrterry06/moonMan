angular.module('moonMan.controllers', ['moonMan.services'])



/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .-----------------. .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |      __      | || |     ______   | || |     ______   | || |     ____     | || | _____  _____ | || | ____  _____  | || |  _________   | |
| |     /  \     | || |   .' ___  |  | || |   .' ___  |  | || |   .'    `.   | || ||_   _||_   _|| || ||_   \|_   _| | || | |  _   _  |  | |
| |    / /\ \    | || |  / .'   \_|  | || |  / .'   \_|  | || |  /  .--.  \  | || |  | |    | |  | || |  |   \ | |   | || | |_/ | | \_|  | |
| |   / ____ \   | || |  | |         | || |  | |         | || |  | |    | |  | || |  | '    ' |  | || |  | |\ \| |   | || |     | |      | |
| | _/ /    \ \_ | || |  \ `.___.'\  | || |  \ `.___.'\  | || |  \  `--'  /  | || |   \ `--' /   | || | _| |_\   |_  | || |    _| |_     | |
| ||____|  |____|| || |   `._____.'  | || |   `._____.'  | || |   `.____.'   | || |    `.__.'    | || ||_____|\____| | || |   |_____|    | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' */



.controller('accountCtrl', function($scope, $state, dateHandler, billService, extraService, accountService, currencyProcessing, $rootScope){

  $scope.bill = {};
  $scope.needs = {};
 

  $rootScope.$on('closedWindow', function(){
  
      billService.getBills().then(function(value){
          $scope.listBills = value || [];
      });

      accountService.getNeeds().then(function(value){
          $scope.listNeeds = value || [];
      });

  });

  $scope.$on('$ionicView.beforeEnter', function(){
  
      $scope.finance.title = "Account";
    
      currencyProcessing.gotPaid();

      billService.userInfo().then(function(obj){
 
          !obj.initial ? $scope.account.total = 500 : $scope.account.total = obj.initial;
 
      });



    accountService.getNeeds().then(function(value){

      $scope.listNeeds = value || [];
 
    });

    billService.getBills().then(function(value){
    
      $scope.listBills = value || [];
    
    });

    currencyProcessing.processBills();
    currencyProcessing.processNeeds();
  });

 
  $scope.remove = function(index, array){
   
      if (array == "needs") {
         $scope.listNeeds.splice(index, 1);
          accountService.resetNeeds($scope.listNeeds);
   
      } else {
         $scope.listBills.splice(index, 1);
         billService.resetBills($scope.listBills);
      }

  }

    $scope.account.total = billService.userInfo().initial || 500;

    $scope.adjust = function(num){

      $scope.account.total += num;

      billService.resetInitial($scope.account.total);

    }

    $scope.extraSpending = function(){
      extraService.openModal();
    }


    $scope.openBillModal = function(){
      billService.openWindow();

    }

    $scope.listOfDays = accountService.returnDays();

    $scope.addNeed = function(needs){

        needs.nextPayment = dateHandler.getTomorrow();

        if ( parseInt(needs.occurance)  > 1  ){

            var adjustingInfo = accountService.lastActiveDayOfWeek(needs.weekBegan);
            
            if (adjustingInfo[1] != dateHandler.getToday()){

              needs.nextPayment = dateHandler.dayCountAdjust( adjustingInfo[1] + 7);
            
            }

        } 


        $scope.listNeeds.push(needs);

        accountService.resetNeeds($scope.listNeeds);

        $scope.needs = {};

    }


      
    

})



/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |     ____     | || | _____  _____ | || |  _________   | || |     ______   | || |     ____     | || | ____    ____ | || |  _________   | |
| |   .'    `.   | || ||_   _||_   _|| || | |  _   _  |  | || |   .' ___  |  | || |   .'    `.   | || ||_   \  /   _|| || | |_   ___  |  | |
| |  /  .--.  \  | || |  | |    | |  | || | |_/ | | \_|  | || |  / .'   \_|  | || |  /  .--.  \  | || |  |   \/   |  | || |   | |_  \_|  | |
| |  | |    | |  | || |  | '    ' |  | || |     | |      | || |  | |         | || |  | |    | |  | || |  | |\  /| |  | || |   |  _|  _   | |
| |  \  `--'  /  | || |   \ `--' /   | || |    _| |_     | || |  \ `.___.'\  | || |  \  `--'  /  | || | _| |_\/_| |_ | || |  _| |___/ |  | |
| |   `.____.'   | || |    `.__.'    | || |   |_____|    | || |   `._____.'  | || |   `.____.'   | || ||_____||_____|| || | |_________|  | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' */



.controller('outcomeCtrl', function($scope){
  
  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.finance.title = "Outcome";
  });
  $scope.line = {};
  $scope.test = {};

  $scope.test.options = {
    chart:{
      type: 'pieChart',
      height: 500,
      x: function(d){ return d.key;},
      y: function(d){ return d.y; },
      showLabels: true,
      duration: 500,
      labelThreshold: 0.01,
      labelSunBeamLayout: true,
      width: 320,
      title: "We Did It!",
      donut: true,
      legend: {
        margin: {
          top: 5,
          right: 0,
          bottom: 5,
          left: 0
        }
      }
    }
  };
  $scope.test.data = [{key: "One", y:5}, {key:"Two", y:2}, {key:"Three", y:9}, {key:"Four", y:7}, {key:"Five", y:4}, {key:"Six", y:3}, {key:"Seven", y:.5}];


 $scope.line.options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: false,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (Years)'
                },
                yAxis: {
                    axisLabel: '$Amount ',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant,<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.line.data = sinAndCos();

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e'  //color - optional: choose your own line color.
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };

})


/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .-----------------. .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |      __      | || |     ______   | || |     ______   | || |     ____     | || | _____  _____ | || | ____  _____  | || |  _________   | |
| |     /  \     | || |   .' ___  |  | || |   .' ___  |  | || |   .'    `.   | || ||_   _||_   _|| || ||_   \|_   _| | || | |  _   _  |  | |
| |    / /\ \    | || |  / .'   \_|  | || |  / .'   \_|  | || |  /  .--.  \  | || |  | |    | |  | || |  |   \ | |   | || | |_/ | | \_|  | |
| |   / ____ \   | || |  | |         | || |  | |         | || |  | |    | |  | || |  | '    ' |  | || |  | |\ \| |   | || |     | |      | |
| | _/ /    \ \_ | || |  \ `.___.'\  | || |  \ `.___.'\  | || |  \  `--'  /  | || |   \ `--' /   | || | _| |_\   |_  | || |    _| |_     | |
| ||____|  |____|| || |   `._____.'  | || |   `._____.'  | || |   `.____.'   | || |    `.__.'    | || ||_____|\____| | || |   |_____|    | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
 .----------------.  .----------------.  .----------------.  .----------------.                                                             
| .--------------. || .--------------. || .--------------. || .--------------. |                                                            
| | ____    ____ | || |     ____     | || |  _______     | || |  _________   | |                                                            
| ||_   \  /   _|| || |   .'    `.   | || | |_   __ \    | || | |_   ___  |  | |                                                            
| |  |   \/   |  | || |  /  .--.  \  | || |   | |__) |   | || |   | |_  \_|  | |                                                            
| |  | |\  /| |  | || |  | |    | |  | || |   |  __ /    | || |   |  _|  _   | |                                                            
| | _| |_\/_| |_ | || |  \  `--'  /  | || |  _| |  \ \_  | || |  _| |___/ |  | |                                                            
| ||_____||_____|| || |   `.____.'   | || | |____| |___| | || | |_________|  | |                                                            
| |              | || |              | || |              | || |              | |                                                            
| '--------------' || '--------------' || '--------------' || '--------------' |                                                            
 '----------------'  '----------------'  '----------------'  '----------------'      */                                                       

.controller('accountMore', function($scope, $state, accountMoreService, $ionicPopup){
  $scope.want = {};
  $scope.goal = {};

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.finance.title = "Account";
    accountMoreService.getAllInfo().then(function(needsAndWants){
       
       $scope.wants = needsAndWants.wants || [];
       $scope.goals = needsAndWants.goals || [];

    });

    localforage.getItem('userInfo').then(function(userInfo){
        $scope.currentAmount= userInfo.initial;
        $scope.currentSavings = userInfo.savingsAmount;
        $scope.savings = userInfo.savings;
    });

  });

  $scope.isAccountMore = true;

  $scope.$on('$ionicView.leave', function(){
    $scope.isAccountMore = false;
  });

  $scope.addWant = function(want){
    $scope.wants.push(want);
    $scope.want = {};
    accountMoreService.storeWants($scope.wants);
  }

  $scope.addGoal = function(goal){
    $scope.goals.push(goal);
    $scope.goal = {};
    accountMoreService.storeGoals($scope.goals);
  }

  $scope.purchaseOrRemove = function(item, i, arrName, action){
    
      function purchaseType(purchaseType){

        var selectedArr; 

        arrName == 'wants' ? ( $scope.wants.splice(i, 1), selectedArr = $scope.wants ): ( $scope.goals.splice(i, 1), selectedArr = $scope.goals );

         action === "Purchase" ? accountMoreService.purchase(item, selectedArr, arrName, purchaseType) : accountMoreService.remove(item, selectedArr , arrName);
              
      }


    
      $ionicPopup.show({
          title: action, 
          template: "Are you sure you want to " + action.toLowerCase() + " this item?",
          scope: $scope,
          buttons: [{text: 'Cancel'}, {text: '<b>' + action + '</b>',
            type: 'button-outline ' + ( action == "Purchase" ? "button-positive" : "button-assertive"),
            onTap: function(e){

              if(action !== "Purchase"){
                purchaseType();
                return;
              }

                $ionicPopup.show({
                  title: "Purchase Type",
                  scope: $scope,
 
                  buttons: [{
 
                    text: '<b>Savings</b>',
 
                    type: 'button-positive',
 
                    onTap: function(){
 
                      purchaseType('savings');
 
                    }
 
                  },{
 
                    text: '<b>Current</b>',
 
                    type: 'button-outline button-balanced',
 
                    onTap: function(){
                      purchaseType('current');
 
                    }
 
                  }]
                });

             
            }
            
          }]
      });

  }
})

/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| | _____  _____ | || |   ______     | || |  ________    | || |      __      | || |  _________   | || |  _________   | |
| ||_   _||_   _|| || |  |_   __ \   | || | |_   ___ `.  | || |     /  \     | || | |  _   _  |  | || | |_   ___  |  | |
| |  | |    | |  | || |    | |__) |  | || |   | |   `. \ | || |    / /\ \    | || | |_/ | | \_|  | || |   | |_  \_|  | |
| |  | '    ' |  | || |    |  ___/   | || |   | |    | | | || |   / ____ \   | || |     | |      | || |   |  _|  _   | |
| |   \ `--' /   | || |   _| |_      | || |  _| |___.' / | || | _/ /    \ \_ | || |    _| |_     | || |  _| |___/ |  | |
| |    `.__.'    | || |  |_____|     | || | |________.'  | || ||____|  |____|| || |   |_____|    | || | |_________|  | |
| |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  */


.controller('updateCtrl', function($scope, $state, updateService, $ionicPopup){



  

  $scope.$on("$ionicView.beforeEnter", function(){
    $scope.finance.title = "Update";
  
    $scope.percentages = updateService.getPercentages;
    
     updateService.grabInfo().then(function(val){

       console.log(val);
     
       $scope.edit = val;
     
     });

  });

  $scope.update = function(info){
      
      $scope.loading = true;
      
      updateService.updateInfo(info).then(function(res){
      
        $scope.loading = false;
      
        $ionicPopup.alert({
          title: "Updated!",
          template: "Your information has been updated"
        });

    });
  }
  
    
})



/*   _____       _______ _    _ ______ _____  
  / ____|   /\|__   __| |  | |  ____|  __ \ 
 | |  __   /  \  | |  | |__| | |__  | |__) |
 | | |_ | / /\ \ | |  |  __  |  __| |  _  / 
 | |__| |/ ____ \| |  | |  | | |____| | \ \ 
  \_____/_/    \_\_|  |_|  |_|______|_|  \_\ */



.controller('gatherInfo', function($scope, $state, $ionicHistory, billService){

  $scope.gather = {};


  $scope.percentages = billService.getPercentages();

  $scope.$on("$ionicView.leave", function(){
    
    billService.init($scope.gather);
    
  });

})

 /*.----------------.  .----------------.  .-----------------. .----------------.  .-----------------. .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |  _________   | || |     _____    | || | ____  _____  | || |      __      | || | ____  _____  | || |     ______   | || |  _________   | |
| | |_   ___  |  | || |    |_   _|   | || ||_   \|_   _| | || |     /  \     | || ||_   \|_   _| | || |   .' ___  |  | || | |_   ___  |  | |
| |   | |_  \_|  | || |      | |     | || |  |   \ | |   | || |    / /\ \    | || |  |   \ | |   | || |  / .'   \_|  | || |   | |_  \_|  | |
| |   |  _|      | || |      | |     | || |  | |\ \| |   | || |   / ____ \   | || |  | |\ \| |   | || |  | |         | || |   |  _|  _   | |
| |  _| |_       | || |     _| |_    | || | _| |_\   |_  | || | _/ /    \ \_ | || | _| |_\   |_  | || |  \ `.___.'\  | || |  _| |___/ |  | |
| | |_____|      | || |    |_____|   | || ||_____|\____| | || ||____|  |____|| || ||_____|\____| | || |   `._____.'  | || | |_________|  | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  */

.controller('financeCtrl', function($scope, $ionicPopover, $ionicSideMenuDelegate, $state){
  

  $scope.finance = {};
  $scope.account = {};
  $scope.navPopover;
  $ionicPopover.fromTemplateUrl('templates/menu.html',{
    scope: $scope

  }).then(function(navigationPopover){
      $scope.navPopover = navigationPopover;

  });


  $scope.states = [{
    name: 'More On Account',
    state: "finance.account-more"  
  }, {
    name: "Outcome",
    state: "finance.outcome"

  }, {
    name: 'Settings',
    state: "finance.update"
  }, {
    name: "Contact",
    state: "finance.contact"
  }];


  $scope.changeState = function(targetState){
    console.log(targetState);
    $state.go(targetState);
    $scope.navPopover.hide();
  }

  $scope.openNavigationMenu = function(element){
   

    $scope.navPopover.show(element);
    
  }

})

/* .----------------.  .----------------.  .-----------------. .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |     ______   | || |     ____     | || | ____  _____  | || |  _________   | || |      __      | || |     ______   | || |  _________   | |
| |   .' ___  |  | || |   .'    `.   | || ||_   \|_   _| | || | |  _   _  |  | || |     /  \     | || |   .' ___  |  | || | |  _   _  |  | |
| |  / .'   \_|  | || |  /  .--.  \  | || |  |   \ | |   | || | |_/ | | \_|  | || |    / /\ \    | || |  / .'   \_|  | || | |_/ | | \_|  | |
| |  | |         | || |  | |    | |  | || |  | |\ \| |   | || |     | |      | || |   / ____ \   | || |  | |         | || |     | |      | |
| |  \ `.___.'\  | || |  \  `--'  /  | || | _| |_\   |_  | || |    _| |_     | || | _/ /    \ \_ | || |  \ `.___.'\  | || |    _| |_     | |
| |   `._____.'  | || |   `.____.'   | || ||_____|\____| | || |   |_____|    | || ||____|  |____|| || |   `._____.'  | || |   |_____|    | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  */

.controller('contactCtrl', function($scope, $http, $ionicPopup, $timeout){


  $scope.$on("$ionicView.beforeEnter", function(){
    $scope.finance.title = "Contact";
  });


  $scope.sendMessage = function(message){
  var emailRegEx =   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.loading = true;
  
  if ( !emailRegEx.test(message.email) ){
      $scope.loading = false;


    $ionicPopup.alert({
          title: "Invalid Email",
          template: "The email you have inserted is invalid, please enter a valid email"
      });
    return;
  }


    // When going to production uncomment the  body  below
  //    $http.post('ec2Address/mail', message).then(function(){
  //       $scope.mail = {};
  //       $scope.loading = false;
  //       $ionicPopup.alert({
  //         title: "Sent!",
  //         template: "Your message has been since, We will get back to you as soon as possible"
  //     }, function(err){
  //         console.warn(err);
  //         $scope.loading = false;
  //         $ionicPopup.alert({
  //           title: "Message failed to send",
  //           template: "The message failed to send, We apologize for that."
  //         });
  //     });

  //    });

  //Delete when going to production
    $timeout(function(){
      $scope.loading = false;
      $scope.mail = {};
    }, 2000);
  }

})
.controller('pinPadCtrl', function($scope){
  $scope.colors = ["red","yellow","blue", "green", "orange", "purple", "gold", "white", "pink"];
  $scope.events = ["Delete", "Submit"];
  $scope.passArr = [];

  $scope.$watchCollection('passArr', function(){

    if($scope.passArr.length == 4){
      $scope.loading = true;
      $scope.passArr.join('');
    }
  });

  $scope.chosenColor = function(color){
    console.log(color);
    $scope.passArr.push(color);
  }
})
.controller('menuCtrl', function(){
})
.controller('settingsCtrl', function($scope){

});


