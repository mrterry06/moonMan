angular.module('moonMan.filters', [])

.filter('shortenText', function(){

	return function(text){

		if (text.length > 14){
			return text.substr(0, 11) + "...";
		}

		return text;
	}
});