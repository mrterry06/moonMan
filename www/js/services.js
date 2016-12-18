angular.module('moonMan.services', [])

.factory('billService', function($rootScope, $ionicModal, $q){

  var billScope = $rootScope.$new(true);
  var billModal;
  billScope.bill = {};
  billScope.accumulatedInfo = {};

  billScope.$watchCollection('accumulatedInfo', function(){
     console.log(billScope.accumulatedInfo);
    if (billScope.accumulatedInfo.hasOwnProperty('savings')){
        
        localforage.setItem('profileInfo', {
         
          current: billScope.accumulatedInfo['initial'],
          amount:  parseFloat(billScope.accumulatedInfo['payCheckAmount']),
          weekday: billScope.accumulatedInfo['paydayOfWeek'],
          goal: parseFloat(billScope.accumulatedInfo['savings']),
          frequency: billScope.accumulatedInfo['reoccurance'],
          currentSavings: parseFloat(billScope.accumulatedInfo['savingsAmount']),
          savingsPercentage: billScope.accumulatedInfo['savingsPercentage']        
        });
    
    }

    localforage.setItem("registered", true);

  })  

  $ionicModal.fromTemplateUrl('templates/account/bill.html',{
    
        animation: 'slide-in-up',
        scope: billScope
    
      }).then(function(modal){
    
        billModal = modal;
     
      });

      billScope.addBill = function(bill){
        
        localforage.getItem("bills")
          .then(function(arr){
        
              if (!arr)  arr = []; 

              arr[arr.length] = bill;

          localforage.setItem("bills", arr).then(function(){

            console.log("bills successfully stored");

          });

        });

        billScope.bill = {};
        billModal.hide();
  }


  return {

        openWindow: function(){

          billModal.show();
          
        },
        getBills: function(){

         return localforage.getItem("bills").then(function(value){

            return value || [];

         });

        },
        resetBills: function(newBills){
          localforage.setItem("bills", newBills);

        },

        init: function(obj){

          console.log(obj);
          var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
          var yearFirstDay = Math.floor(timeStamp / 86400000);
          var today = Math.ceil((new Date().getTime())/ 86400000);
          var userSignUpDate = today - yearFirstDay;


          if (obj.hasOwnProperty('initial') && typeof obj['initial'] == "string"){
              
                obj['initial'] = parseFloat(obj['initial']);
               billScope.accumulatedInfo['initial'] = obj['initial'];
          }

        
          if(obj['lastPayDate'] && typeof obj['lastPayDate'] !== Number){
            var strDate = obj['lastPayDate'].toString(),
            strMonth = obj['lastPayDate'].getMonth(), 
             arr = strDate.split(" "),
              realDate = (strMonth + 1) + "-" + arr[2] + "-" + arr[3]; 
            billScope.accumulatedInfo["lastPayDate"] = (Math.ceil((new Date(realDate).getTime())/ 86400000)) - yearFirstDay;

          }
          
          if (!billScope.accumulatedInfo["dayOfYear"]){
            billScope.accumulatedInfo["dayOfYear"] = userSignUpDate;
          }

          for (var key in obj){
            if(!billScope.accumulatedInfo.hasOwnProperty(key)){
              billScope.accumulatedInfo[key] = obj[key];
            }
          }


          localforage.setItem('userInfo', billScope.accumulatedInfo).then(function(){
            
            console.log("User information has been stored");

          });
        },
        userInfo: function(){
          
          return localforage.getItem('userInfo').then(function(value){
          
              return value;

          });
        },
        resetInitial: function(data){
          billScope.accumulatedInfo['initial'] = data;
          
          localforage.setItem('userInfo', billScope.accumulatedInfo).then(function(){
            
            console.log("Initial property is being changed");
          
          });
        },
        getPercentages: function(){
          var percentages = [];

          for(var i = 0; i < 61; i++){
             if(i == 2 || i % 5 == 0){
          
                percentages.push({
                  percent: i + "%",
                  float: (i / 100),
          
                });
             }
          }

          return percentages;

        }

      }

})

.factory('currencyProcessing', function($rootScope){

     var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
     var yearFirstDay = Math.floor(timeStamp / 86400000);
     var today = Math.ceil((new Date().getTime())/ 86400000);
     var dayOfYear = today - yearFirstDay;


  function getUserInfo(){
   return localforage.getItem('userInfo').then(function(value){
      
      console.log(value);
      
      return value;
    
    });
  
  }


  return {

    gotPaid: function(){

      getUserInfo().then(function(userObj){

          var pay = 0;
          var check = parseInt(userObj.payCheckAmount);
          var lastPayDate = userObj.lastPayDate;
          var dayIncrement;

          if (userObj.reoccurance == 'weekly'){
            dayIncrement =7;
          } else if (userObj.reoccurance =="bi-weekly"){
            dayIncrement = 14;
          } else {
            dayIncrement = 30;
          }


      
         while (lastPayDate <= dayOfYear){
            lastPayDate += dayIncrement;
            if (lastPayDate <= dayOfYear){
              pay += check;
            }

         }


           userObj.initial += pay;
           userObj.lastPayDate = lastPayDate;


        localforage.setItem('userInfo', userObj);

      });

    }

  }


})

