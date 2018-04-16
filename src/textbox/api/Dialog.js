export class Dialog {
    constructor(text, person) {
        this.text = text;
        this.person = person;
    }

    render() {
        return '<div class="dialog">' +
                    '<div class="picture '+this.person.getCode()+'"></div>' +
                    '<div>'+
                        '<h3 class="dialog_name">'+this.person.getName()+'</h3>' +
                        '<p class="dialog_text">'+this.text+'</p>' +
                    '</div>'+
                '</div>';
    }
}