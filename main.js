$(document).ready(function () {
	function addEventListeners() {
		$("#currentPageCompare").on("click", function () {
			// chrome.tabs.getSelected(null, function(tab){
			// 	console.log(tab);
			//     chrome.tabs.executeScript(tab.id, {code: "alert('test');"}, function(response) {
			        
			//     });
			// });

		    chrome.tabs.executeScript(function() {
		        chrome.tabs.executeScript(null, {file: 'executeDom.js'});
		    });
		});

		$("#newPageCompare").on("click", function () {
			var createProperties = {
		        url: "newPageCompare.html"
		    };
		    chrome.tabs.create(createProperties);
		});
	}

	addEventListeners();
});