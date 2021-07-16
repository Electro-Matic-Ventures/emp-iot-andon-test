class button{

    static buttonOn = "rgb(255, 0, 0)";
    static buttonOff = "rgb(100, 100, 100)";

    constructor(thisButton){
        this.color = this.getButtonColor(thisButton);
        this.id = thisButton.id;
        this.address = this.generateAddress(this.id);
    }

    generateAddress(id){
        return "00" + id.substr(id.length - 2);
    }

    get address(){
        return this.address;
    }

    getButtonColor(thisButton){
        return getComputedStyle(thisButton)["background-color"];
    }

    get color () {
        return this.color;
    }

}