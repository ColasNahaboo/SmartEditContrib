#################### QUICK INSTALL

Copy the contents to your Foswiki install dir:
  cp -a data  pub  templates lib YOUR_WIKI_DIR

To set the SmartEditorAddOn on all webs, go to your Main.SitePreferences 
and set new skin as follows :
   * Set SKIN = smarteditor, pattern
   
You will want also to add to this topic:

---++ Smartedit
   * Set SMARTEDITSTRINGSITE = \
     <tselement><tsname>Today's Date</tsname><tsstring>%GMTIME{$year-$mo-$day}%</tsstring></tselement>\
     <tselement><tsname>User name</tsname><tsstring>%WIKIUSERNAME%</tsstring></tselement>\
     <tselement><tsname>Signature</tsname><tsstring>--&nbsp;%WIKIUSERNAME% - %DATE%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added at top</tsname><tsstring>%<nop>COMMENT{type='top'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added at end</tsname><tsstring>%<nop>COMMENT{type='bottom'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added immediately before</tsname><tsstring>%<nop>COMMENT{type='above'}%</tsstring></tselement>\
     <tselement><tsname>Bullet item added immediately before</tsname><tsstring>%<nop>COMMENT{type='bulletabove'}%</tsstring></tselement>\
     <tselement><tsname>Wiki thread mode comment, signed and dated</tsname><tsstring>%<nop>COMMENT{type='threadmode'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added recurse after comment box</tsname><tsstring>%<nop>COMMENT{type='belowthreadmode'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added immediately below</tsname><tsstring>%<nop>COMMENT{type='below'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added at top of table below</tsname><tsstring>%<nop>COMMENT{type='tableprepend'}%</tsstring></tselement>\
     <tselement><tsname>Comments, signed and dated, added at end of table above</tsname><tsstring>%<nop>COMMENT{type='tableappend'}%</tsstring></tselement>\
     <tselement><tsname>Add before the comment box, after the last comment</tsname><tsstring>%<nop>COMMENT{type='after'}%</tsstring></tselement>\
     <tselement><tsname>Action of Action Tracker added to action table directly above</tsname><tsstring>%<nop>COMMENT{type='action'}%</tsstring></tselement>\
     <tselement><tsname>Tablerows adding on end</tsname><tsstring>%<nop>COMMENT{type='table'}%</tsstring></tselement>\
     <tselement><tsname>Talk using TOC adding on end</tsname><tsstring>%<nop>COMMENT{type='toctalk'}%</tsstring></tselement>\
     <tselement><tsname>Create a list of annotated bookmarks</tsname><tsstring>%<nop>COMMENT{type='bookmark'}%</tsstring></tselement>\
     <tselement><tsname>Post to a different topic and return to here</tsname><tsstring>%<nop>COMMENT{type='return'}%</tsstring></tselement>
   * Set SMARTEDITSTRINGWEB = 
   * Set SMARTEDITSTRINGUSER =
   
   * Set SMARTEDITICONSITE = \
     <tselement><tsname> %ICON{info}% info</tsname><tsstring>%<nop>ICON{info}%</tsstring></tselement>\
     <tselement><tsname> %ICON{more}% more</tsname><tsstring>%<nop>ICON{more}%</tsstring></tselement>\
     <tselement><tsname> %ICON{note}% note</tsname><tsstring>%<nop>ICON{note}%</tsstring></tselement>\
     <tselement><tsname> %ICON{pencil}% pencil</tsname><tsstring>%<nop>ICON{pencil}%</tsstring></tselement>\
     <tselement><tsname> %ICON{question}% question</tsname><tsstring>%<nop>ICON{question}%</tsstring></tselement>\
     <tselement><tsname> %ICON{stargold}% stargold</tsname><tsstring>%<nop>ICON{stargold}%</tsstring></tselement>\
     <tselement><tsname> %ICON{starred}% starred</tsname><tsstring>%<nop>ICON{starred}%</tsstring></tselement>\
     <tselement><tsname> %ICON{stop}% stop</tsname><tsstring>%<nop>ICON{stop}%</tsstring></tselement>\
     <tselement><tsname> %ICON{target}% target</tsname><tsstring>%<nop>ICON{target}%</tsstring></tselement>\
     <tselement><tsname> %ICON{tip}% tip</tsname><tsstring>%<nop>ICON{tip}%</tsstring></tselement>\
     <tselement><tsname> %ICON{warning}% warning</tsname><tsstring>%<nop>ICON{warning}%</tsstring></tselement>\
     <tselement><tsname> %ICON{wip}% wip</tsname><tsstring>%<nop>ICON{wip}%</tsstring></tselement>\
     <tselement><tsname> %ICON{watch}% watch</tsname><tsstring>%<nop>ICON{watch}%</tsstring></tselement>\
     <tselement><tsname> %ICON{wrench}% wrench</tsname><tsstring>%<nop>ICON{wrench}%</tsstring></tselement>\
     <tselement><tsname> %ICON{person}% person</tsname><tsstring>%<nop>ICON{person}%</tsstring></tselement>\
     <tselement><tsname> %ICON{group}% group</tsname><tsstring>%<nop>ICON{group}%</tsstring></tselement>\
     <tselement><tsname> %ICON{key}% key</tsname><tsstring>%<nop>ICON{key}%</tsstring></tselement>\
     <tselement><tsname> %ICON{lock}% lock</tsname><tsstring>%<nop>ICON{lock}%</tsstring></tselement>\
     <tselement><tsname> %ICON{new}% new</tsname><tsstring>%<nop>ICON{new}%</tsstring></tselement>\
     <tselement><tsname> %ICON{todo}% todo</tsname><tsstring>%<nop>ICON{todo}%</tsstring></tselement>\
     <tselement><tsname> %ICON{updated}% updated</tsname><tsstring>%<nop>ICON{updated}%</tsstring></tselement>\
     <tselement><tsname> %ICON{done}% done</tsname><tsstring>%<nop>ICON{done}%</tsstring></tselement>\
     <tselement><tsname> %ICON{closed}% closed</tsname><tsstring>%<nop>ICON{closed}%</tsstring></tselement>\
     <tselement><tsname> %ICON{choice-yes}% choice-yes</tsname><tsstring>%<nop>ICON{choice-yes}%</tsstring></tselement>\
     <tselement><tsname> %ICON{choice-no}% choice-no</tsname><tsstring>%<nop>ICON{choice-no}%</tsstring></tselement>\
     <tselement><tsname> %ICON{choice-cancel}% choice-cancel</tsname><tsstring>%<nop>ICON{choice-cancel}%</tsstring></tselement>\
     <tselement><tsname> %ICON{minus}% minus</tsname><tsstring>%<nop>ICON{minus}%</tsstring></tselement>\
     <tselement><tsname> %ICON{plus}% plus</tsname><tsstring>%<nop>ICON{plus}%</tsstring></tselement>\
     <tselement><tsname> %ICON{home}% home</tsname><tsstring>%<nop>ICON{home}%</tsstring></tselement>\
     <tselement><tsname> %ICON{left}% left</tsname><tsstring>%<nop>ICON{left}%</tsstring></tselement>\
     <tselement><tsname> %ICON{right}% right</tsname><tsstring>%<nop>ICON{right}%</tsstring></tselement>\
     <tselement><tsname> %ICON{up}% up</tsname><tsstring>%<nop>ICON{up}%</tsstring></tselement>\
     <tselement><tsname> %ICON{down}% down</tsname><tsstring>%<nop>ICON{down}%</tsstring></tselement>
   * Set SMARTEDITICONWEB =
   * Set SMARTEDITICONUSER =


