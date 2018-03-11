import { Text } from './api/Text';
import { Dialog } from './api/Dialog';
import { Decision } from './api/Decision';
import { Person } from './api/Person';
import { Answer } from './api/Answer';

export class TextBoxController {
    constructor() {
        this.textList = [];
    }
    addText(text) {
        this.textList.push(text);
        this.renderText();
    }
    renderText() {
        let textBoxHtml = "";
        for(let textIndex in this.textList) {
            let text = this.textList[textIndex];
            textBoxHtml += text.render();
        }
        document.getElementById('textbox').innerHTML = textBoxHtml;
    }
}