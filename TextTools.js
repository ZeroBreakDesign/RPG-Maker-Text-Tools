var Imported = Imported || {}; 
Imported.ZeroBreakTextTools = true;

//==========================================================================
// TextTools.js
//==========================================================================

/*:
* @plugindesc Text manipulation and management plugin for MV/MZ
* @author BreakerZero
* @target MZ
* @help
* Text Tools by BreakerZero V1.0.1
* Free to use under the terms of the MIT license.
* ------------------------------------------------------------------------------
* This plugin is designed to simplify the use of JavaScript text functions and
* serve other purposes which may relate to character dialogue or other in-game
* text displays. It revolves around alternating case, upper case and functions
* related to categories of language.
* ------------------------------------------------------------------------------
* Script Calls
* ------------------------------------------------------------------------------
* Alternating Case
* This function changes a string of text to alternating case. Useful if you have
* a character that speaks through artificial means, or who is a mechanical being
* in a sci-fi scenario. To use, add this to a game variable definition:
*
*  alternatingCase(string)
*
* Alternatively, you can use a script call. For example:
*  $gameVariables.setValue(1, alternatingCase("good morning");
*     
* String: the text string to convert.
* 
* Actor Name Alternating Case
* This version of the alternating case function affects the name of the actor
* specified by his or her ID number. To use, add this to a game variable
* definition:
*
*  actorNameAlternatingCase(actorID)
*
* Alternatively, you can use a script call. Using actor one as an example:
*  $gameVariables.setValue(1, actorNameAlternatingCase(1);
*     
* String: the text string to convert.
* 
* Upper Case
* This function changes a string of text to upper case. Useful if you have a
* character who is extremely angry, or to place emphasis on a portion of the
* game's text. To use, add this to a game variable definition:
*
*  upperCase(string)
*
* Alternatively, you can use a script call. For example:
*  $gameVariables.setValue(1, upperCase("good morning");
*     
* String: the text string to convert.
* 
* Actor Name Upper Case
* This version of the upper case function affects the name of the actor 
* specified by his or her ID number. To use, add this to a game variable
* definition:
*
*  actorNameUpperCase(actorID)
*
* Alternatively, you can use a script call. Using actor one as an example:
*  $gameVariables.setValue(1, actorNameUpperCase(1);
*     
* String: the text string to convert.
* 
* ------------------------------------------------------------------------------
* Configuration Settings
* ------------------------------------------------------------------------------
* Use Family Mode
* Allows for the creation of a family mode for your game, which detects and
* hides any strong language in game dialogue. Supports English, German, Italian,
* Spanish, Japanese, Chinese and Korean languages. Turn on and off in the game
* settings. Note that the functionality is not dependent on the case of text
* used - it can be upper case, lower case or a combination thereof and still
* detect the words to be filtered out. The most common forms of strong language
* (and a few culturally sensitive ones) are detected and filtered when using
* this functionality.
*
* Family Mode Option Text
* When using family mode, this sets the name of the option in the preferences
* screen.
*
* Filter List File Name
* When using family mode, sets the name of the filter list. Make sure it's saved
* within the data directory as a comma-separated value (CSV) file.
*
* Replacement Text
* When using family mode, it determines what text is used to replace strong
* language in the game's dialogue. Default option is a simple BLEEP marker.
*
* ------------------------------------------------------------------------------
* Release history:
* ------------------------------------------------------------------------------
* v1.0.0: Initial RTM
* v1.0.1: Added moderate mode option to set filtering strength in family mode
*
*
* @param Use Family Mode
* @desc Determines if family mode is supported in the game.
* @type boolean
* @default true
* @param Family Mode Option Text
* @desc When using family mode, sets the name of the main option.
* @type text
* @default Family Mode
* @param Filter List File Name
* @desc When using family mode, sets the name of the filter list (make sure it's saved in CSV format).
* @type text
* @default blocklist
* @param Replacement Text
* @desc When using family mode, sets the replacement text.
* @type text
* @default BLEEP
*/

var textTools = textTools || {};
var parameters = PluginManager.parameters('TextTools');
textTools.familyModeOption = String(parameters['Use Family Mode']);
textTools.familyModeName = String(parameters['Family Mode Option Text']);
textTools.blockListFile = String(parameters['Filter List File Name']);
textTools.bleepText = String(parameters['Replacement Text']);
textTools.familyModeActivated = false;
ConfigManager.familyModeOption = false;
var filteredDialogue;
var blockList;

(function($) {
	
	var saveFamilyModeSettings = $.makeData;
	$.makeData = function() {
        var config = saveFamilyModeSettings.call(this);
        config.familyMode = this.familyModeOption;
        return config;
	}

	var readFamilyModeSettings = $.applyData;
	$.applyData = function(config) {
            readFamilyModeSettings.call(this, config);
            this.familyModeOption = config.familyMode;
	}

})(ConfigManager);

// Family Mode

function iterate(item) {
    console.log(item);
    filteredDialogue = filteredDialogue.replace(new RegExp("\\b"+item+"\\b", "ig"), textTools.bleepText);
    console.log(filteredDialogue);
}

function processData(data) {
    console.log(data);
    blockList = data.split(",");
}

Game_Message.prototype.addText = function(text) {
    filteredDialogue = text;
    $.ajax({
        type: "GET",
        url: "data/" + textTools.blockListFile + ".csv",
        dataType: "text",
        success: function(data) { processData(data); }
     });
    if (ConfigManager.familyModeOption)
    {
    	blockList.forEach(iterate);
    }
    // The following line is for compatibility with Yanfly Message Core on MV
    if (Imported.YEP_MessageCore == true && $gameSystem.wordWrap()) filteredDialogue = '<WordWrap>' + filteredDialogue;
    this.add(filteredDialogue);
};

// Alternating Case

var alternatingCase = function (string) {
  var chars = string.toLowerCase().split("");
  for (var i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toUpperCase();
  }
  return chars.join("");
};

var actorNameAlternatingCase = function (actorID) {
  return alternatingCase($gameActors.actor(actorID).name());
};

// Upper Case

var upperCase = function (string) {
  return string.toUpperCase();
};

var actorNameUpperCase = function (actorID) {
  return upperCase($gameActors.actor(actorID).name());
};

// Manage Options

  textTools.addToOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    textTools.addToOptions.call(this);
    if (!Imported.YEP_OptionsCore) this.addFamilyModeCommands();
  };
 
  Window_Options.prototype.addFamilyModeCommands = function() {
    if (textTools.familyModeOption) this.addCommand(textTools.familyModeName, 'familyModeOption', true);
  };
 
  textTools.updateOptions = Window_Options.prototype.update;
  Window_Options.prototype.update = function() {
    textTools.updateOptions.call(this);
      this.refresh();
      this.height = this.windowHeight();
      this.updatePlacement();
  };
