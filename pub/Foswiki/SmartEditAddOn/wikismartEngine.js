/***************************
Copyright (C) 2006 Gaël Crova

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version. 

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. 

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
****************************/

/*****************
Smart Editor use the Mochikit library for the key events
****************/

// Textarea element / available for all scripts
var twikismartTextarea = "";
var twikismartTextareaId = "";
var twikismartTextareaHasFocus = false;

// For search engine
var twikismartTopSearchHasFocus = false;
var twikismartBottomSearchHasFocus = false;
var twikismartTextToSearch = "";
var twikismartTextOccurence = -1;

var twikismartValueToInsertFromPopup = "";

var twikismartShiftPressed = false;
// MLR variable to hold Alt & Ctrl key status
var twikismartAltorCtrlPressed = false;

// The textarea content at t time
var twikismartTextareaContent = "";
var twikismartSelection = "";
var twikismartStartIndex = "";
var twikismartEndIndex = "";
var twikismartTextareaScrollFirefox = 0;

// Opened rows
var smartEditSearchOpen = false;
var smartEditInternalLinkOpen = false;
var smartEditExternalLinkOpen = false;

// All custom functions
var twikismartCustomerStrings = new Array();
var twikismartCustomerIcons = new Array();
var twikismartCustomerFunctionNames = new Array();
var twikismartCustomerIconsNames = new Array();
var twikismartWebStrings = new Array();
var twikismartWebIcons = new Array();
var twikismartWebFunctionNames = new Array();
var twikismartWebIconsNames = new Array();
var twikismartSiteStrings = new Array();
var twikismartSiteIcons = new Array();
var twikismartSiteFunctionNames = new Array();
var twikismartSiteIconsNames = new Array();
var smartEditorIECssClass = "";

// When a popup div is opened ... do not initialize selection in IE !!!
var smartEditDoNotInit = false;

var smartEditFirstExternalLink = true;

var clientPC = navigator.userAgent.toLowerCase(); // Get client info
var is_opera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
var is_firefox = ((clientPC.indexOf('gecko')!=-1) && (clientPC.indexOf('spoofer')==-1)
                && (clientPC.indexOf('khtml') == -1) && (clientPC.indexOf('netscape/7.0')==-1));


function twikismartEdit(textareaid){
	twikismartTextareaId = textareaid;
	// If browser is Firefox or IE (Opera and Mac browsers are disabled)
	if(is_firefox || ((navigator.userAgent.toLowerCase()).indexOf("opera") == -1)){
	// Special CSS style for Internet Explorer
	if(!is_firefox && ((navigator.userAgent.toLowerCase()).indexOf("opera") == -1)){
		smartEditorIECssClass = "IE";
	}
	twikismartTextarea = document.getElementById(twikismartTextareaId);
	twikismartTextAreaRows = twikismartTextarea.rows;
	twikismartTextarea.onfocus = function(){twikismartTextAreaFocus();};
	twikismartTextarea.onclick = function(){twikismartTextAreaClicked();};
	twikismartTextarea.onblur = function(){twikismartTextAreaFocus();};
	twikismartParseSiteFunctions();
	twikismartParseWebFunctions();
	twikismartParseCustomerFunctions();
	twikismartParseSiteSmileys();
	twikismartParseWebSmileys();
	twikismartParseCustomerSmileys();
	if(twikismartTextarea == null){
		alert("No textarea detected with the given id : "+textareaid);
	}
	else{
		// The problem is here for preview mode ......
		// Insert the top toolbar
		var newTool = smartEditCreateToolbar();
		document.getElementById("smartEditorTopToolbarID").appendChild(newTool);
		// Insert the botton toolbar
		var newToolBottom = smartEditCreateToolbar();
		twikismartInsertAfter(twikismartTextarea.parentNode, newToolBottom, twikismartTextarea);
	}
	}
}

/* For function search*/
/* Calculate scroll value for firefox */
function twikismartCalculateScroll(){
	var scrollHeight = twikismartTextarea.scrollHeight;
	var tscontent = twikismartTextarea.value;
	tscontent = twikismartReplaceAll(tscontent);
	var tslines = twikismartGetLines(tscontent);
	var lineHeight = 0;
	if( tslines != null && tscontent.length != -1){
		lineHeight = scrollHeight / (tslines.length);
	}
	return lineHeight;
}

/* When the textarea get the focus*/
function twikismartTextAreaFocus(){
	twikismartTextareaHasFocus = !twikismartTextareaHasFocus;
}

