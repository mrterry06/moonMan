angular.module('moonMan.services', [])

/* _____       _______ ______   _    _          _   _ _____  _      ______ _____   
|  __ \   /\|__   __|  ____| | |  | |   /\   | \ | |  __ \| |    |  ____|  __ \  
| |  | | /  \  | |  | |__    | |__| |  /  \  |  \| | |  | | |    | |__  | |__) | 
| |  | |/ /\ \ | |  |  __|   |  __  | / /\ \ | . ` | |  | | |    |  __| |  _  /  
| |__| / ____ \| |  | |____  | |  | |/ ____ \| |\  | |__| | |____| |____| | \ \  
|_____/_/    \_\_|  |______| |_|  |_/_/    \_\_| \_|_____/|______|______|_|  \_*/ 

.factory('dateHandler', function($rootScope){
  


  return {

    dateParser: function(date){
        var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1),

        yearFirstDay = Math.floor(timeStamp / 86400000);
      
        if (date) desiredDate = Math.ceil((new Date(date).getTime())/ 86400000);
        if (!date) desiredDate = Math.ceil((new Date().getTime())/ 86400000);
        
        desiredDate -= yearFirstDay;
        while (desiredDate > 366){
          desiredDate -= 365;
        }

        return desiredDate;
    },

    dayCountAdjust: function(dayNum){
        
        if (dayNum > 365) {
          return dayNum - 365;
        }

        return dayNum;
    },

    newDateObj: new Date(),

    getThisYear: function(){
    
       return this.newDateObj.getFullYear();
    
    },

    getDayOfWeek: function(){
    
       return this.getDay();
    
    },

    getToday: function(){

       return this.dateParser();

    },
    getTomorrow: function(){

        var tomorrow = this.dateParser() + 1;
        return this.dayCountAdjust(tomorrow);
        
    },
    lastActiveDayOfWeek: function(weekDay){

       var today = this.getToday();
       var todayWeekday = this.getDayOfWeek();

       while(todayWeekday !== weekDay ){
          todayWeekday--;
          today--;
          if(todayWeekday = -1) todayWeekday = 6;
       }

       return [todayWeekday, today]

    },

    reformatDate: function(date){
      
        var day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear(),
        actualDate = month + "-" + day + "-" + year;


        return this.dateParser(actualDate);
    },
    getDateFromDay: function(year, day){
      
        return new Date(new Date(year, 0).setDate(day));

    },
    updateDate: function(oldDateObj, day){
      
      oldDateObj = oldDateObj.split('-');
      var oldYear = oldDateObj[0]; 
      
      if(day > 365 ){
        
        oldYear = parseInt(oldYear) + 1;
        day -= 365;
      
      }    

      console.log(oldYear);

      return this.getDateFromDay( oldYear , day);

    }



  }


})
/* .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. |
| |   ______     | || |     _____    | || |   _____      | || |   _____      | |
| |  |_   _ \    | || |    |_   _|   | || |  |_   _|     | || |  |_   _|     | |
| |    | |_) |   | || |      | |     | || |    | |       | || |    | |       | |
| |    |  __'.   | || |      | |     | || |    | |   _   | || |    | |   _   | |
| |   _| |__) |  | || |     _| |_    | || |   _| |__/ |  | || |   _| |__/ |  | |
| |  |_______/   | || |    |_____|   | || |  |________|  | || |  |________|  | |
| |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  */

