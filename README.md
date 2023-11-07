# RPG-Maker-Text-Tools
This plugin is designed to simplify the use of JavaScript text functions and serve other purposes which may relate to character dialogue or other in-game text displays. It revolves around alternating case, upper case and functions related to categories of language.

## Script Calls

### Alternating Case

This function changes a string of text to alternating case. Useful if you have a character that speaks through artificial means, or who is a mechanical being in a sci-fi scenario. To use, add this to a game variable definition:

alternatingCase(string)

Alternatively, you can use a script call. For example:

$gameVariables.setValue(1, alternatingCase("good morning"));
     
String: the text string to convert.
 
### Actor Name Alternating Case

This version of the alternating case function affects the name of the actor specified by his or her ID number. To use, add this to a game variable definition:

actorNameAlternatingCase(actorID)

Alternatively, you can use a script call. Using actor one as an example:

$gameVariables.setValue(1, actorNameAlternatingCase(1));
     
actorID: the targeted actor's ID number.
 
### Upper Case

This function changes a string of text to upper case. Useful if you have a character who is extremely angry, or to place emphasis on a portion of the game's text. To use, add this to a game variable definition:

upperCase(string)

Alternatively, you can use a script call. For example:

$gameVariables.setValue(1, upperCase("good morning"));
     
String: the text string to convert.

### Actor Name Upper Case
This version of the upper case function affects the name of the actor specified by his or her ID number. To use, add this to a game variable definition:

actorNameUpperCase(actorID)

Alternatively, you can use a script call. Using actor one as an example:

$gameVariables.setValue(1, actorNameUpperCase(1));
     
actorID: the targeted actor's ID number.

## Configuration Settings

### Use Family Mode
Allows for the creation of a family mode for your game, which detects and hides any strong language in game dialogue. Note that the functionality is not dependent on the case of text used - it can be upper case, lower case or a combination thereof and still detect the words to be filtered out.  

### Family Mode Option Text
When using family mode, this sets the name of the option in the preferences screen.

### Filter List File Name
When using family mode, sets the name of the filter list. Make sure it's saved within the data directory as a comma-separated value (CSV) file. A sample file supporting English, German, Italian, Spanish, Japanese, Korean and Simplified Chinese is included in this repository as blocklist.csv (which is also the default file name).

### Replacement Text
When using family mode, it determines what text is used to replace strong language in the game's dialogue. Default option is a simple BLEEP marker.

## Release history:
v1.0.0: Initial RTM
