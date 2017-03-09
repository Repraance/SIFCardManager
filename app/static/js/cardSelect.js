var currentMemberIndex;
var currentCardInfo;
var currentCardRankUp;
var currentCardSkillLv;

function prefix0(num) {
    let numStr = '0000' + num;
    return numStr.substring(numStr.length - 4);
}

function openCardSelectModal(obj) {
    currentMemberIndex = parseInt(obj.id.slice(-1));
    $('#cardListModal').modal('toggle');
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

    //var cardList = $('#cardList');
    var cardList = document.getElementById("card-list");
    var selectCard = cardList.options[cardList.selectedIndex];
    if (selectCard !== undefined) {
        var selectCardText = cardList.options[cardList.selectedIndex].text;
        var selectCardId = cardList.options[cardList.selectedIndex].value;
        var selectCardColor = cardList.options[cardList.selectedIndex].style.color;
    }
    cardList.options.length = 0;


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

        cardList.options.add(new Option(cardText, currentCard.unit_number));
        cardList[cardList.options.length - 1].style.color = colorIndex[currentCard.attribute_id];

        if (selectCardId == currentCard.unit_number) {
            cardList[cardList.options.length - 1].selected = true;
            cardList[cardList.options.length - 1]
        }
    }
    changeCardSelect();
}

function changeCardSelect() {
    var cardList = document.getElementById('card-list');
    var cardListAvatar = document.getElementById('avatar-card-list');
    var selectedCard = cardList.options[cardList.selectedIndex];

    var smile = 'N/A',
        pure = 'N/A',
        cool = 'N/A',
        centerSkill = 'N/A',
        centerSkillDescription = 'N/A',
        skillDescription = 'N/A';

    var cardListSmile = document.getElementById('smile-card-list');
    var cardListPure = document.getElementById('pure-card-list');
    var cardListCool = document.getElementById('cool-card-list');
    var cardListCenterSkill = document.getElementById('center-skill-card-list');
    var cardListCenterSkillDescription = document.getElementById('center-skill-description-card-list');
    var cardListSkillDescription = document.getElementById('skill-description-card-list');

    currentCardSkillLv = document.getElementById('skill-lv-card-list').value;

    var avatarURL = 'static/image/placeHolder.png';

    if (selectedCard != undefined) {
        var selectCardId = parseInt(selectedCard.text.slice(0, 4), 10);
        cardList.style.color = selectedCard.style.color;
        currentCardRankUp = document.getElementById('cardRankUp').checked;
        avatarURL = 'static/image/card/icon/'

        // Find current card
        for (let i = 0; i < unit.length; i++) {
            if (selectCardId == unit[i].unit_number) {
                currentCardInfo = unit[i];
                break;
            }
        }

        if (currentCardRankUp) {
            smile = currentCardInfo.smile_max;
            pure = currentCardInfo.pure_max;
            cool = currentCardInfo.cool_max;
            avatarURL += 'rankup/' + String(selectCardId) + '.png';

        } else {
            smile = currentCardInfo.smile;
            pure = currentCardInfo.pure;
            cool = currentCardInfo.cool;
            avatarURL += 'normal/' + String(selectCardId) + '.png';
        }

        if (currentCardInfo.leader_skill_info) {
            centerSkill = currentCardInfo.leader_skill_info.name;
            centerSkillDescription = currentCardInfo.leader_skill_info.description;
        }

        if (currentCardInfo.skill_info) {
            var s1 = currentCardInfo.skill_info[currentCardSkillLv - 1].trigger_value;
            var s2 = currentCardInfo.skill_info[currentCardSkillLv - 1].activation_rate;
            var s3 = currentCardInfo.skill_info[currentCardSkillLv - 1].effect_value ? Number(currentCardInfo.skill_info[currentCardSkillLv - 1].effect_value) : Number(currentCardInfo.skill_info[currentCardSkillLv - 1].discharge_time);
            skillDescription = currentCardInfo.skill_info[0].description.replace(/\d+(\D+)\d+(\D+)\d*\.*\d*/, String(s1) + '$1' + String(s2) + '$2' + String(s3));
        }
    } else {
        //cardListAvatar.src = 'static/image/placeHolder.png';
        currentCardInfo = null;
    }
    cardListSmile.innerHTML = smile;
    cardListPure.innerHTML = pure;
    cardListCool.innerHTML = cool;
    cardListCenterSkill.innerHTML = centerSkill;
    cardListCenterSkillDescription.innerHTML = centerSkillDescription;
    cardListSkillDescription.innerHTML = skillDescription
    cardListAvatar.src = avatarURL;

}

