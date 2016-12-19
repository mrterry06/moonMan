angular.module("moonMan.directives", [])

.directive('weekdaysList', function(){

	return {
		templateUrl: 'templates/directive-templates/weekdays-list.html',
		restrict: 'E',
		scope: {
			'extraClasses': '@extraClass',
			'modelType': '=model',
			'headerLabel': '@header',
			'headerStyle': '@headerStyle'
		},
		link: function(scope, element, attr){
		//	console.warn(scope.extraClasses);
		// Test this mechanism
		}
	}

})
.directive('occuranceList', function(){

	return {
		templateUrl: 'templates/directive-templates/occurance-list.html',
		restrict: 'E',
		scope: {
			'extra' : '@extraClass',
			'modelType': '=model',
			'headerLabel': '@header',
			'month': '@monthly'
		},
		link: function(scope, element, attr){
		
			scope.daysChange = function(val){
				console.log(val);
			}

		
		}

	}
});