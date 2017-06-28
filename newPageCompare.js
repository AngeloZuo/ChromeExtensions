$(function () {
	addListeners();
})

function addListeners() {
	$("#yourFileTop").on("change", function (e) {
		console.log(this.value);
		setPosition("#yourFileContainer", "top", this.value);
	});

	$("#originFile").on("change", function() {
		// addEmebed("#originFileContainer", this.value);
		PDFJS.getDocument(this.value).then(function(pdf) {
			console.log(pdf);
		});
	});

	$("#yourFile").on("change", function() {
		addEmebed("#yourFileContainer", this.value);
	});
}

function setPosition(selector, attr, value) {
	$(selector).css(attr, value);
}

function addEmebed(selector, value) {
	var embed = $("<embed></embed>")
	embed.attr("src", value);
	$(selector).html();
	$(selector).append(embed);
}