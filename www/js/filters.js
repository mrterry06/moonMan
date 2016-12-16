angular.module('moonMan.filters', [])

.filter('shortenText', function(){

	return function(text){

		if (text.length > 20){
			return text.substr(0, 19) + "...";
		}

		return text;
	}
});