/* If the user click on the textarea, close all menus*/
function twikismartTextAreaClicked(){
	if(twikismartTextareaHasFocus && smartExtendedStylesOpen){
		smartEditToggleStyles();
	}
	if(twikismartTextareaHasFocus && SmartEditInsertCommonStringOpen){
		smartEditToggleInsert();
	}
	if(twikismartTextareaHasFocus && SmartEditInsertColorOpen){
		smartEditToggleColors();
	}
	if(twikismartTextareaHasFocus && SmartEditInsertSmileyOpen){
		smartEditToggleSmileys();
	}
	if(smartEditInternalLinkOpen && twikismartTextareaHasFocus){
		smartEditFirstWikiLink = false;
	}
	if(smartEditExternalLinkOpen && twikismartTextareaHasFocus){
		smartEditFirstExternalLink = false;
		twikismartInitializeAllAttributesForIE();
		//document.getElementById("smarteditorExternalLinkTextInput").value = twikismartSelection;
	}
}

/* For all functions */
/* Initalize all selection attributes */
function twikismartInitializeAllAttributes(){
	twikismartTextareaContent = twikismartTextarea.value;
	twikismartTextareaContent = twikismartReplaceAll(twikismartTextareaContent);
	if(document.selection  && !is_firefox) {
		twikismartSelection = document.selection.createRange().text;
		var lbefore = twikismartSelection.length;
		twikismartStartIndex = twikismartCursorPosition();
		if(twikismartStartIndex == -1){
			twikismartStartIndex = twikismartTextarea.value.length;
		}
		twikismartSelection = twikismartReplaceAll(twikismartSelection);
		var lend = lbefore - twikismartSelection.length;
		twikismartEndIndex = twikismartStartIndex+twikismartSelection.length;
		var nblines = twikismartNbLinesBefore(twikismartStartIndex);
		twikismartStartIndex -= nblines;
		twikismartEndIndex -= nblines;
	}
	else{
		twikismartTextareaScrollFirefox = twikismartTextarea.scrollTop;
		twikismartStartIndex = twikismartCursorPosition();
		twikismartSelection = twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextarea.selectionEnd);
		twikismartEndIndex = twikismartStartIndex+twikismartSelection.length;
	}
	
	if(twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "";
	}
}

/*For Styles, Colors, Icons and Insert menus*/
/* Initialize selection before another click on menu */
/* Cause : Bug on IE - If I d'on't initialize it before, a click on the new divisions clear old selection in the textarea*/
function twikismartInitializeAllAttributesForIE(){
	twikismartTextareaContent = twikismartTextarea.value;
	twikismartTextareaContent = twikismartReplaceAll(twikismartTextareaContent);
	if(document.selection  && !is_firefox) {
		twikismartSelection = document.selection.createRange().text;
		var lbefore = twikismartSelection.length;
		twikismartStartIndex = twikismartCursorPosition();
		if(twikismartStartIndex == -1){
			twikismartStartIndex = twikismartTextarea.value.length;
		}
		twikismartSelection = twikismartReplaceAll(twikismartSelection);
		var lend = lbefore - twikismartSelection.length;
		twikismartEndIndex = twikismartStartIndex+twikismartSelection.length;
		var nblines = twikismartNbLinesBefore(twikismartStartIndex);
		twikismartStartIndex -= nblines;
		twikismartEndIndex -= nblines;
	}
	else{
		twikismartTextareaScrollFirefox = twikismartTextarea.scrollTop;
		twikismartStartIndex = twikismartCursorPosition();
		twikismartSelection = twikismartTextareaContent.substring(twikismartStartIndex,twikismartTextarea.selectionEnd);
		twikismartEndIndex = twikismartStartIndex+twikismartSelection.length;
	}
	if(twikismartIsEmptyString(twikismartSelection)){
		twikismartSelection = "";
	}
	twikismartTextarea.value = twikismartTextareaContent;
	twikismartSetSelectionRange(twikismartTextarea,twikismartStartIndex,twikismartEndIndex);

}

/* Set all line separators to \n */
/* In IE and Opera, it is \r\n */
function twikismartReplaceAll(text){
	if(text != null && text.length > 0){
		var indice = text.indexOf("\r\n");
		while(indice != -1){
			text = text.substring(0,indice)+"\n"+text.substring(indice+2,text.length);
			indice = text.indexOf("\r\n");
		}
	}
	return text;
}

