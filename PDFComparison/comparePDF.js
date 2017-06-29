//comparePDF.js
// The workerSrc property shall be specified.
PDFJS.workerSrc = '../library/pdf.worker.js';
 
var pdfStatus = {},
    pageNum = 1,
    yourPageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1;
 
/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(containerId, num) {
    var canvas = $("#" + containerId + " canvas").get(0),
        ctx = canvas.getContext('2d');
        
    pageRendering = true;
 
    // Using promise to fetch the page
    pdfStatus[containerId].pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
 
        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        var renderTask = page.render(renderContext);
 
        // Wait for rendering to finish
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                pageNumPending = null;
            }
        });
    });
}
 
/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(_num, specificId) {
    var num = _num || pageNum;
    if (pageRendering) {
        pageNumPending = num;
    } else {
        if (specificId) {
            renderPage(specificId, yourPageNum);
        } else {
            for (var containerId in pdfStatus) {
                num = containerId === "yourFileContainer" ? yourPageNum : pageNum;
                renderPage(containerId, num);
            }
        }
    }
}
 
function loadPDF(containerId, pdfPath) {
    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    var url = pdfPath;
 
    /**
     * Asynchronously downloads PDF.
     */
    PDFJS.getDocument(url).then(function(pdfDoc_) {
        pdfStatus[containerId] = {
            pdfDoc: null,
            pageRendering: false
        };
        pdfStatus[containerId].pdfDoc = pdfDoc_;
 
        // Initial/first page rendering
        renderPage(containerId, pageNum);
    });
 
}
 
function loadPDFBase64(containerId, content, idForTotalNum) {
    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.
    var pdfData = atob(content);
 
    /**
     * Asynchronously downloads PDF.
     */
    PDFJS.getDocument({data: pdfData}).then(function(pdfDoc_) {
        pdfStatus[containerId] = {
            pdfDoc: null,
            pageRendering: false
        };
        pdfStatus[containerId].pdfDoc = pdfDoc_;
 
        setTotalPageNum(idForTotalNum, pdfDoc_.numPages);
 
        // Initial/first page rendering
        renderPage(containerId, pageNum);
    });
 
}
 
function readFile(containerId, file, idForTotalNum) {
    if (file) {
        var reader = new FileReader();
 
        // inject an image with the src url
        reader.onload = function(event) {
            var the_url = event.target.result;
            var pdfContent = the_url.split("base64,")[1];
            loadPDFBase64(containerId, pdfContent, idForTotalNum);
        }
 
        // when the file is read it triggers the onload event above.
        reader.readAsDataURL(file);
    } else {
        var canvas = $("#" + containerId + " canvas").get(0),
        ctx = canvas.getContext('2d');
 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setStyle("#" + containerId, "display", "none");
    }
}
 
function setTotalPageNum(idForTotalNum, totalNum) {
    $("#" + idForTotalNum).attr("max", totalNum);
 
 
    var content = "<strong>/" + totalNum + "</strong>";
    $("#" + idForTotalNum + " + span").html(content);
}
 
$(function () {
    addListeners();
});
 
function setStyle(selector, attr, value) {
    $(selector).css(attr, value);
}
 
function addListeners() {
    var isCtrlYourPDF = false;
    $("#originFile").on("change", function() {
        readFile("originFileContainer", this.files[0], "pageNumber");
        setStyle("#originFileContainer", "display", "block");
    });
 
    $("#yourFile").on("change", function() {
        readFile("yourFileContainer", this.files[0], "yourPageNumber");
        setStyle("#yourFileContainer", "display", "block");
    });
 
    $("#yourFileTop").on("change", function (e) {
        setStyle("#yourFileContainer", "top", this.value + "px");
    });
 
    $("#yourFileLeft").on("change", function (e) {
        setStyle("#yourFileContainer", "left", this.value + "px");
    });
 
    $("#pageNumber").on("change", function() {
        yourPageNum += parseInt(this.value) - pageNum;
        $("#yourPageNumber").val(yourPageNum);
        pageNum = parseInt(this.value);
        
        queueRenderPage(parseInt(this.value));
    });
 
    $("#yourPageNumber").on("change", function() {
        yourPageNum = parseInt(this.value);
        
        queueRenderPage(parseInt(this.value), "yourFileContainer");
    });
 
    $("#zoomCtrl").on("change", function() {
        scale = parseFloat(this.value);
        queueRenderPage();
    });
 
    $("#yourPDFToggle").on("change", function() {
        isCtrlYourPDF = this.checked;
        if (isCtrlYourPDF) {
            $("#yourPageNumber").attr("disabled", false);
        } else {
            $("#yourPageNumber").attr("disabled", true);
        }
    });
}
 