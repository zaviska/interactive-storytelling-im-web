
export class Text {
    constructor(text) {
        this.text = text;
    }

    render() {
        return '<div class="erzahler">'+this.text+'</div>';
    }
}