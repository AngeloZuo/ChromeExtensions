(function() {
	jQuery.fn.extend({
	    getPath: function() {
	        var pathes = [];

	        this.each(function(index, element) {
	            var path, $node = jQuery(element);

	            while ($node.length) {
	                var realNode = $node.get(0), name = realNode.localName;
	                if (!name) { break; }

	                name = name.toLowerCase();
	                var parent = $node.parent();
	                var sameTagSiblings = parent.children(name);

	                if (sameTagSiblings.length > 1)
	                {
	                    allSiblings = parent.children();
	                    var index = allSiblings.index(realNode) +1;
	                    if (index > 0) {
	                        name += ':nth-child(' + index + ')';
	                    }
	                }

	                path = name + (path ? ' > ' + path : '');
	                $node = parent;
	            }

	            pathes.push(path);
	        });

	        return pathes.join(',');
	    }
	});
})();

var pathArray = [];
var selectorAndBlockObj = {};
var env = {
	DIT: "https://dgwebdrtp1.fmr.com:12100/interactive/?view=interactiveBlock:@@BlockName@@.jld&namespace=blocks#viewMode=preview",
	SIT: "https://dgwebirtp1.fmr.com:12100/interactive/?view=interactiveBlock:@@BlockName@@.jld&namespace=blocks#viewMode=preview",
	UAT: "https://dgweburtp1.fmr.com:12100/interactive/?view=interactiveBlock:@@BlockName@@.jld&namespace=blocks#viewMode=preview"
}

var selectEnv = null;
var isAddingLinks = false;
var isDragging = false;

function init() {
	var panelHTML = `
		<div id="extensionCtrlPanel">
			<div class="tg-list-item">
			    <input class="tgl tgl-flat" id="addBlockLink" type="checkbox"/>
			    <label class="tgl-btn" for="addBlockLink"></label>
			    <label>Edit Block Link</label>
			</div>
			<div>
				<label>Select Env</label>
				<select id="envSelector">
					<option value="DIT" selected>DIT</option>
					<option value="SIT">SIT</option>
					<option value="UAT">UAT</option>
				</select>
			</div>
			<div class="tg-list-item">
			    <input class="tgl tgl-flat" id="showDraggableElements" type="checkbox"/>
			    <label class="tgl-btn" for="showDraggableElements"></label>
			    <label>Show Draggable Elements</label>
			</div>
		</div>
		<select id="blockList" class="blockList" data-target=""></select>
		<div id="componentsReadyPool" class="componentsReadyPool" data-target=""></div>
	`;
	$("body").append(panelHTML);
	addEvents();

	if (localStorage.getItem("allBlockLinks")) {
		pathArray = JSON.parse(localStorage.getItem("allBlockLinks"));
		addAllBlocksLink(pathArray);
	} else {
		$.get(chrome.extension.getURL('data/data.json'), function (data) {
			pathArray = JSON.parse(data);
			addAllBlocksLink(pathArray);
		});
	}

	$.get(chrome.extension.getURL('data/blockList.json'), function (data) {
		var blockArray = JSON.parse(data);
		for (var i = 0; i < blockArray.length; i++) {
			$("#blockList").append('<option value="' + blockArray[i] + '">' + blockArray[i] + '</option>');
		}
	});
	
	selectEnv = env[$("#envSelector").val()];
}