#################### FULL DOCUMENTATION

Then follow SmartEditContrib documentation on your wiki in System.SmartEditContrib

Acknowledgements:
   * To Martin Rothbaum for the SmartEditAddon_alt-tab.patch

#################### TO ADAPT TO OTHER SKINS THAN PATTERN-BASED ONES

For the view & preview template:
-------------------------------

// Add in the header:

<link rel="stylesheet" type="text/css" href="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/wikismartstyle.css"/>


For the edit template:
----------------------

// Add the javascript in the header: (the last line is the same as view)

<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/mochikit/lib/MochiKit/MochiKit.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/wikismartEngine.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/wikismartActions.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/smartEditUI.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/wikismartEvents.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/smartEditAutoCompletion.js"></script>
<script type="text/javascript" src="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/smartEditDynamicDivision.js"></script>
<link rel="stylesheet" type="text/css" href="%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/wikismartstyle.css"/>

// Add this just before the main <form:

<div id="smartEditorTopToolbarID"></div>

// Add id="topic" to the <textarea if not already there

// Add this anywhere after the textarea

<script type="text/javascript">
// The script URL - with / at the end
wikismartScriptURL = '%PUBURLPATH%/%SYSTEMWEB%/SmartEditContrib/';   
wikismartWikiHomeURL = '%SCRIPTURL%/view'; 
wikismartWikiSkin = '%SKIN%';
// Load all specific preferences
wikismartSitePreferences = ""+"%SMARTEDITSTRINGSITE%";
wikismartWebPreferences = ""+"%SMARTEDITSTRINGWEB%";
wikismartCustomerPreferences = ""+"%SMARTEDITSTRINGUSER%";
// 3 following lines to add if you have an old smartedit addon installation
wikismartFoswikiSiteIcons = ""+""%SMARTEDITICONSITE%";
wikismartFoswikiWebIcons = ""+"%SMARTEDITICONWEB%";
wikismartFoswikiUserIcons = ""+'%SMARTEDITICONUSER%";
// End of copy
wikismartCurrentWeb = "%WEB%";
// To know the id of the textarea ... if it is not 'topic'
wikismartEdit('topic');
</script>

