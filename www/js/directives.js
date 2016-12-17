angular.module("moonMan.directives", [])

.directive('weekdaysList', function(){

	return {
		templateUrl: 'templates/directive-templates/weekdays-list.html',
		restrict: 'E',
		scope: {
			'extraClasses': '@extraClass',
			'modelType': '@model',
			'headerLabel': '@header'
		}
	}

});