function changeSkillLv(obj) {
    currentCardSkillLv = obj.value;
    var cardListSkillDescription = document.getElementById('skill-description-card-list');
    if (currentCardInfo) {
        if (currentCardInfo.skill_info) {
            var s1 = currentCardInfo.skill_info[currentCardSkillLv - 1].trigger_value;
            var s2 = currentCardInfo.skill_info[currentCardSkillLv - 1].activation_rate;
            var s3 = currentCardInfo.skill_info[currentCardSkillLv - 1].effect_value ? Number(currentCardInfo.skill_info[currentCardSkillLv - 1].effect_value) : Number(currentCardInfo.skill_info[currentCardSkillLv - 1].discharge_time);
            var skillDescription = currentCardInfo.skill_info[0].description.replace(/\d+(\D+)\d+(\D+)\d+\.*\d*/, String(s1) + '$1' + String(s2) + '$2' + String(s3));
            cardListSkillDescription.innerHTML = skillDescription;
        }
    }
}

function saveCard() {
    if (currentCardInfo) {
        var currentMember = teamInfo[currentMemberIndex];
        currentMember.originalCardInfo = currentCardInfo;
        currentMember.cardid = currentCardInfo.unit_number;
        currentMember.attribute_id = currentCardInfo.attribute_id;
        currentMember.attribute = attributeIndex[currentMember.attribute_id];
        currentMember.skilllevel = currentCardSkillLv;
        if (currentCardRankUp) {
            currentMember.mezame = 1;
            currentMember.smile = currentCardInfo.smile_max;
            currentMember.pure = currentCardInfo.pure_max;
            currentMember.cool = currentCardInfo.cool_max;
            currentMember[currentMember.attribute] += currentCardInfo.after_love_max;
        } else {
            currentMember.mezame = 0;
            currentMember.smile = currentCardInfo.smile;
            currentMember.pure = currentCardInfo.pure;
            currentMember.cool = currentCardInfo.cool;
            currentMember[currentMember.attribute] += currentCardInfo.before_love_max;
        }
        fillMemberInfo(currentMemberIndex, currentMember);
    }
    $('#cardListModal').modal('toggle');
}



function fillMemberInfo(memberIndex, memberInfo) {

    var avatarURL = 'static/image/card/icon/';
    if (memberInfo.mezame) {
        avatarURL += 'rankup/' + String(memberInfo.cardid) + '.png';
        document.getElementById('rankup-' + String(memberIndex)).checked = true;
    } else {
        avatarURL += 'normal/' + String(memberInfo.cardid) + '.png';
        document.getElementById('rankup-' + String(memberIndex)).checked = false;
    }
    $('#smile-value input').eq(memberIndex).val(memberInfo.smile);
    $('#pure-value input').eq(memberIndex).val(memberInfo.pure);
    $('#cool-value input').eq(memberIndex).val(memberInfo.cool);
    $('#skill-lv input').eq(memberIndex).val(memberInfo.skilllevel);
    $('#avatar img').eq(memberIndex).attr('src', avatarURL);
    $('#fixed-value select').eq(memberIndex).val(memberInfo.gemnum);
    $('#single-percent select').eq(memberIndex).val(memberInfo.gemsinglepercent);
    $('#total-percent select').eq(memberIndex).val(memberInfo.gemallpercent);
    if (memberInfo.gemskill)
        document.getElementById('charm-heal-' + String(memberIndex)).checked = true;
    else
        document.getElementById('charm-heal-' + String(memberIndex)).checked = false;
    if (memberInfo.gemacc)
        document.getElementById('trick-' + String(memberIndex)).checked = true;
    else
        document.getElementById('trick-' + String(memberIndex)).checked = false;


    if (memberIndex == 4) {
        $('.tda').text(memberInfo.attribute);
        switch (memberInfo.attribute_id) {
            case 1:
                $('#guestSmile').next().children().text('Smile 9% up');
                $('#guestPure').next().children().text('Pure 12% up');
                $('#guestCool').next().children().text('Cool 12% up');
                break;
            case 2:
                $('#guestSmile').next().children().text('Smile 12% up');
                $('#guestPure').next().children().text('Pure 9% up');
                $('#guestCool').next().children().text('Cool 12% up');
                break;
            case 3:
                $('#guestSmile').next().children().text('Smile 12% up');
                $('#guestPure').next().children().text('Pure 12% up');
                $('#guestCool').next().children().text('Cool 9% up');
                break;
            default:
                break;
        }
    }
}

