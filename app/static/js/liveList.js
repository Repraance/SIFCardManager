function initLiveList() {
    // Sort live by live_track_id and difficulty
    mapsJson = mapsJson.sort(function(x, y) {
        if (x.live_track_id !== y.live_track_id) {
            return x.live_track_id - y.live_track_id;
        } else {
            return x.difficulty - y.difficulty;
        }
    });
    // Generate liveList
    for (var i = 0; i < mapsJson.length; i++) {
        var currentLive = mapsJson[i];
        if (currentLive.difficulty === 5) {
            continue;
        }
        var liveTag = new Object();
        liveTag.name = currentLive.name;
        liveTag.attribute_icon_id = currentLive.attribute_icon_id;
        liveTag.member_category = currentLive.member_category;
        liveTag.difficulty_text = currentLive.difficulty_text;
        liveTag.live_setting_id = currentLive.live_setting_id;
        liveTag.s_rank_combo = currentLive.s_rank_combo;
        liveList.push(liveTag);
    }
}

function updateLiveLists() {
    if (document.getElementById('liveList1')) {
        updateLiveList('liveList1');
    }
    if (document.getElementById('liveList2')) {
        updateLiveList('liveList2');
    }
    if (document.getElementById('liveList3')) {
        updateLiveList('liveList3');
    }
    changeSelectColors();
}

function updateLiveList(id) {
    var aqoursChecked = document.getElementById('aqours').checked;
    var museChecked = document.getElementById('muse').checked;
    var smileChecked = document.getElementById('smile').checked;
    var pureChecked = document.getElementById('pure').checked;
    var coolChecked = document.getElementById('cool').checked;
    var easyChecked = document.getElementById('easy').checked;
    var normalChecked = document.getElementById('normal').checked;
    var hardChecked = document.getElementById('hard').checked;
    var expertChecked = document.getElementById('expert').checked;
    var masterChecked = document.getElementById('master').checked;

    var lives = document.getElementById(id);
    var selectedLive = lives.options[lives.selectedIndex];
    if (selectedLive !== undefined) {
        var selectedLiveName = lives.options[lives.selectedIndex].text;
        var selectedLiveId = lives.options[lives.selectedIndex].value;
    }
    lives.options.length = 0;


    for (var i = 0; i < liveList.length; i++) {
        var currentLive = liveList[i];
        switch (currentLive.member_category) {
            case 1:
                if (!museChecked) {
                    continue;
                }
                break;
            case 2:
                if (!aqoursChecked) {
                    continue;
                }
                break;
        }

        switch (currentLive.attribute_icon_id) {
            case 1:
                if (!smileChecked) {
                    continue;
                }
                break;
            case 2:
                if (!pureChecked) {
                    continue;
                }
                break;
            case 3:
                if (!coolChecked) {
                    continue;
                }
                break;
        }

        switch (currentLive.difficulty_text) {
            case 'EASY':
                if (!easyChecked) {
                    continue;
                }
                break;
            case 'NORMAL':
                if (!normalChecked) {
                    continue;
                }
                break;
            case 'HARD':
                if (!hardChecked) {
                    continue;
                }
                break;
            case 'EXPERT':
                if (!expertChecked) {
                    continue;
                }
                break;
            case 'MASTER':
                if (!masterChecked) {
                    continue;
                }
                break;
        }
        lives.options.add(new Option(currentLive.name + ' [' + currentLive.difficulty_text + '] [' + currentLive.s_rank_combo + ']',
            currentLive.live_setting_id));
        lives[lives.options.length - 1].style.color = colorIndex[currentLive.attribute_icon_id];
        if (currentLive.live_setting_id == selectedLiveId) {
            lives[lives.options.length - 1].selected = true;
            lives[lives.options.length - 1]
        }
    }

}

function changeSelectColors() {
    var combo = 0;
    if (document.getElementById('liveList1')) {
        var combo1 = changeSelectColor('liveList1');
        if (!$('#liveList1').is(':hidden')) {
            combo += combo1;
        }
    }
    if (document.getElementById('liveList2')) {
        var combo2 = changeSelectColor('liveList2');
        if (!$('#liveList2').is(':hidden')) {
            combo += combo2;
        }
    }
    if (document.getElementById('liveList3')) {
        var combo3 = changeSelectColor('liveList3');
        if (!$('#liveList3').is(':hidden')) {
            combo += combo3;
        }
    }
    $('#totalCombo').text(combo);
}

function changeSelectColor(id) {
    var lives = document.getElementById(id);
    var selectedLive = lives.options[lives.selectedIndex];
    if (selectedLive !== undefined) {
        lives.style.color = selectedLive.style.color;
        // Return selected live's combo
        return parseInt(selectedLive.text.match(/\[[0-9]+\]/)[0].match(/[0-9]+/)[0]);
    }
    return 0;
}

function addLiveList() {
    // liveList3 is hidden
    if ($('#liveList3').is(':hidden')) {

        // liveList2 exists
        if (!$('#liveList2').is(':hidden')) {

            // show liveList3
            $('#liveList3Frame').show();
            $('#addLiveList').hide();

            // Only liveList1 exists    
        } else {
            $('#liveList2Frame').show();
            $('#removeLiveList').show();

        }
    }
    changeSelectColors();
}

function removeLiveList() {
    if (!$('#liveList3').is(':hidden')) {
        $('#liveList3Frame').hide();
        $('#addLiveList').show();


    } else if (!$('#liveList2').is(':hidden')) {
        $('#liveList2Frame').hide();
        $('#removeLiveList').hide();

    }
    changeSelectColors();
}