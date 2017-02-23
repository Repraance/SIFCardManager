var cardList;
var currentCardList;

function updateCardList() {
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
}

function alertStatus(obj) {
    alert(obj.checked);
}