/* return cursor position in the textarea*/
function twikismartCursorPosition() {
	var node = document.getElementById(twikismartTextareaId);
	node.focus();
	/* without node.focus() IE will returns -1 when focus is not on node */ 
	if(node.selectionStart || navigator.userAgent.toLowerCase().indexOf("opera") != -1) 
		return node.selectionStart;
	else if(!document.selection)
		return 0;
	var c  = "\001";
	var sel = document.selection.createRange();
	var dul = sel.duplicate(); 
	var len = 0;
	dul.moveToElementText(node);
	sel.text = c;
	len  = (dul.text.indexOf(c));
	sel.moveStart('character',-1);
	sel.text = "";
	return len;
}

/* Select text in the given input*/
function twikismartSetSelectionRange(input, start, end) {
	// If it is Opera, change the value for selected elements !
	if(navigator.userAgent.toLowerCase().indexOf("opera") != -1){
		var sslinesBefore = twikismartNbLinesBefore(start);
		var sslinesTotal = twikismartNbLinesBefore(end);
		var sslinesInner = sslinesTotal - sslinesBefore;
		start = start+sslinesBefore;
		end = end+sslinesTotal;
		
		//twikismartDebug("Start and end : "+start+"_"+end);
	}
//twikismartNbLinesBefore

	if (is_firefox) {
		input.setSelectionRange(start, end);
		input.focus();
	} 
	else {
		// assumed IE
		var range = input.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();
	}
}

/* Cheat mode for Opera  - I have to know the number of lines before the first selected character to set the new startSelection value*/
function twikismartNbLinesBefore(index){
	var text = twikismartTextarea.value;
	var ind = twikismartIndexsOf(text,"\r\n");
	var nb = 0;
	if(ind != null && ind.length > 0){
		for(var i=0;i<ind.length;i++){
			if(ind[i] < index){
				nb++;
			}
		}
	}
	return nb;
}

/* returns an array with all indexes of the tosearch string in text*/
function twikismartIndexsOf(text, tosearch){
	var result = new Array();
	var result2 = new Array();
	if(text != null && text.length > 0){
		var index = text.lastIndexOf(tosearch);
		if(index != -1){
			while(index != -1 && text.length > 0){
				result2.push(index);
				text = text.substring(0,index);
				index = text.lastIndexOf(tosearch);
			}
			if(result2.length > 0){
				for(var i=result2.length-1;i>=0;i--){
					result.push(result2[i]);
				}
			}
		}
	}
	return result;
}
/* Write some debug info under textarea*/
function twikismartDebug(text){
	var divinfo = document.getElementById('twikismartinfo');
	divinfo.className="twikismartinfo"+smartEditorIECssClass;
	var tmptext = document.createElement('div');
	tmptext.innerHTML = text;
	divinfo.appendChild(tmptext);
}

/* Test if text is an empty string*/
function twikismartIsEmptyString(text){
	count = 0;
	if(text != null && text.length > 0){
		while(text.charAt(count) == " "){
			count++;
		}
		if(count == text.length){
			return true;
		}
	}
	else{
		if(text.length == 0){
			return true;
		}
	}
	return false;
}

function twikismartIndexOfFirstCharacter(text){
	if(text!=null && text.length > 0){
		var currentPos = 0;
		while(text.length>0 && text.indexOf(" ")==0){
			currentPos++;
			text = text.substring(1,text.length);
		}
		return currentPos;
	}
	else{
		return -1;
	}
}

function twikismartIndexOfLastCharacter(text){
	if(text!=null && text.length > 0){
		var currentPos = text.length-1;
		while(text.length>0 && text.lastIndexOf(" ")==(text.length-1)){
			currentPos--;
			text = text.substring(0,text.length-1);
		}
		return currentPos;
	}
	else{
		return -1;
	}
}

function twikismartGetLines(mySelection){
	var text = mySelection;
	var myarray = twikismartIndexsOf(text,"\n");
	var textarray = new Array();
	if(myarray != null && myarray.length > 0){
		textarray.push(text.substring(0,myarray[0]));
		for(var i=0;i<myarray.length-1;i++){
			textarray.push(text.substring(myarray[i],myarray[i+1]));
		}
		textarray.push(text.substring(myarray[myarray.length-1],text.length));
	}
	else{ // No line detected
		textarray.push(text);
	}
	return textarray;
}

function twikismartIndexOfBulletOrNumList(text){
	var result = -1;
	var stringres = "";
	if(text.indexOf("   1 ") >= 0){
		while(text.indexOf("   ") == 0){
			text = text.substring(3,text.length);
			result++;	
		}
		stringres+="1 ";
		if(text.length == 2 || (text.length > 2 && twikismartIsEmptyString(text.substring(2,text.length)))){
			listtodelete = true;
			return -1;
		}
		
	}
	else{
		if(text.indexOf("   * ") >= 0){
			while(text.indexOf("   ") == 0){
				text = text.substring(3,text.length);
				result++;
			}
			stringres+="* ";
			if(text.length == 2 || (text.length > 2 && twikismartIsEmptyString(text.substring(2,text.length)))){
				listtodelete = true;
				return -1;
			}
		}
	}
	return result;
}

