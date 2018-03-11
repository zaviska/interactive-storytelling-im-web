
export class Dialog {
    constructor(text, person) {
        this.text = text;
        this.person = person;
    }

    render() {
        return '<div class="gespraech">' +
                    '<div class="picture '+this.person.getCode()+'">'+this.person.getName()+'</div>' +
                    '<p>'+this.text+'</p>' +
                '</div>';
    }
}