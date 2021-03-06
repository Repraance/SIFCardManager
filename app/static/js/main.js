$(document).ready(function() {
    loadMapsJSON();
    initLiveList();
    $('#liveList2Frame').hide();
    $('#liveList3Frame').hide();
    $('#removeLiveList').hide();
    updateLiveLists();
    loadJSONs();
    disableEnableGuest();
    initTeamInfo();
})

var liveList = new Array();
var teamInfo = new Array(10);

var colorIndex = {
    1: '#E91E63',
    2: '#4CAF50',
    3: '#2196F3'
}

var attributeIndex = {
    1: 'smile',
    2: 'pure',
    3: 'cool'
}

var rarityIndex = {
    1: 'N',
    2: 'R',
    3: 'SR',
    4: 'UR',
    5: 'SSR'
}

var live_setting_url = 'static/maps/live_setting.json'
var unit_url = 'static/json/unit.json';

function initTeamInfo() {
    for (let i = 0; i < 9; i++) {
        teamInfo[i] = {
            "smile": 0,
            "pure": 0,
            "cool": 0,
            "cardid": 0,
            "skilllevel": 1,
            "mezame": 0,
            "gemnum": 0,
            "gemsinglepercent": 0,
            "gemallpercent": 0,
            "gemskill": 0,
            "gemacc": 0,
            "slot": 0
        }
    }
    teamInfo[9] = new Object();
}

function loadMapsJSON() {
    $.ajaxSettings.async = false;
    $.getJSON(live_setting_url,
        function(json) {
            mapsJson = json;
        })
}

function loadJSONs() {
    $.ajaxSettings.async = true;

    $.getJSON(unit_url, function(json) {
        unit = json;
    })
}


function loadFile() {
    var resultFile = document.getElementById('openFile').files[0];
    if (resultFile) {
        var reader = new FileReader();
        reader.readAsText(resultFile, 'UTF-8');
        reader.onload = function(e) {
            var data = this.result;
            var rawTeamInfo = JSON.parse(decodeURI(data));
            for (let i = 0; i < 9; i++) {
                teamInfo[i] = rawTeamInfo[i];
                for (let key in teamInfo[i]) {
                    teamInfo[i][key] = Number(teamInfo[i][key]);
                }
                for (let j = 0; j < unit.length; j++) {
                    if (unit[j].unit_number == teamInfo[i].cardid) {
                        teamInfo[i].originalCardInfo = unit[j];
                        teamInfo[i].attribute_id = teamInfo[i].originalCardInfo.attribute_id;
                        teamInfo[i].attribute = attributeIndex[teamInfo[i].attribute_id];
                    }
                }
                changeSlots(i);
                fillMemberInfo(i, teamInfo[i]);
            }
        };
    } else {
        alert('No file chosen!');
    }
}

// Return records in JSON that contains {key: value}
function findJSON(json, key, value) {
    var returns = new Array();
    if (key instanceof Array) {
        if (key.length == value.length) {
            for (var i = 0; i < json.length; i++) {
                for (var j = 0; j < key.length; j++) {
                    if (json[i][key[j]] != value[j]) {
                        break;
                    } else {
                        if (j == key.length - 1) {
                            returns.push(json[i]);
                        }
                    }
                }
            }
        }
    } else {
        for (var i = 0; i < json.length; i++) {
            if (json[i][key] == value) {
                returns.push(json[i]);
            }
        }
    }
    return returns;
}


function disableEnableGuest() {
    if ($('#guest').is(':checked')) {
        $("#guestLeaderSkill").children().attr("disabled", false);
        $("#guestLeaderExtraSkill").children().each(function(index) {
            $(this).children().attr("disabled", false);
        });
    } else {
        $("#guestLeaderSkill").children().attr("disabled", true);
        $("#guestLeaderExtraSkill").children().each(function(index) {
            $(this).children().attr("disabled", true);
        });
    }
}

function checkTeam() {
    for (var i = 0; i < 9; i++) {
        if (!teamInfo[i].cardid)
            return false;
    }
    return true;
}

