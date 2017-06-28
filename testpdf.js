// The workerSrc property shall be specified.
PDFJS.workerSrc = 'library/pdf.worker.js';

var pdfStatus = {},
    pageNum = 1,
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
                // New page rendering is pending
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(_num) {
    var num = _num || pageNum;
    if (pageRendering) {
        pageNumPending = num;
    } else {
        for (var containerId in pdfStatus) {
            renderPage(containerId, num);
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

$(function () {
    addListeners();
});

function setStyle(selector, attr, value) {
    $(selector).css(attr, value);
}

function addListeners() {
    $("#originFile").on("change", function() {
        loadPDF("originFileContainer", this.value);
        setStyle("#originFileContainer", "display", "block");
    });

    $("#yourFile").on("change", function() {
        loadPDF("yourFileContainer", this.value);
        setStyle("#yourFileContainer", "display", "block");
    });

    $("#yourFileTop").on("change", function (e) {
        setStyle("#yourFileContainer", "top", this.value + "px");
    });

    $("#yourFileLeft").on("change", function (e) {
        setStyle("#yourFileContainer", "left", this.value + "px");
    });

    $("#pageNumber").on("change", function() {
        queueRenderPage(parseInt(this.value));
    });

    $("#zoomCtrl").on("change", function() {
        scale = parseFloat(this.value);
        queueRenderPage();
    });
}