.factory('billService', function($rootScope, $ionicModal, $q, dateHandler){



  var billScope = $rootScope.$new(true),
  
  billModal;
  
  billScope.bill = {};
  
  billScope.accumulatedInfo = {};

  billScope.$watchCollection('accumulatedInfo', function(){
    
    if (billScope.accumulatedInfo.hasOwnProperty('savings')){

       console.log(billScope.accumulatedInfo);
        
        localforage.setItem('profileInfo', {
         
          current: billScope.accumulatedInfo['initial'],
   
          amount:  parseFloat(billScope.accumulatedInfo['payCheckAmount']),
   
          weekday: billScope.accumulatedInfo['paydayOfWeek'],
   
          goal: parseFloat(billScope.accumulatedInfo['savings']),
   
          frequency: billScope.accumulatedInfo['reoccurance'],
   
          savingsAmount: parseFloat(billScope.accumulatedInfo['savingsAmount']),
   
          savingsPercentage: billScope.accumulatedInfo['savingsPercentage']        
        
        });
    
    }

    localforage.setItem("registered", true);

  })  

  $ionicModal.fromTemplateUrl('templates/account-modal-templates/bill.html',{
    
        animation: 'slide-in-up',
        scope: billScope
    
      }).then(function(modal){
    
        billModal = modal;
     
      });

      billScope.addBill = function(bill){

        bill.nextPayment = dateHandler.reformatDate(bill.date);
        
        localforage.getItem("bills").then(function(arr){
        
            if (!arr)  arr = []; 

            arr[arr.length] = bill;

            localforage.setItem("bills", arr).then(function(){

                $rootScope.$emit("closedWindow");
               
                billScope.bill = {};
                billModal.hide();

            });

        });

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
          
          userSignUpDate = dateHandler.getToday();


          if (obj.hasOwnProperty('initial') && typeof obj['initial'] == "string"){
              
                obj['initial'] = parseFloat(obj['initial']);
          
               billScope.accumulatedInfo['initial'] = obj['initial'];
          
          }

        
          if(obj['lastPayDate'] && typeof obj['lastPayDate'] !== Number){
          
            var strDate = obj['lastPayDate'].toString(),
          
            strMonth = obj['lastPayDate'].getMonth(), 
          
             arr = strDate.split(" "),
          
              selectedDay = (strMonth + 1) + "-" + arr[2] + "-" + arr[3]; 
          
            billScope.accumulatedInfo["lastPayDate"] = dateHandler.dateParser(selectedDay);

          }
          
          if (!billScope.accumulatedInfo["dayOfYear"]){
          
            billScope.accumulatedInfo["dayOfYear"] = userSignUpDate;
          
          }

          //Checking for missing properties
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

/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .-----------------. .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |     ______   | || | _____  _____ | || |  _______     | || |  _______     | || |  _________   | || | ____  _____  | || |     ______   | || |  ____  ____  | |
| |   .' ___  |  | || ||_   _||_   _|| || | |_   __ \    | || | |_   __ \    | || | |_   ___  |  | || ||_   \|_   _| | || |   .' ___  |  | || | |_  _||_  _| | |
| |  / .'   \_|  | || |  | |    | |  | || |   | |__) |   | || |   | |__) |   | || |   | |_  \_|  | || |  |   \ | |   | || |  / .'   \_|  | || |   \ \  / /   | |
| |  | |         | || |  | '    ' |  | || |   |  __ /    | || |   |  __ /    | || |   |  _|  _   | || |  | |\ \| |   | || |  | |         | || |    \ \/ /    | |
| |  \ `.___.'\  | || |   \ `--' /   | || |  _| |  \ \_  | || |  _| |  \ \_  | || |  _| |___/ |  | || | _| |_\   |_  | || |  \ `.___.'\  | || |    _|  |_    | |
| |   `._____.'  | || |    `.__.'    | || | |____| |___| | || | |____| |___| | || | |_________|  | || ||_____|\____| | || |   `._____.'  | || |   |______|   | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
 .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.                     
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |                    
| |   ______     | || |  _______     | || |     ____     | || |     ______   | || |  _________   | || |    _______   | || |    _______   | |                    
| |  |_   __ \   | || | |_   __ \    | || |   .'    `.   | || |   .' ___  |  | || | |_   ___  |  | || |   /  ___  |  | || |   /  ___  |  | |                    
| |    | |__) |  | || |   | |__) |   | || |  /  .--.  \  | || |  / .'   \_|  | || |   | |_  \_|  | || |  |  (__ \_|  | || |  |  (__ \_|  | |                    
| |    |  ___/   | || |   |  __ /    | || |  | |    | |  | || |  | |         | || |   |  _|  _   | || |   '.___`-.   | || |   '.___`-.   | |                    
| |   _| |_      | || |  _| |  \ \_  | || |  \  `--'  /  | || |  \ `.___.'\  | || |  _| |___/ |  | || |  |`\____) |  | || |  |`\____) |  | |                    
| |  |_____|     | || | |____| |___| | || |   `.____.'   | || |   `._____.'  | || | |_________|  | || |  |_______.'  | || |  |_______.'  | |                    
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |                    
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |                    
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'                    */ 

