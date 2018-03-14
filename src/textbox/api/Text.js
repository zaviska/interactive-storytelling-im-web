
export class Text {
    constructor(text) {
        this.text = text;
    }

    render() {
        return '<div class="storyteller">'+this.text+'</div>';
    }
}