class Progress {

    constructor() {
        this.day = 1;
        this.crew = 10;
        this.damage = 1;
        this.tears = 30;
        this.visited = [false, false, false, false, false, false];
        this.resume = false;
        this.firstShopVisit = [false, false];
        this.boughtSomething = false;

        this.nextMessage;
    }

}