angular.module('moonMan.controllers', ['moonMan.services'])

.controller('accountCtrl', function($scope, $state, $timeout, billService, extraService, accountService, currencyProcessing){

  $scope.bill = {};
  $scope.needs = {};
  $scope.listNeeds = [];

  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.finance.title = "Account";
    
    currencyProcessing.gotPaid();

    billService.userInfo().then(function(obj){
      if (obj.initial == undefined){ 
        $scope.account.total = 500;
      } else {
        $scope.account.total = obj.initial;
      }
    });

    accountService.getNeeds().then(function(value){

      $scope.listNeeds = value || [];
    });

    billService.getBills().then(function(value){
      $scope.listBills = value || [];
    });
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

    $scope.addBill = function(bill){


      $scope.listBills.push(bill);
    
      $scope.bill = {};
    
    }

    $scope.extraSpending = function(){
      extraService.openModal();
    }


    $scope.openBillModal = function(){
      billService.openWindow();

    }

    $scope.listOfDays = accountService.returnDays();

    $scope.addNeed = function(needs){

     var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
     var yearFirstDay = Math.floor(timeStamp / 86400000);
     var today = Math.ceil((new Date().getTime())/ 86400000);
     var dayOfYear = today - yearFirstDay;


      var d = new Date();
      needs.dayOfWeek = d.getDay();
      needs.dayOfMonth = d.getDate();
      needs.month     = d.getMonth();
      needs.addedDayOfYear = dayOfYear;

      var weekBegan = parseInt(needs.weekBegan);


      if (needs.occurance =="weekly"){

        if ( weekBegan < d.getDay()){
              ///Test this tomorrrow
          var destination = parseInt(needs.weekBegan);
          var tracker = d.getDay();
          var currentDay = dayOfYear;
          while(tracker > destination) {
            currentDay -= 1;
            tracker -= 1;
          }
          
          needs.lastProcessingDate = currentDay;

        } else if (weekBegan > d.getDay()) {

          var destination = d.getDay();
          var lastPayment = ((weekBegan - dest) + dayOfYear) - 7;
          var nextPayment = (weekBegan - dest) + dayOfYear;

          needs.lastProcessingDate = lastPayment;


        } else {

          needs.lastProcessingDate = dayOfYear;

        }
    }


      
      $scope.listNeeds.push(needs);

      accountService.resetNeeds($scope.listNeeds);
      $scope.needs = {};
    }

})
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

.controller('accountMore', function($scope, $state){
  $scope.want = {};
  $scope.goal = {};
  $scope.wants = [];
  $scope.goals = [];


  $scope.$on('$ionicView.beforeEnter', function(){
    $scope.finance.title = "Account";
    localforage.getItem('userInfo').then(function(userInfo){
        $scope.currentAmount= userInfo.initial;
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
  }

  $scope.addGoal = function(goal){
    $scope.goals.push(goal);
    $scope.goal = {};
  }

})

.controller('updateCtrl', function($scope, $state, updateService, $ionicPopup){
  

  $scope.$on("$ionicView.beforeEnter", function(){
    $scope.finance.title = "Update";
     
     updateService.grabInfo().then(function(val){
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

.controller('gatherInfo', function($scope, $state, $ionicHistory, billService){

  $scope.gather = {};



  $scope.$on("$ionicView.leave", function(){
    
    billService.init($scope.gather);
    
  });

})


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

.controller('testCtrl', function($scope , $ionicSideMenuDelegate){

  //     var date1 = "10-14-2016";
  //     var date2 = "10-16-2016";

  //     var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
  //    var yearFirstDay = Math.floor(timeStamp / 86400000);
  //    var today = Math.ceil((new Date().getTime())/ 86400000);
  //    var dayOfYear = today - yearFirstDay;


  //     var timeStamp1 = new Date().setFullYear(new Date().getFullYear(), 0, 1);
  //    var yearFirstDay1 = Math.floor(timeStamp1 / 86400000);
  //    var today1 = Math.ceil((new Date(date1).getTime())/ 86400000);
  //    var dayOfYear1 = today1 - yearFirstDay1;



  //     var timeStamp2 = new Date().setFullYear(new Date().getFullYear(), 0, 1);
  //    var yearFirstDay2 = Math.floor(timeStamp2 / 86400000);
  //    var today2 = Math.ceil((new Date(date2).getTime())/ 86400000);
  //    var dayOfYear2 = today2 - yearFirstDay2;

  // $scope.test = function(){
  //   console.log(dayOfYear);
  //   console.log(dayOfYear1);
  //   console.log(dayOfYear2);

    $ionicSideMenuDelegate.toggleRight();

  

})
.controller('contactCtrl', function($scope,$http, $ionicPopup){


  $scope.$on("$ionicView.beforeEnter", function(){
    $scope.finance.title = "Contact";
  });


  $scope.sendMessage = function(message){
    $scope.loading = true;
    // When going to production uncomment the  body  below
  //    $http.post('ec2Address/mail').then(function(){
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
  }

})
.controller('pinPadCtrl', function($scope){
  $scope.colors = ["red","yello","blue", "green", "orange", "purple", "gold", "white", "pink"];
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


