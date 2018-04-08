export {default as Text } from './api/Text';
export {default as Dialog } from './api/Dialog';
export {default as Decision } from './api/Decision';
export {default as Person } from './api/Person';
export {default as Answer } from './api/Answer';

export class TextBoxController {
    constructor() {
        this.textList = [];
    }
    addText(text) {
        this.textList.push(text);
        this.renderText();
    }
    renderText() {
        let textBoxHtml = '';
        for(let textIndex = 0; textIndex < this.textList.length; textIndex++) {
            let text = this.textList[textIndex];
            let isLastElement = this.textList.length -1 === textIndex;
            textBoxHtml += text.render(isLastElement);
        }
        textBoxHtml += '<a class="navigation_link navigation_link-textbox" href="#" onclick="toggleTextbox()" id="zoomTextboxButton">Textfeld maximieren</a>';
        let $textbox = document.getElementById('textbox');
        $textbox.innerHTML = textBoxHtml;
        $textbox.scrollTop = $textbox.scrollHeight - $textbox.clientHeight;
    }
}