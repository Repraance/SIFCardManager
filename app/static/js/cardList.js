var currentCardList = new Array();

function initCardList() {
    for (var i = 0; i < unit.length; i++) {
        let card = new Object();
        card.unit_number = unit[i].unit_number;
    }
}

function prefix0(num) {
    let numStr = '0000' + num;
    return numStr.substring(numStr.length - 4);
}

function updateCardList(obj) {
    var cardMuse = document.getElementById('cardMuse').checked;
    var cardPrintemps = document.getElementById('cardPrintemps').checked;
    var cardlilywhite = document.getElementById('cardlilywhite').checked;
    var cardBiBi = document.getElementById('cardBiBi').checked;

    var cardHonoka = document.getElementById('cardHonoka').checked;
    var cardEli = document.getElementById('cardEli').checked;
    var cardKotori = document.getElementById('cardKotori').checked;
    var cardUmi = document.getElementById('cardUmi').checked;
    var cardRin = document.getElementById('cardRin').checked;
    var cardMaki = document.getElementById('cardMaki').checked;
    var cardNozomi = document.getElementById('cardNozomi').checked;
    var cardHanayo = document.getElementById('cardHanayo').checked;
    var cardNico = document.getElementById('cardNico').checked;

    var cardAqours = document.getElementById('cardAqours').checked;
    var cardCYaRon = document.getElementById('cardCYaRon').checked;
    var cardAZALEA = document.getElementById('cardAZALEA').checked;
    var cardGuiltyKiss = document.getElementById('cardGuiltyKiss').checked;

    var cardChika = document.getElementById('cardChika').checked;
    var cardRiko = document.getElementById('cardRiko').checked;
    var cardKanan = document.getElementById('cardKanan').checked;
    var cardDia = document.getElementById('cardDia').checked;
    var cardYou = document.getElementById('cardYou').checked;
    var cardYoshiko = document.getElementById('cardYoshiko').checked;
    var cardHanamaru = document.getElementById('cardHanamaru').checked;
    var cardMari = document.getElementById('cardMari').checked;
    var cardRuby = document.getElementById('cardRuby').checked;

    var cardSmile = document.getElementById('cardSmile').checked;
    var cardPure = document.getElementById('cardPure').checked;
    var cardCool = document.getElementById('cardCool').checked;

    var cardList = $('#cardList');
    cardList.empty();
    for (var i = 0; i < unit.length; i++) {
        let currentCard = unit[i];
        switch (currentCard.attribute_id) {
            case 1:
                if (!cardSmile)
                    continue;
                break;
            case 2:
                if (!cardPure)
                    continue;
                break;
            case 3:
                if (!cardCool)
                    continue;
                break;
            case 5:
                continue;
                break;
            default:
                break;
        }
        let cardText = prefix0(currentCard.unit_number) + ' ' + rarityIndex[currentCard.rarity] + ' ' + currentCard.name;
        if (currentCard.eponym)
            cardText += ' [' + currentCard.eponym + ']';

        let option = $('<option>').val(currentCard.unit_number).text(cardText);
        option.css('color', colorIndex[currentCard.attribute_id]);

        cardList.append(option);
    }


}

function alertStatus(obj) {
    alert(obj.checked);
}