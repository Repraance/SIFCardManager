$(document).ready(function() {
    loadMapsJSON();
    initLiveList();
    $('#liveList2Frame').hide();
    $('#liveList3Frame').hide();
    $('#removeLiveList').hide();
    updateLiveLists();
    loadJSONs();

    disableEnableGuest();

})

var liveList = new Array();
var teamInfo;
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
    4: 'SSR',
    5: 'UR'
}

var live_setting_url = 'static/maps/live_setting.json'

var unit_leader_skill_extra_m_url = 'static/json/unit_leader_skill_extra_m.json';
var unit_leader_skill_m_url = 'static/json/unit_leader_skill_m.json';
var unit_m_url = 'static/json/unit_m.json';
var unit_skill_level_m_url = 'static/json/unit_skill_level_m.json';
var unit_skill_m_url = 'static/json/unit_skill_m.json';
var unit_type_member_tag_m_url = 'static/json/unit_type_member_tag_m.json';
var unit_url = 'static/json/unit.json';

function loadMapsJSON() {
    $.ajaxSettings.async = false;
    $.getJSON(live_setting_url,
        function(json) {
            mapsJson = json;
        })
}

function loadJSONs() {
    $.ajaxSettings.async = true;
    $.getJSON(unit_leader_skill_extra_m_url, function(json) {
        unit_leader_skill_extra_m = json;
    })

    $.getJSON(unit_leader_skill_m_url, function(json) {
        unit_leader_skill_m = json;
    })

    $.getJSON(unit_m_url, function(json) {
        unit_m = json;
    })

    $.getJSON(unit_skill_level_m_url, function(json) {
        unit_skill_level_m = json;
    })

    $.getJSON(unit_skill_m_url, function(json) {
        unit_skill_m = json;
    })

    $.getJSON(unit_type_member_tag_m_url, function(json) {
        unit_type_member_tag_m = json;
    })

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
            teamInfo = JSON.parse(decodeURI(data));
            setTeamInfo();
            displayTeam();
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

function setTeamInfo() {
    // Get the leader skill info
    // and save it into teamInfo[9]
    var leader = teamInfo[4];
    var leaderSkillInfo;
    var leaderSkillExtraInfo;
    var leader_unit_id = leader.cardid;
    var leader_skill_id;

    teamInfo.push({
        'leaderSkillInfo': undefined,
        'leaderSkillExtraInfo': undefined
    });


    leader_skill_id = findJSON(unit_m, 'unit_number', leader_unit_id)[0].default_leader_skill_id;
    if (leader_skill_id != undefined) {
        leaderSkillInfo = findJSON(unit_leader_skill_m, 'unit_leader_skill_id', leader_skill_id)[0];

        if (leaderSkillInfo != undefined) {
            leaderSkillExtraInfo = findJSON(unit_leader_skill_extra_m, 'unit_leader_skill_id', leader_skill_id)[0];
            teamInfo[9].leaderSkillInfo = leaderSkillInfo;
            teamInfo[9].leaderSkillExtraInfo = leaderSkillExtraInfo;
        }
    }

    // Get Aura/Veil school idol skills info (effect on the whole team)
    // and save it into teamInfo[9]
    teamInfo[9].gemallpercent = new Array();
    for (var i = 0; i < 9; i++) {
        teamInfo[9].gemallpercent.push(teamInfo[i].gemallpercent);
    }

    // Get member info
    for (var i = 0; i < 9; i++) {
        var unit_id = teamInfo[i].cardid;
        var cardInfo = findJSON(unit_m, 'unit_number', teamInfo[i].cardid)[0];
        $.extend(teamInfo[i], cardInfo);

        // Get skill info
        let skill_info = findJSON(unit_skill_m, 'unit_skill_id', teamInfo[i].default_unit_skill_id)[0];
        let skill_level_info = findJSON(unit_skill_level_m, ['unit_skill_id', 'skill_level'], [teamInfo[i].default_unit_skill_id, teamInfo[i].skilllevel])[0];
        let skill_info_all = $.extend({}, skill_level_info, skill_info);
        console.log(skill_level_info);
        teamInfo[i].skill_info = skill_info_all;
        if (teamInfo[i].skill_info) {
            teamInfo[i].skill_info.activation_rate_rev = teamInfo[i].skill_info.activation_rate;
        }
        if (teamInfo[i].gemskill) {
            teamInfo[i].skill_info.effect_value *= 2.5;

        }

        // Get member tag 
        var member_tag = new Array();
        var member_tag_temp = findJSON(unit_type_member_tag_m, 'unit_type_id', teamInfo[i].unit_type_id);
        if (member_tag_temp.length > 1) {
            for (var j = 0; j < member_tag_temp.length; j++) {
                member_tag.push(member_tag_temp[j].member_tag_id);
            }
        }
        teamInfo[i].member_tag = member_tag;
    }
    console.log(teamInfo);
}

function displayTeam() {
    var unitList = $('#unitList img');
    for (var i = 0; i < 9; i++) {
        let url = 'static/image/card/icon/';
        if (teamInfo[i].mezame) {
            url += 'rankup/';
        } else {
            url += 'normal/';
        }
        url += String(teamInfo[i].cardid) + '.png';
        unitList.eq(i).attr('src', url);
    }


    var teamDefaultAttribute = teamInfo[4].attribute_id;
    $('.tda').text(attributeIndex[teamDefaultAttribute]);
    switch (teamDefaultAttribute) {
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

function getGuestInfo() {
    var guestEffectType = $("input[name='guestEffectType']:checked").val();
    var guestExtraEffectType = $("input[name='guestExtraEffectType']:checked").val();

}

function calculateTotalAttribute(attribute_id) {
    var total = 0;
    var attributeType = attributeIndex[attribute_id];
    var leaderAttributeId = teamInfo[4].attribute_id;

    // Get guest info
    if ($('#guest').is(':checked')) {
        var guestEffectTypeId = parseInt($("input[name='guestEffectType']:checked").val());
        var guestExtraEffectTypeId = parseInt($("input[name='guestExtraEffectType']:checked").val());
    }
    // If target attribute agrees with the team leader attribute
    if (leaderAttributeId == attribute_id) {
        for (var i = 0; i < 9; i++) {
            var member = teamInfo[i];
            var bareAttribute = parseInt(member[attributeType]);
            // bonus from school idol skills effect on single member
            var gemSingleBonus = parseInt(member.gemnum);
            if (parseFloat(member.gemsinglepercent) > 0.16) {
                gemSingleBonus += Math.ceil(bareAttribute * 0.1);
                gemSingleBonus += Math.ceil(bareAttribute * 0.16);
            } else {
                gemSingleBonus += Math.ceil(bareAttribute * parseFloat(member.gemsinglepercent));
            }
            //bonus from school idol skills effect on sthe whole team
            var gemAllBonus = 0;
            for (var j = 0; j < teamInfo[9].gemallpercent.length; j++) {
                if (parseFloat(teamInfo[9].gemallpercent[j]) > 0.024) {
                    gemAllBonus += Math.ceil(bareAttribute * 0.018);
                    gemAllBonus += Math.ceil(bareAttribute * 0.024);
                } else {
                    gemAllBonus += Math.ceil(bareAttribute * parseFloat(teamInfo[9].gemallpercent[j]));
                }
            }
            // bonus from all school idol skills
            var gemBonusAttribute = bareAttribute + gemSingleBonus + gemAllBonus;

            // bonus from leader skill
            var leaderSkillBonus = 0;
            var leaderSkillInfo = teamInfo[9].leaderSkillInfo;
            if (leaderSkillInfo != undefined) {
                var effectTypeId = leaderSkillInfo.leader_skill_effect_type;
                var effectType = attributeIndex[effectTypeId];
                // If old leader skill e.g.クールPが9%UPする
                if (effectTypeId == leaderAttributeId) {
                    leaderSkillBonus = Math.ceil(gemBonusAttribute * leaderSkillInfo.effect_value / 100);
                    // If new leader skill e.g.スマイルPの12%分クールPがUPする
                } else {
                    leaderSkillBonus = Math.ceil(parseInt(member[effectType]) * leaderSkillInfo.effect_value / 100);
                }
            }

            // bonus from extra leader skill
            var leaderSkillExtraBonus = 0;
            var leaderSkillExtraInfo = teamInfo[9].leaderSkillExtraInfo;
            if (leaderSkillExtraInfo != undefined) {
                if (member.member_tag.indexOf(leaderSkillExtraInfo.member_tag_id) > -1) {
                    leaderSkillExtraBonus = Math.ceil(gemBonusAttribute * leaderSkillExtraInfo.effect_value / 100);
                }
            }

            // bonus from guest
            var guestleaderSkillBonus = 0;
            var guestLeaderSkillExtraBonus = 0;

            if ($('#guest').is(':checked')) {
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
                    if (member.member_tag.indexOf(guestExtraEffectTypeId) > -1) {
                        if (guestExtraEffectTypeId == 4 || guestExtraEffectTypeId == 5) {
                            guestLeaderSkillExtraBonus = Math.ceil(gemBonusAttribute * 0.03);
                        } else {
                            guestLeaderSkillExtraBonus = Math.ceil(gemBonusAttribute * 0.06);
                        }
                    }
                }
            }
            var memberTotal = gemBonusAttribute + leaderSkillBonus + leaderSkillExtraBonus + guestleaderSkillBonus + guestLeaderSkillExtraBonus;
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