function changeMemberRankup(obj) {
    var rankup = obj.checked;
    var index = Number(obj.id.slice(-1));
    var currentMember = teamInfo[index];
    // If current member is set
    if (currentMember.cardid) {
        if (rankup) {
            currentMember.mezame = 1;
            currentMember.smile = currentMember.originalCardInfo.smile_max;
            currentMember.pure = currentMember.originalCardInfo.pure_max;
            currentMember.cool = currentMember.originalCardInfo.cool_max;
            currentMember[currentMember.attribute] += currentMember.originalCardInfo.after_love_max;
        } else {
            currentMember.mezame = 0;
            currentMember.smile = currentMember.originalCardInfo.smile;
            currentMember.pure = currentMember.originalCardInfo.pure;
            currentMember.cool = currentMember.originalCardInfo.cool;
            currentMember[currentMember.attribute] += currentMember.originalCardInfo.before_love_max;
        }
        fillMemberInfo(index, currentMember);
    }
}

function changeMemberSchoolIdolSkill(obj) {
    var index = $('.team-list select').index($(obj));
    if (index != -1) {
        switch (parseInt(index / 9)) {
            case 0:
                teamInfo[index % 9].gemnum = Number($(obj).val());
                break;
            case 1:
                teamInfo[index % 9].gemsinglepercent = Number($(obj).val());
                break;
            case 2:
                teamInfo[index % 9].gemallpercent = Number($(obj).val());
                break;
        }
        changeSlots(index % 9);
        // Charm, Teal and Trick
    } else {
        var id = obj.id;
        var equipped = obj.checked;
        var index = Number(id.slice(-1));
        if (id[0] == 'c')
            teamInfo[index].gemskill = equipped ? 1 : 0;
        else
            teamInfo[index].gemacc = equipped ? 1 : 0;
        changeSlots(index);
    }
}

function changeSlots(memberIndex) {
    member = teamInfo[memberIndex];
    member.slot = 0;
    switch (member.gemnum) {
        case 0:
            break;
        case 200:
            member.slot += 1;
            break;
        case 450:
            member.slot += 2;
            break;
        case 650:
            member.slot += 3;
            break;
    }
    switch (member.gemsinglepercent) {
        case 0:
            break;
        case 0.1:
            member.slot += 2;
            break;
        case 0.16:
            member.slot += 3;
            break;
        case 0.26:
            member.slot += 5;
            break;
    }
    switch (member.gemallpercent) {
        case 0:
            break;
        case 0.018:
            member.slot += 3;
            break;
        case 0.024:
            member.slot += 4;
            break;
        case 0.042:
            member.slot += 7;
            break;
    }
    if (member.gemskill)
        member.slot += 4;
    if (member.gemacc)
        member.slot += 4;
    $('#slots input').eq(memberIndex).val(member.slot);
}

function changeMemberSkillLv(obj) {
    var index = Number($('#skill-lv input').index($(obj)));
    teamInfo[index].skilllevel = Number($(obj).val());
}