// Returns value from 1 to 6 to give the Heading value - returns -1 else no heading detected
// The given text musn't contain \n character
function twikismartContainsHeading(text){
	if(text != null && text.length > 3){
		if(text.indexOf("---") == 0){
			if(text.indexOf("---++++++") == 0){	
				return 6;
			}
			else{
				if(text.indexOf("---+++++") == 0){
					return 5;
				}
				else{
					if(text.indexOf("---++++") == 0){
						return 4;
					}
					else{
						if(text.indexOf("---+++") == 0){
							return 3;
						}
						else{
							if(text.indexOf("---++") == 0){
								return 2;
							}
							else{
								if(text.indexOf("---+") == 0){
									return 1;
								}
								else{
									return -1;
								}
							}
						}
					}
				}
			}
		}
		else{
			return -1;
		}
	}
	return -1;
}

function twikismartParseCustomerFunctions(){
	if(twikismartCustomerPreferences != null && twikismartCustomerPreferences.length > 0){
		twikismartCustomerPreferences = twikismartReplaceAll(twikismartCustomerPreferences);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartCustomerPreferences,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartCustomerPreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartCustomerPreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						twikismartCustomerStrings.push(tsElementString);
						twikismartCustomerFunctionNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function twikismartParseWebFunctions(){
	if(twikismartWebPreferences != null && twikismartWebPreferences.length > 0){
		twikismartWebPreferences = twikismartReplaceAll(twikismartWebPreferences);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartWebPreferences,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartWebPreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartWebPreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						twikismartWebStrings.push(tsElementString);
						twikismartWebFunctionNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function twikismartParseSiteFunctions(){

	if(twikismartSitePreferences != null && twikismartSitePreferences.length > 0){
		twikismartSitePreferences = twikismartReplaceAll(twikismartSitePreferences);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartSitePreferences,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartSitePreferences,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartSitePreferences.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
					}
					if(elementIsValid){
						
						twikismartSiteStrings.push(tsElementString);
						twikismartSiteFunctionNames.push(tsElementName);
					}
				}
			}
		}
	}
}

function smartEditorDoGetWebs(){
	var req = null;      
	if(window.XMLHttpRequest){ // Firefox 
      req = new XMLHttpRequest();  
	 }
	else{ 
		if(window.ActiveXObject){ // Internet Explorer 
			req = new ActiveXObject("Microsoft.XMLHTTP");			
		}
		else { // XMLHttpRequest non supporté par le navigateur 
			alert("Your browser is not compliant ! Please use another one !"); 
			return; 
		}
	} 
	var address = twikismartWikiHomeURL+'?skin=smarteditorweblist';
	var smartResponse ="";
	req.open("GET", address, true);
	req.onreadystatechange = function() { 
		if(req.readyState == 4){ 
			smartEditInitWebs(req.responseText);
		}
	}
	req.send(null);
}

function smartEditInitWebs(text){ 
	var theHTML = "Select web <SELECT id=\"smartEditorWebSelectElement\">"+text+"</SELECT>";
	if(document.getElementById("smarteditorWebChoice") != null){
		document.getElementById("smarteditorWebChoice").innerHTML = theHTML;
		var webSelect = document.getElementById("smartEditorWebSelectElement");
		//document.getElementById("smartEditorWebSelectElementTable").style.width = "100%";
		//document.getElementById("smartEditorWebSelectElementTable").style.margin = "0px";
		webSelect.value = twikismartCurrentWeb;
		selectWebClicked(twikismartCurrentWeb);
		webSelect.onchange = function(){selectWebClicked(webSelect.value)};
	}
}

function selectWebClicked(theWebValue){
	document.getElementById("smartEditorInputTopic").style.display = "none";
	smartEditorDoGetWebTopics(theWebValue);
	selectedWeb = theWebValue;
}

function smartEditorDoGetWebTopics(web){
	var req = null;      
	if(window.XMLHttpRequest){ // Firefox 
      req = new XMLHttpRequest();  
	 }
	else{ 
		if(window.ActiveXObject){ // Internet Explorer 
			req = new ActiveXObject("Microsoft.XMLHTTP");			
		}
		else { // XMLHttpRequest non supporté par le navigateur 
			alert("Your browser is not compliant ! Please use another one !"); 
			return; 
		}
	} 
	var address = twikismartWikiHomeURL+"/"+web+'?skin=smarteditorwebtopiclist';
	//alert("Address : "+address);
	var smartResponse ="";
	req.open("GET", address, true);
	req.onreadystatechange = function() {
		if(req.readyState == 4){ 
			smartEditInitWebTopics(req.responseText);
		}
	}
	req.send(null);
}

