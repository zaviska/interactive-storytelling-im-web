
export class Decision {
    constructor(answers) {
        this.answers = answers;
    }

    render() {
        let html =  '<div class="entscheidung">' +
            '<ul>';
        for(let answerIndex in this.answers) {
            let answer = this.answers[answerIndex];
            html +=  '<li><a href="#" onclick="'+answer.getCallBack()+'()">'+answer.getText()+'</a></li>';
        }
        html +=   '</ul>' +
        '</div>';
        return html;
    }
}