function addEvents() {
	$("#addBlockLink").on("click", function () {
		isAddingLinks = this.checked;
		checkStatus();
	});

	$("#extensionCtrlPanel").on("mousedown", function (event) {
		var offsetX = event.offsetX,
			offsetY = event.offsetY;

		$(this).on("mousemove", function (e) {
			$(this).css("top", e.clientY - offsetY);
			$(this).css("left", e.clientX - offsetX);
		});
	});

	$(document).on("mouseup", function () {
		$("#extensionCtrlPanel").off("mousemove");
	});
	
	$(document).on("click", function(e) {
		if (isAddingLinks) {
			var targetElement = $(e.target);

			if (targetElement.text() !== "") {
				if (!targetElement.hasClass("withShadow") && !targetElement.hasClass("extension_tip") 
					&& !targetElement.hasClass("blockList")) {
					var tempObj = {
						path: targetElement.getPath(),
						blockName: ""
					};
					pathArray.push(tempObj);
					addShadow(targetElement);
					showBlocksList(targetElement);
				}
			} else {
				targetElement.removeClass("withShadow");
			}
		}
	});

	$(document).on("mouseover", function(e) {
		if (isAddingLinks) {
			var targetElement = $(e.target);
			if (!targetElement.hasClass("blockList")) {
				targetElement.addClass("withBackgroundColor");
			}
		}
	});

	$(document).on("mouseout", function(e) {
		if (isAddingLinks) {
			var targetElement = $(e.target);
			targetElement.removeClass("withBackgroundColor");
		}
	});

	$("#envSelector").on("change", function(e) {
		selectEnv = env[this.value];
	});

	$("#blockList").on("change", function () {
		$("#" + $(this).data("target")).data("blockname", this.value);

		var tempPath = $("#" + $(this).data("target")).parent().getPath();
		var tempSelector = pathArray[pathArray.length - 1];

		if (tempSelector.path === tempPath) {
			tempSelector.blockName = this.value;
		}

		saveLocalStorage();

		$(this).css("display", "none");
	});

	$("#showDraggableElements").on("change", function (e) {
		isDragging = this.checked;
		if (this.checked) {
			$(".angelo-test-draggable").addClass("draggableShadow");
			$(".componentsReadyPool").css("display", "block");
		} else {
			$(".angelo-test-draggable").removeClass("draggableShadow");
			$(".componentsReadyPool").css("display", "none");
		}
	});

	$(".angelo-test-draggable").on("mousedown", function (e) {
		if (isDragging) {
			e.stopPropagation();
			console.log(e.target);
			$(this).width($(this).width());
			$(this).height($(this).height());

			addToPool($(this).html());
			$(this).text("");

			$(this).on("dragover", function (e) {
				e.preventDefault();
			}).on("drop", function (e) {
				e.preventDefault();
				$(this).append(e.originalEvent.dataTransfer.getData("text/plain"));
				$(this).off("dragover");
				$(this).off("drop");
				$(this).attr("style", "")
			});
		}
	});
}

function addShadow(targetElement, index, blockName) {
	targetElement.addClass("withShadow");

	addTip(targetElement, index || pathArray.length, blockName);
}

function addTip(targetElement, index, blockName) {
	var tipHTML = `
		<a class="extension_tip" id="extension_tip_number_` + index + `" data-blockname="` + blockName + `"><i class="fa fa-external-link" aria-hidden="true"></i></a>
		<a class="remove_extension_tip" id="extension_tip_remove_` + index + `">X</a>
	`;
	targetElement.addClass("isRelative");
	targetElement.append(tipHTML);

	checkStatus();

	$("#extension_tip_number_" + index).on("click", function() {
		var blockPath = selectEnv.replace(/@@BlockName@@/g, $(this).data("blockname") || "");
		window.open(blockPath, '_blank');
	});

	$("#extension_tip_remove_" + index).on("click", function() {
		targetElement.find("> a.extension_tip").remove();
		targetElement.find("> a.remove_extension_tip").remove();
		targetElement.removeClass("withShadow");
		targetElement.removeClass("isRelative");
	});
}

function addAllBlocksLink() {
	for (var i = 0; i < pathArray.length; i++) {
		addShadow($(pathArray[i].path), i, pathArray[i].blockName);
	}
}

function showBlocksList(targetElement) {
	$("#blockList").css("display", "block");
	$("#blockList").css("top", targetElement.position().top - 35);
	$("#blockList").css("left", targetElement.position().left);
	$("#blockList").data("target", targetElement.find(".extension_tip").attr("id"))
}

function checkStatus() {
	if (isAddingLinks) {
		$(".remove_extension_tip").css("display", "block");
	} else {
		$(".remove_extension_tip").css("display", "none");
	}
}

function saveLocalStorage() {
	var pathArrayString = JSON.stringify(pathArray);
	localStorage.setItem("allBlockLinks", pathArrayString);
}

function addToPool(targetElementHtml) {
	var templateCell = $('<div class="componentCell" draggable="true"></div>').append(targetElementHtml);
	$(".componentsReadyPool").append(templateCell);

	$(".componentCell").on("dragstart", function (e) {
		console.log("*******start dragging");
		e.originalEvent.dataTransfer.setData("text", $(this).html());
		// e.originalEvent.dataTransfer.dropEffect = "move";
	});

	$(".componentCell").on("dragend", function (e) {
		console.log("*******end dragging");
		$(this).remove();
	});
}

init();