function smartEditInitWebTopics(text){
	twikismartParseTopics(text);
}

function twikismartParseTopics(webTopics){ 

	smartEditTopicList = new Array();	

	if(webTopics != null && webTopics.length > 0){
		webTopics = twikismartReplaceAll(webTopics);
		var tsIndexesOfStartElements = twikismartIndexsOf(webTopics,"<topic>");
		var tsIndexesOfEndElements = twikismartIndexsOf(webTopics,"</topic>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = webTopics.substring(tsIndexesOfStartElements[i]+7,tsIndexesOfEndElements[i]); 
					smartEditTopicList.push(tsElement);
				}
			}
		}
	}
	document.getElementById("smartEditorInputTopic").style.display = "";
	smartEditInitAutoCompletion(smartEditTopicList, "smartEditorInputTopic", true);
}

function twikismartParseCustomerSmileys(){
	if(twikismartTWikiUserIcons != null && twikismartTWikiUserIcons.length > 0){
		twikismartTWikiUserIcons = twikismartReplaceAll(twikismartTWikiUserIcons);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartTWikiUserIcons,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartTWikiUserIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartTWikiUserIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						twikismartCustomerIcons.push(tsElementString);
						twikismartCustomerIconsNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function twikismartParseWebSmileys(){
	if(twikismartTWikiWebIcons != null && twikismartTWikiWebIcons.length > 0){
		twikismartTWikiWebIcons = twikismartReplaceAll(twikismartTWikiWebIcons);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartTWikiWebIcons,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartTWikiWebIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartTWikiWebIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
						
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
						
					}
					if(elementIsValid){
						
						twikismartWebIcons.push(tsElementString);
						twikismartWebIconsNames.push(tsElementName);
					}
					
				}
				else{
					
				}
			}
		}
		else{
			
		}
	}
	else{
		
	}
}

function twikismartParseSiteSmileys(){
	if(twikismartTWikiSiteIcons != null && twikismartTWikiSiteIcons.length > 0){
		twikismartTWikiSiteIcons = twikismartReplaceAll(twikismartTWikiSiteIcons);
		var tsIndexesOfStartElements = twikismartIndexsOf(twikismartTWikiSiteIcons,"<tselement>");
		var tsIndexesOfEndElements = twikismartIndexsOf(twikismartTWikiSiteIcons,"</tselement>");
		if(tsIndexesOfStartElements != null && tsIndexesOfEndElements != null && tsIndexesOfEndElements.length == tsIndexesOfStartElements.length){
			for(var i =0; i< tsIndexesOfEndElements.length;i++){
				if(tsIndexesOfStartElements[i] < tsIndexesOfEndElements[i]){
					var tsElement = twikismartTWikiSiteIcons.substring(tsIndexesOfStartElements[i]+11,tsIndexesOfEndElements[i]); 
					var elementIsValid = true;
					
					// Process for the element name
					var tsElementName = "";
					var tsIndexOfStartNameTag = tsElement.indexOf("<tsname>");
					var tsIndexOfEndNameTag = tsElement.indexOf("</tsname>");
					if(tsIndexOfStartNameTag != -1 && tsIndexOfEndNameTag != -1 && tsIndexOfStartNameTag < tsIndexOfEndNameTag){
						tsElementName = tsElement.substring(tsIndexOfStartNameTag+8,tsIndexOfEndNameTag);
					}
					else{
						elementIsValid = false;
					}
					
					// Process for the element string to insert
					var tsElementString = "";
					var tsIndexOfStartStringTag = tsElement.indexOf("<tsstring>");
					var tsIndexOfEndStringTag = tsElement.indexOf("</tsstring>");
					if(tsIndexOfStartStringTag != -1 && tsIndexOfEndStringTag != -1 && tsIndexOfStartStringTag < tsIndexOfEndStringTag){
						tsElementString = tsElement.substring(tsIndexOfStartStringTag+10,tsIndexOfEndStringTag);
					}
					else{
						elementIsValid = false;
					}
					if(elementIsValid){
						
						twikismartSiteIcons.push(tsElementString);
						twikismartSiteIconsNames.push(tsElementName);
					}
				}
			}
		}
	}
}
