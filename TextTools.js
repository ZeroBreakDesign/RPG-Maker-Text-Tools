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
* Text Tools by BreakerZero V1.1.4
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
* hides any strong language in game dialogue. Note that the functionality is
* not dependent on the case of text used - it can be upper case, lower case or
* a combination thereof and still detect the words to be filtered out.
*
* Family Mode Option Text
* When using family mode, this sets the name of the option in the preferences
* screen.
*
* Block List File Name
* When using family mode, sets the name of the block list. Make sure it's
* saved within the data directory as a comma-separated value (CSV) file. A
* sample file supporting English, German, Italian, Spanish, Japanese, Korean
* and Simplified Chinese is included in the GitHub repository as blocklist.csv
* (which is also the default file name).
*
* Replacement Text
* When using family mode, it determines what text is used to replace strong
* language in the game's dialogue. Default option is a simple BLEEP marker.
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
* @param Block List File Name
* @desc When using family mode, sets the name of the block list (make sure it's saved in CSV format).
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
textTools.blockListFile = String(parameters['Block List File Name']);
textTools.bleepText = String(parameters['Replacement Text']);
textTools.familyModeActivated = false;
ConfigManager.familyModeOption = false;
var filteredDialogue;
var blockList = [];

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

// The following overrides are used to allow the block list to function. They are implemented in the same way as
// Yanfly Message Core, with added code for compatibility with that plugin. Although I did consider changing a
// few of the variables out of respect for both ethics reasons and Yanfly's licensing, further analysis shows
// that the calls are mostly just standard MV/MZ code adapted to the requirements of the Yanfly implementation.
// Therefore the code remains as-is so as not to break any functionality.

Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
      $gameMessage.setFaceImage(this._params[0], this._params[1]);
      $gameMessage.setBackground(this._params[2]);
      $gameMessage.setPositionType(this._params[3]);
      while (this.isContinueMessageString()) {
        this._index++;
        if (this._list[this._index].code === 401) {
          $gameMessage.addText(this.currentCommand().parameters[0]);
        }
        if (Imported.YEP_MessageCore == true && $gameMessage._texts.length >= $gameSystem.messageRows()) break;
      }
      switch (this.nextEventCode()) {
      case 102:
        this._index++;
        this.setupChoices(this.currentCommand().parameters);
        break;
      case 103:
        this._index++;
        this.setupNumInput(this.currentCommand().parameters);
        break;
      case 104:
        this._index++;
        this.setupItemChoice(this.currentCommand().parameters);
        break;
      }
      this._index++;
      this.setWaitMode('message');
    }
    return false;
};

Game_Interpreter.prototype.isContinueMessageString = function() {
    if (this.nextEventCode() === 101 && $gameSystem.messageRows() > 4) {
      return true;
    } else {
      return this.nextEventCode() === 401;
    }
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
