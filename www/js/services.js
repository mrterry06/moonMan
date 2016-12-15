angular.module('moonMan.services', [])

.factory('billService', function($rootScope, $ionicModal, $q){

  var billScope = $rootScope.$new(true);
  var billModal;
  billScope.bill = {};
  billScope.accumulatedInfo = {};


      $ionicModal.fromTemplateUrl('templates/account/bill.html',{
        animation: 'slide-in-up',
        scope: billScope
      }).then(function(modal){
        billModal = modal;
        console.log("bill Modal initiated");
      });

      billScope.addBill = function(bill){
        console.log(bill);
        localforage.getItem("bills")
        .then(function(arr){
          console.log(arr);
          if (arr == undefined) { arr = []; }
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
          console.log("Opening Bill Modal");
        },
        getBills: function(){
          console.log("We should be getting bills");
         return localforage.getItem("bills").then(function(value){
            if (value == undefined){
              console.log(value);
              console.log("value has no data");
              return [];
            }
            console.log("value has data");
            console.log(value);
            return value;
         });

        },
        resetBills: function(newBills){
          localforage.setItem("bills", newBills);

        },

        init: function(obj){

          var timeStamp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
          var yearFirstDay = Math.floor(timeStamp / 86400000);
          var today = Math.ceil((new Date().getTime())/ 86400000);
          var userSignUpDate = today - yearFirstDay;


          console.log("Gathering Information");
          for(var key in obj){
              if(key == "initial"){ obj[key] = Number(obj[key]); 
               console.log("Your Key is being parsed");
            }

              billScope.accumulatedInfo[key] = obj[key];
          }

        
          if(obj['lastPayDate'] && (typeof obj['lastPayDate'] !== Number)){
            var strDate = obj['lastPayDate'].toString();
            var strMonth = obj['lastPayDate'].getMonth(); 
            var arr = strDate.split(" ");
      

            var realDate = (strMonth + 1) + "-" + arr[2] + "-" + arr[3]; 
            billScope.accumulatedInfo["lastPayDate"] = (Math.ceil((new Date(realDate).getTime())/ 86400000)) - yearFirstDay;

          }
          
          if(billScope.accumulatedInfo["dayOfYear"] == undefined){
            billScope.accumulatedInfo["dayOfYear"] = userSignUpDate;
          }

          console.log( billScope.accumulatedInfo);
          localforage.setItem('userInfo', billScope.accumulatedInfo).then(function(){
            console.log("User information has been stored");
          });
        },
        userInfo: function(){
          console.log(billScope.accumulatedInfo);
          return localforage.getItem('userInfo').then(function(value){
            console.log("userinfo is a promise that should return an object");
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

          if(userObj.reoccurance == 'weekly'){
            dayIncrement =7;
          } else if(userObj.reoccurance =="bi-weekly"){
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



        console.log(userObj);

        localforage.setItem('userInfo', userObj);

      });
      console.log("Right about here should be an object");
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
              return true;
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

