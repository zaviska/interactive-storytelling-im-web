
export default class Sprechblase{

    constructor(game, x, y, displayText) {
        let text = game.add.text(x, y, displayText);
        text.anchor.set(0.5);
        text.align = 'center';
    
        text.font = 'Arial Black';
        text.fontSize = 70;
        text.fontWeight = 'bold';
        text.fill = '#ec008c';

    }
  
    update() {
      
    }
  
  }
  