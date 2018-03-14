export class Decision {
    constructor(answers) {
        this.answers = answers;
    }

    render() {
        let html =  '<div class="decision">' +
            '<ul class="decision_list">';
        for(let answerIndex in this.answers) {
            let answer = this.answers[answerIndex];
            html +=  '<li class="decision_list_item"><a class="decision_button" href="#" onclick="'+answer.getCallBack()+'()">'+answer.getText()+'</a></li>';
        }
        html +=   '</ul>' +
        '</div>';
        return html;
    }
}