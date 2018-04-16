export class Answer {
    constructor(text, callBack) {
        this.text = text;
        this.callBack = callBack;
    }

    getText() {
        return this.text;
    }

    getCallBack() {
        return this.callBack;
    }

}