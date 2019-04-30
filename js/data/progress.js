var Orientations = {
    NEUTRAL: 1,
    BAD: 2,
    GOOD: 3,
};

class Progress {

    constructor() {
        this.day = 1;
        this.crew = 10;
        this.stats = [300, 1, 30, 1];
        this.statsLevel = [0, 0, 0, 0];
        this.visited = [false, false, false, false, false, false];
        this.textDisplayed = [false, false, false, false, false, false];
        this.lastVisited = -1;
        this.resume = false;
        this.firstShopVisit = [false, false];
        this.shopDiary = false;
        this.boughtSomething = false;
        this.orientation = Orientations.NEUTRAL;
        this.nextMessage;
        this.ended = false;
        this.releasedSlaves = false;
    }

    countVisited() {
        var v = 0;
        for (let i = 0; i < this.visited.length; i++) {
            if (this.visited[i]) {
                v += 1;
            }
        }
        return v;
    }

    countUpgrades() {
        var v = 0;
        for (let i = 0; i < this.statsLevel.length; i++) {
            v += this.statsLevel[i];
        }
        return v;
    }

    upgradeCost(i) {
        switch (i) {
            case 0:
                return 2;
            case 1:
                return 4;
            case 2:
                return 7;
            case 3:
                return -1;
        }
    }

    downgradeCost(i) {
        switch (i) {
            case 0:
                return -1;
            case 1:
                return 1;
            case 2:
                return 3;
            case 3:
                return 6;
        }
    }

    updateStats() {
        switch (this.statsLevel[0]) {
            case 0:
                this.stats[0] = 150
                break;
            case 1:
                this.stats[0] = 250
                break;
            case 2:
                this.stats[0] = 350
                break;
            case 3:
                this.stats[0] = 450
                break;
        }
        switch (this.statsLevel[1]) {
            case 0:
                this.stats[1] = 1
                break;
            case 1:
                this.stats[1] = 3
                break;
            case 2:
                this.stats[1] = 5
                break;
            case 3:
                this.stats[1] = 8
                break;
        }
        switch (this.statsLevel[2]) {
            case 0:
                this.stats[2] = 40
                break;
            case 1:
                this.stats[2] = 32
                break;
            case 2:
                this.stats[2] = 25
                break;
            case 3:
                this.stats[2] = 20
                break;
        }
        switch (this.statsLevel[3]) {
            case 0:
                this.stats[3] = 1
                break;
            case 1:
                this.stats[3] = 2
                break;
            case 2:
                this.stats[3] = 3
                break;
            case 3:
                this.stats[3] = 4
                break;
        }
    }

}