function calculateTotalAttribute(attributeId) {
    var total = 0;
    var attributeType = attributeIndex[attributeId];
    var leaderAttributeId = teamInfo[4].attribute_id;
    var leaderSkillInfo = teamInfo[4].originalCardInfo.leader_skill_info;
    var leaderExtraSkillInfo = teamInfo[4].originalCardInfo.leader_extra_skill_info;
    var gemAllpercent = new Array();
    for (let i = 0; i < 9; i++) {
        gemAllpercent.push(teamInfo[i].gemallpercent);
    }

    // Get guest info
    var guest = document.getElementById('guest').checked;
    if (guest) {
        var guestEffectTypeId = Number($("input[name='guestEffectType']:checked").val());
        var guestExtraEffectTypeId = Number($("input[name='guestExtraEffectType']:checked").val());
    }

    // If target attribute agrees with the team leader attribute
    if (leaderAttributeId == attributeId) {
        for (let i = 0; i < 9; i++) {
            var member = teamInfo[i];
            var bareAttribute = member[attributeType];
            // bonus from school idol skills effect on single member
            var gemSingleBonus = member.gemnum;
            if (parseFloat(member.gemsinglepercent) > 0.16) {
                gemSingleBonus += Math.ceil(bareAttribute * 0.1);
                gemSingleBonus += Math.ceil(bareAttribute * 0.16);
            } else {
                gemSingleBonus += Math.ceil(bareAttribute * member.gemsinglepercent);
            }
            //bonus from school idol skills effect on sthe whole team
            var gemAllBonus = 0;
            for (var j = 0; j < gemAllpercent.length; j++) {
                if (gemAllpercent[j] > 0.024) {
                    gemAllBonus += Math.ceil(bareAttribute * 0.018);
                    gemAllBonus += Math.ceil(bareAttribute * 0.024);
                } else {
                    gemAllBonus += Math.ceil(bareAttribute * gemAllpercent[j]);
                }
            }
            // bonus from all school idol skills
            var gemBonusAttribute = bareAttribute + gemSingleBonus + gemAllBonus;

            // bonus from leader skill
            var leaderSkillBonus = 0;
            if (leaderSkillInfo != undefined) {
                var effectTypeId = leaderSkillInfo.leader_skill_effect_type;
                var effectType = attributeIndex[effectTypeId];
                // If old leader skill e.g.クールPが9%UPする
                if (effectTypeId == leaderAttributeId) {
                    leaderSkillBonus = Math.ceil(gemBonusAttribute * leaderSkillInfo.effect_value / 100);
                    // If new leader skill e.g.スマイルPの12%分クールPがUPする
                } else {
                    leaderSkillBonus = Math.ceil(member[effectType] * leaderSkillInfo.effect_value / 100);
                }
            }

            // bonus from extra leader skill
            var leaderExtraSkillBonus = 0;
            if (leaderExtraSkillInfo != undefined) {
                if (member.originalCardInfo.member_tag.indexOf(leaderExtraSkillInfo.member_tag_id) > -1) {
                    leaderExtraSkillBonus = Math.ceil(gemBonusAttribute * leaderExtraSkillInfo.effect_value / 100);
                }
            }

            // bonus from guest
            var guestleaderSkillBonus = 0;
            var guestLeaderExtraSkillBonus = 0;

            if (guest) {
                // bonus from guest's leader skill
                if (!(isNaN(guestEffectTypeId))) {
                    var guestEffectType = attributeIndex[guestEffectTypeId];
                    // If old leader skill e.g.クールPが9%UPする
                    if (guestEffectTypeId == leaderAttributeId) {
                        guestleaderSkillBonus = Math.ceil(gemBonusAttribute * 0.09);
                        // If new leader skill e.g.スマイルPの12%分クールPがUPする
                    } else {
                        guestleaderSkillBonus = Math.ceil(parseInt(member[guestEffectType]) * 0.12);
                    }
                }
                // bonus from guest's extra leader skill
                if (!(isNaN(guestExtraEffectTypeId))) {
                    if (member.originalCardInfo.member_tag.indexOf(guestExtraEffectTypeId) > -1) {
                        if (guestExtraEffectTypeId == 4 || guestExtraEffectTypeId == 5) {
                            guestLeaderExtraSkillBonus = Math.ceil(gemBonusAttribute * 0.03);
                        } else {
                            guestLeaderExtraSkillBonus = Math.ceil(gemBonusAttribute * 0.06);
                        }
                    }
                }
            }
            var memberTotal = gemBonusAttribute + leaderSkillBonus + leaderExtraSkillBonus + guestleaderSkillBonus + guestLeaderExtraSkillBonus;
            total += memberTotal;
        }
    } else {
        for (var i = 0; i < 9; i++) {
            total += parseInt(teamInfo[i][attributeType]);
        }
    }
    return total;
}

function getLiveById(liveId) {
    var liveInfo;
    var liveNotes;
    var sliderCount = 0;
    for (var i = 0; i < mapsJson.length; i++) {
        // name attribute_icon_id member_category difficulty_text live_setting_id
        if (mapsJson[i].live_setting_id == liveId) {
            liveInfo = mapsJson[i];
            $.ajaxSettings.async = false;
            $.getJSON('static/maps/latest/' + liveInfo.notes_setting_asset,
                function(json) {
                    liveNotes = json;
                })
            break;
        }
    }

    var liveNoteCount = liveNotes.length;
    for (var i = 0; i < liveNoteCount; i++) {
        liveNotes[i].timing_sec = parseInt(liveNotes[i].timing_sec * 1000);
        // slider
        if (liveNotes[i].effect == 3) {
            sliderCount++;
            liveNotes[i].effect_value = parseInt(liveNotes[i].effect_value * 1000);
            var sliderEnding = JSON.parse(JSON.stringify(liveNotes[i]));
            sliderEnding.effect_value = liveNotes[i].timing_sec;
            sliderEnding.timing_sec = liveNotes[i].timing_sec + liveNotes[i].effect_value + 1;
            sliderEnding.effect = 5;
            liveNotes.push(sliderEnding);
        }
    }

    liveNotes.sort(function(x, y) {
        return x.timing_sec - y.timing_sec;
    })

    var attributeId = liveInfo.attribute_icon_id;
    var memberCategory = liveInfo.member_category;

    return {
        'attributeId': attributeId,
        'memberCategory': memberCategory,
        'liveNotes': liveNotes,
        'totalNoteCount': liveNoteCount
    };
}


function mergeMaps(map1, map2) {
    var endingTime = map1[map1.length - 1].timing_sec;
    for (var i = 0; i < map2.length; i++) {
        map2[i].timing_sec += endingTime;
    }
    return map1.concat(map2);
}

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
    $('#total-combo').text(combo);
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