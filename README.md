### Version
V 0.1.0
 
### Techniques
jQuery, PDF.js.
 
### Description
This tool is packaged as a Chrome Extension.
Now it only support PDF Comparison in Chrome Extension and HTML Comparison will be completed in following version.
If you want to compare HTML, please download codes and open HTMLComparison/compareHTML.html, type the url in input boxes.
 
### Usage
 
**HTML**: 
#### 1. Start
Open the **HTMLComparison/compareHTML.html**, there is a panel.
<!--![Alt text](/images/panel.png) -->
 
#### 2. Origin URL/Path
Input URL (like http://localhost/originTest.html) of the origin template you want to compare with.
    
#### 3. Your URL/Path
Input URL (like http://localhost/yourTest.html) of your template.
    
#### 4. Position
Position panel is used for adjust the position of your template.
Sometimes, the structure of origin template is not enough exact, we need to adjust ***our template's position*** to make sure both of templates are in same position.

+ Top

Adjust the space between top of the template and browser's top. 

+ Left

Adjust the space between left of the template and browser's bottom. 
        
#### 5. Your Template Toggle
To control your template show or hide.
 
**PDF**:
#### 1. Install Extension
(1). Download "PDF_HTML_Comparison.crx" from the project.
 
(2). Open Chrome and open Chrome Extensions Management as below image or type chrome://extensions/ in Chrome address bar.
<!--![Alt text](/images/open_extension.png) -->
 
(3). Drag the extension to Chrome Extensions Management window to install
<!--![Alt text](/images/drag_to_install.png)
![Alt text](/images/comfirm_install.png) -->
 
(4). You could find the extension in toolbar and Chrome Extensions Page.
<!--![Alt text](/images/extension_in_list.png) -->
 
    
#### 2. Start to use
Click the icon in toolbar to open the extension.
<!--![Alt text](/images/open_extension.png) -->
 
There is a panel for controlling files.
<!--![Alt text](/images/compare_pdf_panel.png) -->
 
##### 2.1. _Origin URL/Path_ and _Your URL/Path_
Please click "Choose file" to select pdf files you want to compare
 
##### 2.2. Use "top" and "left" to adjust your pdf's position.
 
##### 2.3. Use "Page Number" to switch pdf page
 
##### 2.4. **Use "Control Your PDF Only" checkbox and input box to choose and set page number for your own pdf**
 
Because our development pages maybe is different from UXD design, sometimes the same panel will display in different pages between our pdf and UXD's.
 
You could use this checkbox and input box to set your own PDF page number to solve this issue.
 
##### 6. Use "Zoom" to adjust the scale of pdf