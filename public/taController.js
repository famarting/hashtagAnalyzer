(function(taApp){
	controller.$inject =["$http","ngProgressFactory"];
	function controller(http,ngProgressFactory){
		
		var vm = this;

		vm.progressbar = ngProgressFactory.createInstance();
		

		vm.hashtag = {}
		vm.searched = false
		vm.search = function(){
			if(!vm.hashtag.text){
				return;
			}
			vm.tweets = {}
			vm.progressbar.setColor("#00B2FF")
			vm.progressbar.start();
			vm.searched = false
			http.post('/api/search',vm.hashtag)
			.success(function(data) {
				vm.tweets = data;
				vm.progressbar.complete();
				vm.searched = true
			})
			.error(function(data) {
				vm.progressbar.complete();
				console.log('Error: ' + data);
			});			
		};

	}
	taApp.controller("taCtrl",controller);
}(angular.module("taApp")));