var INITIAL_MESSAGE =
    "I was sent on a strange system. Apparently\n" +
    "slavery is a common thing in here...\n" +
    "I was even told a slave Baron uses this \n" +
    "system as his headquarters.\n" +
    "My crew is a little nervous about the whole\n" +
    "thing, but I am trying to assure them nothing\n" +
    "is going to harm us.\n" +
    "I will investigate this situation further.";

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
    "I surely saved more lives by letting a few go.\n" +
    "Still I am preoccupied by a few things, in order\n" +
    "to defeat the Baron, I should upgrade my vessel.\n" +
    "I could either sell my crew or wish that I am\n" +
    "a good enough pilot to ensure our safety...";

var BAD_3 =
    "My crew surely lost of its density, but my\n" +
    "ship is more powerful than ever.\n" +
    "If this is what it takes to defeat the Baron,\n" +
    "I will certainly continue, no matter the\n" +
    "costs !\n";

var BAD_4 =
    "I think I just escaped a mutiny there...\n" +
    "Maybe these bastards do not want to be\n" +
    "part of this journey anymore.\n" +
    "No problem guys, I still have weapons\n" +
    "to buy !";

var BAD_5 =
    "This system is to bow to me supremacy.\n" +
    "After those weak planets I shall destroy this\n" +
    "so called Baron.\n" +
    "Prepare yourself Baron, you are in\n" +
    "for a challenge !";

var BAD_6 =
    "Ah... Finally...\n" +
    "This system is mine, minions, admire your\n" +
    "new Supreme Leader !\n" +
    "Slaves, kneel before me, your life is now\n" +
    "mine !\n" +
    "My ascension will be told for centuries as I\n" +
    "now own these worlds !\n";

var NEUTRAL_1 =
    "This planet wasn't a tough one and I\n" +
    "already feel like this is the toughest\n" +
    "affair I've taken part in.\n\n" +
    "Gotta make a decision here on the way\n" +
    "to go next.";

var NEUTRAL_2 =
    "Still not sure about what I'm gonna do here.\n" +
    "I'm gonna keep it this way for the moment\n" +
    "and when things will blow...\n" +
    "Well, we're not there yet !";

var NEUTRAL_3 =
    "Those men I sold have done better than any\n" +
    "other still here, we will remember them\n" +
    "as the good men they are.\n" +
    "Anyway, this mission is having me do bad\n" +
    "things. Hope it'll turn to be for\n" +
    "the best.";

var NEUTRAL_4 =
    "I wanna see this journey over already\n" +
    "this Baron bastard is playing with me!\n\n" +
    "I've lost a lot of good men for this,\n" +
    "done a lot of bad things...\n";

var NEUTRAL_5 =
    "I've never been this close to this\n" +
    "Baron bastard...\n\n" +
    "I'm gonna make him pay for all the\n" +
    "sacrifices my boys had to do !\n";

var NEUTRAL_6 =
    "The Baron is down, and now all the men\n" +
    "in the system are free.\n" +
    "I take my responsabilities for the good men\n" +
    "I had to leave behind, and I'll make sure\n" +
    "we never forget 'em.\n" +
    "Now I'm gonna leave and hell...\n" +
    "It's 'bout time.";

var GOOD_3 =
    "We made it !\n" +
    "I sure could not sell any members for\n" +
    "anything. These men lives are worth\n" +
    "a hundred vessels.\n" +
    "I am glad we do not need it anyway...\n";

var GOOD_4 =
    "They say the strength of a captain\n" +
    "is his ship...\n" +
    "They are all wrong !\n" +
    "A captain's strength comes from\n" +
    "his men and crew.\n" +
    "Go forth lads ! Freedom awaits !";

var GOOD_5 =
    "Only the Baron is left...\n" +
    "And it is already like hell\n" +
    "out there...\n" +
    "Hear this, people of the system !\n" +
    "We will free you from slavery !\n" +
    "It was a long path but I can\n" +
    "feel the end is near !";

var GOOD_6 =
    "At last, the system is released from\n" +
    "evil. And all those men will finally\n" +
    "see their homes again.\n" +
    "I am proud of what we have\n" +
    "accomplished here.\n" +
    "I hope everything will be alright...\n" +
    "Until next time !";

var GOOD_GAME_OVER =
    "I have lost too many boys here...\n" +
    "This seems to be the end for us.\n" +
    "I am sorry lads...\n" +
    "I should have sacrificed some of you\n" +
    "to save the others...\n";

var BAD_GAME_OVER =
    "This power... is not enough...\n" +
    "I am too weak to maneuver this ship alone.\n" +
    "I should have kept a few souls to assist\n" +
    "me.\n" +
    "Very well, you win here Baron...\n" +
    "For this time...\n";

var NEUTRAL_GAME_OVER =
    "I've lost too many men here, and the ship\n" +
    "burns to hell.\n" +
    "Maybe next time I'll be less uncertain in\n" +
    "my choices...\n" +
    "Here I come lads, see you on the other side.\n";


function getLog(progress) {
    var message = "LOG - DAY " + progress.day + " :\n";

    if (progress.day == 1) {
        // Initial message
        message += INITIAL_MESSAGE;
    } else if (progress.firstShopVisit[0] && !progress.firstShopVisit[1]) {
        // First shop visit
        progress.firstShopVisit[1] = true;
        message += progress.boughtSomething ? FIRST_SHOP_2 : FIRST_SHOP_1;
    } else if (!progress.crew) {
        switch (progress.orientation) {
            case Orientations.NEUTRAL:
                message += NEUTRAL_GAME_OVER;
                break;
            case Orientations.GOOD:
                message += GOOD_GAME_OVER;
                break;
            case Orientations.BAD:
                message += BAD_GAME_OVER;
                break;
        }
    } else if (progress.visited[2]) {
        switch (progress.orientation) {
            case Orientations.NEUTRAL:
                message += NEUTRAL_6;
                break;
            case Orientations.GOOD:
                message += GOOD_6;
                break;
            case Orientations.BAD:
                message += BAD_6;
                break;
        }
        progress.ended = true;
    } else if (progress.countVisited() == 1) {
        message += NEUTRAL_1;
    } else if (progress.countVisited() == 2) {
        message += NEUTRAL_2;
    } else if (progress.countVisited() == 3) {
        switch (progress.orientation) {
            case Orientations.NEUTRAL:
                message += NEUTRAL_3;
                break;
            case Orientations.GOOD:
                message += GOOD_3;
                break;
            case Orientations.BAD:
                message += BAD_3;
                break;
        }
    } else if (progress.countVisited() == 4) {
        switch (progress.orientation) {
            case Orientations.NEUTRAL:
                message += NEUTRAL_4;
                break;
            case Orientations.GOOD:
                message += GOOD_4;
                break;
            case Orientations.BAD:
                message += BAD_4;
                break;
        }
    } else if (progress.countVisited() == 5) {
        switch (progress.orientation) {
            case Orientations.NEUTRAL:
                message += NEUTRAL_5;
                break;
            case Orientations.GOOD:
                message += GOOD_5;
                break;
            case Orientations.BAD:
                message += BAD_5;
                break;
        }
    }

    progress.day++;
    progress.textDisplayed[progress.lastVisited] = true;
    return message;
}