.factory('currencyProcessing', function($rootScope , dateHandler){

   dayOfYear = dateHandler.getToday();


  function getUserInfo(){
   
   return localforage.getItem('userInfo').then(function(value){
      
      console.log(value);
      
      return value;
    
    });
  
  }


  return {

    gotPaid: function(){

      getUserInfo().then(function(userObj){

          var pay = 0,  
          
          check = parseInt(userObj.payCheckAmount),
          
          lastPayDate = userObj.lastPayDate, 
          
          dayIncrement = parseInt(userObj.reoccurance),
          
          deductedAmount = parseFloat(userObj.savingsPercentage) * userObj.payCheckAmount,
          
          savingsIncrease = 0; 


          if (lastPayDate > 335 && dayOfYear < 20) dayOfYear += 365;

          if (lastPayDate < 30 && dayOfYear > 335) return;

          while (lastPayDate <= dayOfYear){
          
             lastPayDate += dayIncrement;
          
             if (lastPayDate <= dayOfYear){
          
               pay += check;
               pay -= deductedAmount;
               savingsIncrease += deductedAmount;
          
             }

          }

          if (lastPayDate > 365 )  lastPayDate -= 365;
                        
          if (dayOfYear > 365)   dayOfYear -= 365;


          userObj.initial += pay;
          
          userObj.lastPayDate = lastPayDate;
          
          userObj.savingsAmount += savingsIncrease;

          localforage.setItem('userInfo', userObj);

      });

    },

    processNeeds: function(){

        return localforage.getItem('needs').then(function(needsArr){

            if(!needsArr) {console.log("No needs to process"); return; }

            return localforage.getItem('userInfo').then(function(userProfile){

              var newNeedsArr = needsArr.map(function(need){
                //userProfile.initial

                  if (need.nextPayment < 14 && dateHandler.getToday() > 355) need.nextPayment += 365;
                  
                  while (need.nextPayment <= dateHandler.getToday()){

                      userProfile.initial -= need.amount;

                      need.nextPayment += parseInt(need.occurance);

                  }

                  need.nextPayment = dateHandler.dayCountAdjust(need.nextPayment);

                  return need; 

              });


              localforage.setItem('needs', newNeedsArr);

              localforage.setItem('userInfo', userProfile).then(function(){

                  console.log("The needs have been processed");


              });

            });


        });

    },

    processBills: function(){

    return  localforage.getItem('bills').then(function(billArr){

        if (!billArr) { console.log("No bills to process"); return; }

        return localforage.getItem('userInfo').then(function(userProfile){

            var newBillArr =  billArr.map(function(bill){

                var today = dateHandler.getToday();

                if (bill.nextPayment < 35 && today > 330) bill.nextPayment += 365;

                if (bill.nextPayment < today ){
                
                   bill.nextPayment += 30;
                   userProfile.initial -= bill.amount;
                  
                  if (bill.occurance == 1) bill.paid = true;

                  bill.date = dateHandler.updateDate(bill.date, bill.nextPayment);

                }

                if (bill.nextPayment > 365) bill.nextPayment -= 365;

                return bill;


            }).filter(function(bill){

                return !bill.hasOwnProperty("paid");
            
            });


            localforage.setItem('bills', newBillArr);

            return localforage.setItem('userInfo', userProfile).then(function(ui){
                
               return localforage.getItem('profileInfo').then(function(pi){

                  console.log(pi);

                  pi.current = ui.initial;

                  return localforage.setItem('profileInfo').then(function(){


                      $rootScope.$emit("closedWindow");
                      
                      return true;
          

                  });
               });
            
            });

        });

      });

    }//End of processBills method

  }


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
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  */

.factory('accountService', function(dateHandler){


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
      refactorNeed: function(need){

        dateHandler.getToday();


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





 /*.----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| | _____  _____ | || |   ______     | || |  ________    | || |      __      | || |  _________   | || |  _________   | |
| ||_   _||_   _|| || |  |_   __ \   | || | |_   ___ `.  | || |     /  \     | || | |  _   _  |  | || | |_   ___  |  | |
| |  | |    | |  | || |    | |__) |  | || |   | |   `. \ | || |    / /\ \    | || | |_/ | | \_|  | || |   | |_  \_|  | |
| |  | '    ' |  | || |    |  ___/   | || |   | |    | | | || |   / ____ \   | || |     | |      | || |   |  _|  _   | |
| |   \ `--' /   | || |   _| |_      | || |  _| |___.' / | || | _/ /    \ \_ | || |    _| |_     | || |  _| |___/ |  | |
| |    `.__.'    | || |  |_____|     | || | |________.'  | || ||____|  |____|| || |   |_____|    | || | |_________|  | |
| |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------' */





.factory('updateService', function($rootScope, billService){



  return {

    grabInfo: function(){
    
      return localforage.getItem('profileInfo')
        .then(function(val){
    
          console.log("This is profile information");
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
 '----------------'  '----------------'  '----------------'  '----------------'        */                                                     


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


/* .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |  _________   | || |  ____  ____  | || |  _________   | || |  _______     | || |      __      | |
| | |_   ___  |  | || | |_  _||_  _| | || | |  _   _  |  | || | |_   __ \    | || |     /  \     | |
| |   | |_  \_|  | || |   \ \  / /   | || | |_/ | | \_|  | || |   | |__) |   | || |    / /\ \    | |
| |   |  _|  _   | || |    > `' <    | || |     | |      | || |   |  __ /    | || |   / ____ \   | |
| |  _| |___/ |  | || |  _/ /'`\ \_  | || |    _| |_     | || |  _| |  \ \_  | || | _/ /    \ \_ | |
| | |_________|  | || | |____||____| | || |   |_____|    | || | |____| |___| | || ||____|  |____|| |
| |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------' */



.factory('extraService', function($rootScope, $ionicModal, $ionicPopup){

    var extraScope = $rootScope.$new(true),
    extraModal;
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



      $ionicModal.fromTemplateUrl('templates/account-modal-templates/extra.html',{
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

