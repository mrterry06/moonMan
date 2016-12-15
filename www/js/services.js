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
          frequency: billScope.accumulatedInfo['reoccurance']
        
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
          
          if(!billScope.accumulatedInfo["dayOfYear"]){
            billScope.accumulatedInfo["dayOfYear"] = userSignUpDate;
          }

          for(var key in obj){
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

    var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];



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
        return days;
      }
    }
})

.factory('updateService', function($rootScope){




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
              
              console.log("stored to profileInfo");
              
              return localforage.getItem('userInfo').then(function(val){

                  val.initial = info.current;
                  val.payCheckAmount = info.amount;
                  val.paydayOfWeek = info.weekday;
                  val.savings = info.goal;
                  val.reoccurance = info.frequency;

                  return  localforage.setItem('userInfo', val).then(function(){
                  
                      console.log("Reset User Info");
                  
                      return true;
                  
                  });

               });

            }).catch(function(err){
              console.warn(err);
              return false;
            });
    }
  }
})

.factory('extraService', function($rootScope, $ionicModal){

    var extraScope = $rootScope.$new(true);
    var extraModal;
    extraScope.extra = {};

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

       extraScope.closeModal = function(){
          extraModal.hide();

       } 
      return {

        openModal: function(){
          extraModal.show();
          extraScope.extra.amount = "";
        }

      }

});

