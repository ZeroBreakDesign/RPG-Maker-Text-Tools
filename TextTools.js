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
* Allow Moderate Mode
* When using family mode, this allows the developer to set whether more moderate
* language should be allowed. Turn this off to block all strong language or turn
* it on and let the player decide.
*
* Moderate Mode Option Text
* When using family mode, this sets the name of the moderate mode option in the
* preferences screen.
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
* @param Allow Moderate Mode
* @desc When using family mode, determines if moderate-strength language is allowed.
* @type boolean
* @default true
* @param Family Mode Option Text
* @desc When using family mode, sets the name of the main option.
* @type text
* @default Family Mode
* @param Moderate Mode Option Text
* @desc When using family mode, sets the name of the filtering level option.
* @type text
* @default Moderate Mode
* @desc When using family mode, specifies any additional words you wish to hide from the player.
* @param Replacement Text
* @desc When using family mode, sets the replacement text.
* @type text
* @default BLEEP
*/

var textTools = textTools || {};
var parameters = PluginManager.parameters('TextTools');
textTools.familyModeOption = String(parameters['Use Family Mode']);
textTools.moderateModeOption = String(parameters['Allow Moderate Mode']);
textTools.familyModeName = String(parameters['Family Mode Option Text']);
textTools.moderateModeName = String(parameters['Moderate Mode Option Text']);
textTools.customWordList = JSON.parse(parameters['Custom Block List']);
textTools.bleepText = String(parameters['Replacement Text']);
textTools.familyModeActivated = false;
textTools.moderateModeActivated = false;
ConfigManager.familyModeOption = false;
ConfigManager.moderateModeOption = false;
ConfigManager.extensiveModeOption = false;
var filteredDialogue;

(function($) {
	
	var saveFamilyModeSettings = $.makeData;
	$.makeData = function() {
        var config = saveFamilyModeSettings.call(this);
        config.familyMode = this.familyModeOption;
        config.moderateMode = this.moderateModeOption;
        return config;
	}

	var readFamilyModeSettings = $.applyData;
	$.applyData = function(config) {
            readFamilyModeSettings.call(this, config);
            this.familyModeOption = config.familyMode;
            if (!textTools.moderateModeOption) this.moderateModeOption = false;
	    else this.moderateModeOption = config.moderateMode;
	}

})(ConfigManager);

// Family Mode

        function iterate(item) {
            console.log(item);
            filteredDialogue = filteredDialogue.replace(new RegExp("\\b"+item+"\\b", "ig"), textTools.bleepText);
            console.log(filteredDialogue);
        };

Game_Message.prototype.addText = function(text) {
    filteredDialogue = text;
    var moderateSwears = ["bastard", "damn", "shit", "bitch", "asshole", "goddammit", "ass", "dammit", "jackass", "goddamnit", "damnit", "goddamn", "bastardo", "maldito", "mierda", "perra", "imbécil", "maldita sea", "culo", "burro", "verdammt", "Scheiße", "Schlampe", "Arschloch", "gottverdammt", "Arsch", "Trottel", "dannazione", "merda", "coglione", "畜生", "クソ", "ビッチ", "ケツの穴", "ゴッド畜生", "ケツ", "畜生", "ジャッカス", "ゴッド畜生", "젠장", "썅년", "개자식", "빌어먹을", "엉덩이", "빌어먹을", "该死", "狗屎", "婊子", "混蛋", "该死", "屁股", "蠢货", "该死"];
    var extremeSwears = ["cunt", "fucking", "fuck", "motherfucker", "fucker", "nigger", "nigga", "niggah", "whore", "retard", "negro", "ho", "coño", "follar", "joder", "hijo", "cabrón", "negroh", "puta", "retrasado", "Fotze", "ficken", "Ficker", "Hure", "Zurückgebliebener", "Neger", "fica", "fottuta", "cazzo", "figlio", "stronzo", "puttana", "ritardato", "マンコ", "ファッキング", "ファック", "マザーファッカー", "ファッカー", "ニガー", "ニガー", "売春婦", "知恵遅れ", "黒人", "ホー", "개년", "씨발", "씨발", "개새끼", "씨발놈", "깜둥이", "창녀", "흑인", "호모", "屄", "他妈的", "操", "狗娘养的", "笨蛋", "黑鬼", "妓女", "弱智", "黑人", "骚货"];
    if (ConfigManager.familyModeOption)
    {
        if (!ConfigManager.moderateModeOption) commonSwears.forEach(iterate);
    	extremeSwears.forEach(iterate);
    }
    // The following line is for compatibility with Yanfly Message Core on MV
    if (Imported.YEP_MessageCore == true && $gameSystem.wordWrap()) filteredDialogue = '<WordWrap>' + filteredDialogue;
    this.add(filteredDialogue);
};

// Alternating Case

var alternatingCase = function (string) {
  var chars = s.toLowerCase().split("");
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
    console.log('adding options');
    textTools.addToOptions.call(this);
    if (!Imported.YEP_OptionsCore) this.addFamilyModeCommands();
  };
 
  Window_Options.prototype.addFamilyModeCommands = function() {
    if (textTools.familyModeOption) this.addCommand(textTools.familyModeName, 'familyModeOption', true);
    if (textTools.familyModeOption && ConfigManager.familyModeOption && textTools.moderateModeOption) this.addCommand(textTools.moderateModeName, 'moderateModeOption', true);
  };
 
  textTools.updateOptions = Window_Options.prototype.update;
  Window_Options.prototype.update = function() {
    textTools.updateOptions.call(this);
      this.refresh();
      this.height = this.windowHeight();
      this.updatePlacement();
  };
