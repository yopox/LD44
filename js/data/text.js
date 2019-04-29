var INITIAL_MESSAGE = 
    "I was sent on a strange system. Apparently\n" +
    "slavery is a common thing in here...\n" +
    "I was even told a slave Baron uses this \n"+
    "system as his headquarters.\n" +
    "My crew is a little nervous about the whole\n" +
    "thing, but I am trying to assure them nothing\n" +
    "is going to harm us.\n" +
    "I will investigate further this situation.";

var FIRST_SHOP_1 = 
    "Well, I can only tell I now know how slavery\n" +
    "developped here. Everything is paid in slaves...\n" +
    "Even though those weapons were tempting I\n" +
    "prefer keeping my crew safe.\n" +
    "Still I am preoccupied by a few things, in order\n" +
    "to defeat the Baron, I should upgrade my vessel.\n" +
    "I could either sell my crew or wish that I am\n" +
    "a good enough pilot to ensure our safety...";

var FIRST_SHOP_2 = 
    "Well, I can only tell I now know how slavery\n" +
    "developped here. Everything is paid in slaves.\n" +
    "However these new ship features were crucial.\n" +
    "I surely saved more lives buy letting a few go.\n" +
    "Still I am preoccupied by a few things, in order\n" +
    "to defeat the Baron, I should upgrade my vessel.\n" +
    "I could either sell my crew or wish that I am\n" +
    "a good enough pilot to ensure our safety...";

function getLog(progress) {
    var message = "LOG - DAY " + progress.day + " :\n";
    
    if (progress.day == 1) {
        // Initial message
        message += INITIAL_MESSAGE;
    } else if (progress.firstShopVisit[0]) {
        // First shop visit
        progress.firstShopVisit[0] = false;
        message += progress.boughtSomething ? FIRST_SHOP_2 : FIRST_SHOP_1;
    } else if (!progress.crew) {
    }
    
    progress.day++;
    return message;
}