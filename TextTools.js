var Imported = Imported || {}; 
Imported.ZeroBreakTextTools = true;

//==========================================================================
// TextTools.js
//==========================================================================

/*:
@plugindesc Text manipulation and management plugin for MV/MZ
@author BreakerZero
@target MZ

* @param Use Family Mode
* @desc Determines if family mode is supported in the game.
* @type boolean
* @default true
* @param Family Mode Option Text
* @desc When using family mode, sets the name of the option.
* @type text
* @default Family Mode
* @param Replacement Text
* @desc When using family mode, sets the replacement text.
* @type text
* @default BLEEP

@help
* Text Tools by BreakerZero V1.0.0
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
* settings.
*
* Replacement Text
* When using family mode, it determines what text is used to replace strong
* language in the game's dialogue. Default option is a simple BLEEP marker.
*
* ------------------------------------------------------------------------------
* Release history:
* ------------------------------------------------------------------------------
* v1.0.0: Initial RTM
*/

var textTools = textTools || {};
var parameters = PluginManager.parameters('TextTools');
textTools.familyModeOption = String(parameters['Use Family Mode']);
textTools.bleepText = String(parameters['Replacement Text']);
textTools.familyModeName = String(parameters['Family Mode Option Text']);
textTools.familyModeActivated = false;
ConfigManager.familyModeOption = false;

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

var upperCase = function (string) {
  return string.toUpperCase();
};

var actorNameUpperCase = function (actorID) {
  return upperCase($gameActors.actor(actorID).name());
};


// Family Mode

var unfilteredDialogue;

(function($) {
	
	var saveFamilyModeSettings = $.makeData;
	$.makeData = function() {
        var config = saveFamilyModeSettings.call(this);
        config.familyModeOption = textTools.familyModeActivated;
        return config;
	}

	var readFamilyModeSettings = $.applyData;
	$.applyData = function(config) {
            readFamilyModeSettings.call(this, config);
            textTools.familyModeActivated = config.familyModeOption;
	}

})(ConfigManager);

  textTools.familyMode_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
  Window_Options.prototype.addGeneralOptions = function() {
    textTools.familyMode_Window_Options_addGeneralOptions.call(this);
    if (!Imported.YEP_OptionsCore) this.addFamilyModeCommand();
  };
 
  Window_Options.prototype.addFamilyModeCommand = function() {
      this.addCommand(textTools.familyModeName, 'familyModeOption', true);
  };
 
  textTools.familyMode_Window_Options_update = Window_Options.prototype.update;
  Window_Options.prototype.update = function() {
    textTools.familyMode_Window_Options_update.call(this);
      this.refresh();
      this.height = this.windowHeight();
      this.updatePlacement();
  };

Game_Message.prototype.addText = function(text) {
    filteredDialogue = text;
    var commonSwears = ["bastard", "damn", "shit", "bitch", "asshole", "cunt", "fucking", "fuck", "motherfucker", "goddammit", "ass", "nigger", "nigga", "niggah", "whore", "dammit", "jackass", "retard", "negro", "goddamnit", "ho", "damnit", "goddamn", "maldita sea", "mierda", "maldito", "puta", "gilipollas", "coño", "cabrón", "joder", "jodido","culo", "gilipollas", "retrasado", "verdammt", "wichser", "scheiße", "schlampe", "arschloch", "fotze", "ficken", "gottverdammt", "arsch", "hure", "trottel", "spasti", "neger", "hure", "putain", "merde", "salope", "cul", "chatte", "dannazione", "merda", "puttana", "stronzo", "fica", "ficker", "cazzo", "dannazione", "culo", "puttana", "dannazione", "coglione", "ritardato", "dannazione", "zoccola", "dannazione", "bâtard", "bastardo", "cazzo", "stronzo", "この野郎", "畜生", "クソ", "ビッチ", "ケツの穴", "マンコ", "ファック", "畜生", "ケツ", "ニガー", "ニガー", "売春婦", "畜生", "ジャッカス", "知恵遅れ", "ネグロ", "畜生", "ホー", "畜生", "ちくしょう", "ファッキング", "ファッカー", "マザーファッカー", "개자식", "망할", "똥", "년", "개자식", "년", "씨발", "젠장", "엉덩이", "깜둥이", "깜둥이", "깜둥이", "창녀", "젠장", "멍청이", "저능아", "흑인", "빌어먹을", "호", "젠장", "빌어먹을", "씨발", "나쁜 놈", "该死", "狗屎", "婊子", "屁眼", "屄", "操", "该死", "屁股", "黑鬼", "黑鬼", "黑鬼", "妓女", "该死", "蠢货", "弱智", "黑人", "该死", "婊子", "该死", "该死", "混蛋", "他妈的", "狗娘养的"];
    if (ConfigManager.familyModeOption)
    {
        function iterate(item) {
            console.log(item);
            filteredDialogue = filteredDialogue.replace(new RegExp("\\b"+item+"\\b", "ig"), textTools.bleepText);
            console.log(filteredDialogue);
        }
        commonSwears.forEach(iterate);
    }
    // The following line is for compatibility with Yanfly Message Core on MV
    if (Imported.YEP_MessageCore == true && $gameSystem.wordWrap()) filteredDialogue = '<WordWrap>' + filteredDialogue;
    this.add(filteredDialogue);
};
