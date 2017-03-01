var currentCardId;
var currentTeamIndex;

function prefix0(num) {
    let numStr = '0000' + num;
    return numStr.substring(numStr.length - 4);
}

function updateCardListFilter(obj) {
    var cardMuse, cardPrintemps, cardlilywhite, cardBiBi;
    var cardHonoka, cardEli, cardKotori, cardUmi, cardRin, cardMaki, cardNozomi, cardHanayo, cardNico;

    var cardAqours, cardCYaRon, cardAZALEA, cardGuiltyKiss;
    var cardChika, cardRiko, cardKanan, cardDia, cardYou, cardYoshiko, cardHanamaru, cardMari, cardRuby;

    if (obj == document.getElementById('cardMuse')) {
        if (obj.checked) {
            document.getElementById('cardPrintemps').checked = true;
            document.getElementById('cardlilywhite').checked = true;
            document.getElementById('cardBiBi').checked = true;
            document.getElementById('cardHonoka').checked = true;
            document.getElementById('cardEli').checked = true;
            document.getElementById('cardKotori').checked = true;
            document.getElementById('cardUmi').checked = true;
            document.getElementById('cardRin').checked = true;
            document.getElementById('cardMaki').checked = true;
            document.getElementById('cardPrintemps').checked = true;
            document.getElementById('cardNozomi').checked = true;
            document.getElementById('cardHanayo').checked = true;
            document.getElementById('cardNico').checked = true;
        } else {
            document.getElementById('cardPrintemps').checked = false;
            document.getElementById('cardlilywhite').checked = false;
            document.getElementById('cardBiBi').checked = false;
            document.getElementById('cardHonoka').checked = false;
            document.getElementById('cardEli').checked = false;
            document.getElementById('cardKotori').checked = false;
            document.getElementById('cardUmi').checked = false;
            document.getElementById('cardRin').checked = false;
            document.getElementById('cardMaki').checked = false;
            document.getElementById('cardPrintemps').checked = false;
            document.getElementById('cardNozomi').checked = false;
            document.getElementById('cardHanayo').checked = false;
            document.getElementById('cardNico').checked = false;
        }
    } else if (obj == document.getElementById('cardPrintemps')) {
        let cardlilywhite = document.getElementById('cardlilywhite');
        if (obj.checked) {
            document.getElementById('cardHonoka').checked = true;
            document.getElementById('cardKotori').checked = true;
            document.getElementById('cardHanayo').checked = true;
        } else {
            document.getElementById('cardHonoka').checked = false;
            document.getElementById('cardKotori').checked = false;
            document.getElementById('cardHanayo').checked = false;
            document.getElementById('cardMuse').checked = false;
        }
    } else if (obj == document.getElementById('cardlilywhite')) {
        if (obj.checked) {
            document.getElementById('cardUmi').checked = true;
            document.getElementById('cardRin').checked = true;
            document.getElementById('cardNozomi').checked = true;
        } else {
            document.getElementById('cardUmi').checked = false;
            document.getElementById('cardRin').checked = false;
            document.getElementById('cardNozomi').checked = false;
            document.getElementById('cardMuse').checked = false;
        }
    } else if (obj == document.getElementById('cardBiBi')) {
        if (obj.checked) {
            document.getElementById('cardEli').checked = true;
            document.getElementById('cardMaki').checked = true;
            document.getElementById('cardNico').checked = true;
        } else {
            document.getElementById('cardEli').checked = false;
            document.getElementById('cardMaki').checked = false;
            document.getElementById('cardNico').checked = false;
            document.getElementById('cardMuse').checked = false;
        }
    } else if (obj == document.getElementById('cardAqours')) {
        if (obj.checked) {
            document.getElementById('cardCYaRon').checked = true;
            document.getElementById('cardAZALEA').checked = true;
            document.getElementById('cardGuiltyKiss').checked = true;
            document.getElementById('cardChika').checked = true;
            document.getElementById('cardRiko').checked = true;
            document.getElementById('cardKanan').checked = true;
            document.getElementById('cardDia').checked = true;
            document.getElementById('cardYou').checked = true;
            document.getElementById('cardYoshiko').checked = true;
            document.getElementById('cardHanamaru').checked = true;
            document.getElementById('cardMari').checked = true;
            document.getElementById('cardRuby').checked = true;
        } else {
            document.getElementById('cardCYaRon').checked = false;
            document.getElementById('cardAZALEA').checked = false;
            document.getElementById('cardGuiltyKiss').checked = false;
            document.getElementById('cardChika').checked = false;
            document.getElementById('cardRiko').checked = false;
            document.getElementById('cardKanan').checked = false;
            document.getElementById('cardDia').checked = false;
            document.getElementById('cardYou').checked = false;
            document.getElementById('cardYoshiko').checked = false;
            document.getElementById('cardHanamaru').checked = false;
            document.getElementById('cardMari').checked = false;
            document.getElementById('cardRuby').checked = false;
        }
    } else if (obj == document.getElementById('cardCYaRon')) {
        let cardlilywhite = document.getElementById('cardlilywhite');
        if (obj.checked) {
            document.getElementById('cardChika').checked = true;
            document.getElementById('cardYou').checked = true;
            document.getElementById('cardRuby').checked = true;
        } else {
            document.getElementById('cardChika').checked = false;
            document.getElementById('cardYou').checked = false;
            document.getElementById('cardRuby').checked = false;
            document.getElementById('cardAqours').checked = false;
        }
    } else if (obj == document.getElementById('cardAZALEA')) {
        if (obj.checked) {
            document.getElementById('cardKanan').checked = true;
            document.getElementById('cardDia').checked = true;
            document.getElementById('cardHanamaru').checked = true;
        } else {
            document.getElementById('cardKanan').checked = false;
            document.getElementById('cardDia').checked = false;
            document.getElementById('cardHanamaru').checked = false;
            document.getElementById('cardAqours').checked = false;
        }
    } else if (obj == document.getElementById('cardGuiltyKiss')) {
        if (obj.checked) {
            document.getElementById('cardRiko').checked = true;
            document.getElementById('cardYoshiko').checked = true;
            document.getElementById('cardMari').checked = true;
        } else {
            document.getElementById('cardRiko').checked = false;
            document.getElementById('cardYoshiko').checked = false;
            document.getElementById('cardMari').checked = false;
            document.getElementById('cardAqours').checked = false;
        }
    } else if (obj == document.getElementById('card1stYear')) {
        if (obj.checked) {
            document.getElementById('cardRin').checked = true;
            document.getElementById('cardMaki').checked = true;
            document.getElementById('cardHanayo').checked = true;
            document.getElementById('cardYoshiko').checked = true;
            document.getElementById('cardHanamaru').checked = true;
            document.getElementById('cardRuby').checked = true;
        } else {
            document.getElementById('cardRin').checked = false;
            document.getElementById('cardMaki').checked = false;
            document.getElementById('cardHanayo').checked = false;
            document.getElementById('cardYoshiko').checked = false;
            document.getElementById('cardHanamaru').checked = false;
            document.getElementById('cardRuby').checked = false;
        }
    } else if (obj == document.getElementById('card2ndYear')) {
        if (obj.checked) {
            document.getElementById('cardHonoka').checked = true;
            document.getElementById('cardKotori').checked = true;
            document.getElementById('cardUmi').checked = true;
            document.getElementById('cardChika').checked = true;
            document.getElementById('cardRiko').checked = true;
            document.getElementById('cardYou').checked = true;
        } else {
            document.getElementById('cardHonoka').checked = false;
            document.getElementById('cardKotori').checked = false;
            document.getElementById('cardUmi').checked = false;
            document.getElementById('cardChika').checked = false;
            document.getElementById('cardRiko').checked = false;
            document.getElementById('cardYou').checked = false;
        }
    } else if (obj == document.getElementById('card3rdYear')) {
        if (obj.checked) {
            document.getElementById('cardEli').checked = true;
            document.getElementById('cardNozomi').checked = true;
            document.getElementById('cardNico').checked = true;
            document.getElementById('cardKanan').checked = true;
            document.getElementById('cardDia').checked = true;
            document.getElementById('cardMari').checked = true;
        } else {
            document.getElementById('cardEli').checked = false;
            document.getElementById('cardNozomi').checked = false;
            document.getElementById('cardNico').checked = false;
            document.getElementById('cardKanan').checked = false;
            document.getElementById('cardDia').checked = false;
            document.getElementById('cardMari').checked = false;
        }
    }
    cardHonoka = document.getElementById('cardHonoka').checked;
    cardEli = document.getElementById('cardEli').checked;
    cardKotori = document.getElementById('cardKotori').checked;
    cardUmi = document.getElementById('cardUmi').checked;
    cardRin = document.getElementById('cardRin').checked;
    cardMaki = document.getElementById('cardMaki').checked;
    cardNozomi = document.getElementById('cardNozomi').checked;
    cardHanayo = document.getElementById('cardHanayo').checked;
    cardNico = document.getElementById('cardNico').checked;

    cardChika = document.getElementById('cardChika').checked;
    cardRiko = document.getElementById('cardRiko').checked;
    cardKanan = document.getElementById('cardKanan').checked;
    cardDia = document.getElementById('cardDia').checked;
    cardYou = document.getElementById('cardYou').checked;
    cardYoshiko = document.getElementById('cardYoshiko').checked;
    cardHanamaru = document.getElementById('cardHanamaru').checked;
    cardMari = document.getElementById('cardMari').checked;
    cardRuby = document.getElementById('cardRuby').checked;

    if (cardHonoka && cardKotori && cardHanayo)
        document.getElementById('cardPrintemps').checked = true;
    else
        document.getElementById('cardPrintemps').checked = false;

    if (cardUmi && cardRin && cardNozomi)
        document.getElementById('cardlilywhite').checked = true;
    else
        document.getElementById('cardlilywhite').checked = false;

    if (cardEli && cardMaki && cardNico)
        document.getElementById('cardBiBi').checked = true;
    else
        document.getElementById('cardBiBi').checked = false;

    if (cardChika && cardYou && cardRuby)
        document.getElementById('cardCYaRon').checked = true;
    else
        document.getElementById('cardCYaRon').checked = false;

    if (cardKanan && cardDia && cardHanamaru)
        document.getElementById('cardAZALEA').checked = true;
    else
        document.getElementById('cardAZALEA').checked = false;

    if (cardRiko && cardYoshiko && cardMari)
        document.getElementById('cardGuiltyKiss').checked = true;
    else
        document.getElementById('cardGuiltyKiss').checked = false;

    if (cardRin && cardMaki && cardHanayo && cardYoshiko && cardHanamaru && cardRuby)
        document.getElementById('card1stYear').checked = true;
    else
        document.getElementById('card1stYear').checked = false;

    if (cardHonoka && cardKotori && cardUmi && cardChika && cardRiko && cardYou)
        document.getElementById('card2ndYear').checked = true;
    else
        document.getElementById('card2ndYear').checked = false;

    if (cardEli && cardNozomi && cardNico && cardKanan && cardDia && cardMari)
        document.getElementById('card3rdYear').checked = true;
    else
        document.getElementById('card3rdYear').checked = false;

    cardPrintemps = document.getElementById('cardPrintemps').checked;
    cardlilywhite = document.getElementById('cardlilywhite').checked;
    cardBiBi = document.getElementById('cardBiBi').checked;

    cardCYaRon = document.getElementById('cardCYaRon').checked;
    cardAZALEA = document.getElementById('cardAZALEA').checked;
    cardGuiltyKiss = document.getElementById('cardGuiltyKiss').checked;

    if (cardPrintemps && cardlilywhite && cardBiBi)
        document.getElementById('cardMuse').checked = true;
    else
        document.getElementById('cardMuse').checked = false;

    if (cardCYaRon && cardAZALEA && cardGuiltyKiss)
        document.getElementById('cardAqours').checked = true;
    else
        document.getElementById('cardAqours').checked = false;


    var cardSmile = document.getElementById('cardSmile').checked;
    var cardPure = document.getElementById('cardPure').checked;
    var cardCool = document.getElementById('cardCool').checked;

    var cardR = document.getElementById('cardR').checked;
    var cardSR = document.getElementById('cardSR').checked;
    var cardSSR = document.getElementById('cardSSR').checked;
    var cardUR = document.getElementById('cardUR').checked;

    var cardList = $('#cardList');
    cardList.empty();


    for (var i = 0; i < unit.length; i++) {
        let currentCard = unit[i];
        // Check attribute_id
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

        // Check rarity
        switch (currentCard.rarity) {
            case 1:
                continue;
                break;
            case 2:
                if (!cardR)
                    continue;
                break;
            case 3:
                if (!cardSR)
                    continue;
                break;
            case 4:
                if (!cardUR)
                    continue;
                break;
            case 5:
                if (!cardSSR)
                    continue;
                break;
            default:
                continue;
                break;
        }
        // Check name
        switch (currentCard.name) {
            case '高坂穂乃果':
                if (!cardHonoka)
                    continue;
                break;
            case '絢瀬絵里':
                if (!cardEli)
                    continue;
                break;
            case '南ことり':
                if (!cardKotori)
                    continue;
                break;
            case '園田海未':
                if (!cardUmi)
                    continue;
                break;
            case '星空凛':
                if (!cardRin)
                    continue;
                break;
            case '西木野真姫':
                if (!cardMaki)
                    continue;
                break;
            case '東條希':
                if (!cardNozomi)
                    continue;
                break;
            case '小泉花陽':
                if (!cardHanayo)
                    continue;
                break;
            case '矢澤にこ':
                if (!cardNico)
                    continue;
                break;
            case '高海千歌':
                if (!cardChika)
                    continue;
                break;
            case '桜内梨子':
                if (!cardRiko)
                    continue;
                break;
            case '松浦果南':
                if (!cardKanan)
                    continue;
                break;
            case '黒澤ダイヤ':
                if (!cardDia)
                    continue;
                break;
            case '渡辺曜':
                if (!cardYou)
                    continue;
                break;
            case '津島善子':
                if (!cardYoshiko)
                    continue;
                break;
            case '国木田花丸':
                if (!cardHanamaru)
                    continue;
                break;
            case '小原鞠莉':
                if (!cardMari)
                    continue;
                break;
            case '黒澤ルビィ':
                if (!cardRuby)
                    continue;
                break;
            default:
                continue;
                break;
        }

        let cardText = prefix0(currentCard.unit_number) + ' [' + rarityIndex[currentCard.rarity] + ']  ' + currentCard.name;

        if (currentCard.eponym)
            cardText += '『' + currentCard.eponym + '』';

        let option = $('<option>').val(currentCard.unit_number).html(cardText);
        option.css('color', colorIndex[currentCard.attribute_id]);

        cardList.append(option);

    }
    changeCardListColor();
}

function changeCardListColor() {
    var lives = document.getElementById('cardList');
    var selectedLive = lives.options[lives.selectedIndex];
    if (selectedLive != undefined) {
        lives.style.color = selectedLive.style.color;
    }
    var avatarURL = 'static/image/card/icon/normal/'
    var selectedLive = lives.options[lives.selectedIndex];
    var selectCardId = parseInt(selectedLive.text.slice(0, 4), 10);
    var avatarImg = document.createElement('img');
    avatarImg.src = avatarURL + String(selectCardId) + '.png';
    var cardListAvatar = document.getElementById('avatar-cardlist');
    cardListAvatar.innerHTML = '';
    cardListAvatar.appendChild(avatarImg);
}

function changeCardList(obj) {
    changeCardListColor();

}

function saveCard() {
    $('#cardListModal').modal('toggle');
}