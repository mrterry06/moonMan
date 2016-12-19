angular.module('moonMan.filters', [])

.filter('shortenText', function(){

	return function(text){

		if (text.length > 20){
			return text.substr(0, 19) + "...";
		}

		return text;
	}
})
.filter('occurTrans', function(){

	return function(num){
		
		num = parseInt(num);
		
		if(num == 1) return "Daily";

		if(num == 7) return "Weekly";
		
	}
});