.factory('accountService', function(){


    return {
      resetNeeds: function(objArray){
        localforage.setItem('needs', objArray).then(function(){
          console.log("Needs has been successfully added");
        });
      },
      getNeeds: function(){
        return  localforage.getItem('needs').then(function(value){
          console.log("grabbing needs");
          return value;
        });
      },
      returnDays: function(){
        var days = [];
        for(var i = 1; i <= 31; i++){
          days.push(i);
        }
        return days;
      }
    }
})

.factory('updateService', function($rootScope, billService){



  return {
    grabInfo: function(){
      return localforage.getItem('profileInfo')
        .then(function(val){
          console.warn(val);
          return val || {};
        });
    },
    updateInfo: function(info){
      return localforage.setItem('profileInfo', info)
            .then(function(){
              
              console.log("stored profileInfo");
              
              return localforage.getItem('userInfo').then(function(val){

                  val.initial = info.current;
                  val.payCheckAmount = info.amount;
                  val.paydayOfWeek = info.weekday;
                  val.savings = info.goal;
                  val.reoccurance = info.frequency;
                  val.savingsAmount = info.savingsAmount;
                  val.savingsPercentage = info.savingsPercentage;
                  return  localforage.setItem('userInfo', val).then(function(){
                  
                      console.log("Reset User Info");
                  
                      return true;
                  
                  });

               });

            }).catch(function(err){
              console.warn(err);
              return false;
            });
    },

    getPercentages: billService.getPercentages()
  }
})

.factory('accountMoreService', function($rootScope){


  function storingWants(wantsArr){

      return localforage.getItem('needsAndWants').then(function(val){

           val = val || {};
           val.wants = wantsArr;

         return  localforage.setItem('needsAndWants', val)
          .then(function(){
              
                return true; 
          });
      });
  }

  function grabInfo(){
      
      return localforage.getItem('needsAndWants').then(function(val){

            return val || {};
      });
  }

  function storingGoals(goalsArr){

    return localforage.getItem('needsAndWants').then(function(val){
       val = val || {};
       val.goals = goalsArr;

       return localforage.setItem('needsAndWants', val)
       .then(function(){
          return true;
       });

    });

  }

  function purchase(item, updatedArr, selectedArr, account){

     return localforage.getItem('needsAndWants').then(function(nAw){
        
        return  localforage.getItem('userInfo').then(function(ui){
          
          return localforage.getItem('profileInfo').then(function(pi){
              
              nAw[selectedArr] = updatedArr;
              if(account == 'current'){

                ui.initial -= parseFloat(item.amount);
                pi.current -= parseFloat(item.amount); 

              } else {
                ui.savingsAmount -= item.amount;
                pi.savingsAmount -= item.amount;
              }
            
              
              localforage.setItem('userInfo', uI);
              localforage.setItem('profileInfo', pi);

              return localforage.setItem('needsAndWants', nAw).then(function(){
              
                  return true;
              
              });

          });
        });

     });
  }

  function remove(item, updatedArr, selectedArr){

      return localforage.getItem('needsAndWants').then(function(val){

        val[selectedArr] = updatedArr;

        return localforage.setItem('needsAndWants', val).then(function(){
          return true;
        }); 
      
      });
  }

  return {

     storeWants: storingWants,
     getAllInfo: grabInfo,
     storeGoals: storingGoals,
     purchase: purchase,
     remove: remove

  }



})

.factory('extraService', function($rootScope, $ionicModal, $ionicPopup){

    var extraScope = $rootScope.$new(true);
    var extraModal;
    extraScope.extra = {};

      function extraPayment(paymentType){

       return localforage.getItem('userInfo').then(function(ui){

          return localforage.getItem('profileInfo').then(function(pi){

              ui.initial -= parseFloat(extraScope.extra.amount);
              pi.current -= parseFloat(extraScope.extra.amount);


              localforage.setItem('userInfo', ui); 
              localforage.setItem('profileInfo', pi);
          });

       });

      }



      $ionicModal.fromTemplateUrl('templates/account/extra.html',{
        animation: 'slide-in-up',
        scope: extraScope
      }).then(function(modal){
        extraModal = modal;
        console.log("Extra Modal initiated");
      });

      extraScope.$on('$destroy', function(){
        extraModal.remove();
      });

       extraScope.submitPayment = function(){
          
          $ionicPopup.show({
            title: "Confirmation",
            template: "Are you sure you want to add Extra Spending?",
            scope: extraScope,
            buttons: [{text: "Cancel"
            }, {
              text: "Confirm",
              type:"button-positive button-outline",
              onTap: function(){

                  $ionicPopup.show({
                    title: "Payment",
                    template: "Choose savings or checking",
                    scope: extraScope,
                    buttons: [{ 
                      text:"Savings",
                      type: "button-positive",
                      onTap: function(){
                        extraPayment('savings');
                      }
                      }, {
                       text: "Current",
                       type: "button-balanced button-outline",
                       onTap: function(){
                        extraPayment('current');
                       }
                      }]
                  });
              }

            }]
          });

          extraScope.extra = {};
          extraModal.hide();
       } 
      return {

        openModal: function(){
          extraModal.show();
          extraScope.extra.amount = "";
        }

      }

});

