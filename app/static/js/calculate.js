function calculate() {
    if (teamInfo == undefined) {
        alert('No team info loaded!')
        return;
    }

    var liveId1 = $('#liveList1').val();
    var liveId2 = $('#liveList2').val();
    var liveId3 = $('#liveList3').val();

    if (liveId1 == null) {
        alert('No live chosen!');
        return;
    }

    var live1 = getLiveById(liveId1);
    var liveInfo = live1;

    if (!$('#liveList2').is(':hidden')) {
        var live2 = getLiveById(liveId2);
        liveInfo.liveNotes = mergeMaps(liveInfo.liveNotes, live2.liveNotes);
        liveInfo.totalNoteCount += live2.totalNoteCount;
    }

    if (!$('#liveList3').is(':hidden')) {
        var live3 = getLiveById(liveId3);
        liveInfo.liveNotes = mergeMaps(liveInfo.liveNotes, live3.liveNotes);
        liveInfo.totalNoteCount += live3.totalNoteCount;
    }
    var perfectRate = $('#perfectRate').val();
    console.log('perfectRate', parseFloat(perfectRate));
    var score = calculateExpectedScore(liveInfo, perfectRate);
    //$.get('/a', function(result) {
    //    $('#result').html(result);
    //});
    $.post('/post', { data: JSON.stringify(teamInfo) }, function(result) {
        $('#result').html(result);
    });
}

function calculateExpectedScore(liveInfo, perfectRate, maxCombo = 0, scoreUp = false, skillUp = false) {
    var attributeScore = 0;
    var skillScore = 0;
    var totalScore = 0;

    var liveAttributeId = liveInfo.attributeId;
    var liveMemberCategory = liveInfo.memberCategory;
    var liveNotes = liveInfo.liveNotes;
    var totalNoteCount = liveInfo.totalNoteCount;

    var teamTotalAttribute = calculateTotalAttribute(liveAttributeId);
    console.log(liveAttributeId, teamTotalAttribute);

    var currentCombo = 0;
    var resultCombo;
    var sliderCount = 0;
    var starCount = 0;

    for (let i = 0; i < 9; i++) {
        let typeFactor = 1;
        if (teamInfo[i].attribute_id == liveAttributeId) {
            typeFactor *= 1.1;
        }
        if (teamInfo[i].member_tag[0] == liveMemberCategory + 3) {
            typeFactor *= 1.1;
        }
        teamInfo[i].typeFactor = typeFactor;
    }

    if (skillUp) {
        for (let i = 0; i < 9; i++) {
            let skillInfo = teamInfo[i].skill_info;
            if (!skillInfo) {
                if (skillInfo.activation_rate < 100) {
                    skillInfo.activation_rate_rev = skillInfo.activation_rate * 1.1;
                }
            }
        }
    }

    var basicScore = teamTotalAttribute * 0.0125;
    if (scoreUp) {
        basicScore *= 1.1;
    }

    function getComboFactor(combo) {
        if (combo >= 0 && combo <= 50) {
            return 1;
        } else if (combo <= 100) {
            return 1.1;
        } else if (combo <= 200) {
            return 1.15;
        } else if (combo <= 400) {
            return 1.2;
        } else if (combo <= 600) {
            return 1.25;
        } else if (combo <= 800) {
            return 1.3;
        } else {
            return 1.35;
        }
    }

    for (let i = 0; i < liveNotes.length; i++) {
        let note = liveNotes[i];
        let position = 9 - liveNotes[i].position;
        let typeFactor = teamInfo[position].typeFactor;
        let ComboFactor = getComboFactor(currentCombo);

        // 1 2 4 indicates single note
        if (note.effect == 1 || note.effect == 2 || note.effect == 4) {
            let perfectScore = Math.floor(basicScore * typeFactor * ComboFactor * 1);
            let greatScore = Math.floor(basicScore * typeFactor * ComboFactor * 0.88);
            let noteExpectedScore = perfectRate * perfectScore + (1 - perfectRate) * greatScore;

            attributeScore += noteExpectedScore;
            currentCombo++;
            // 4 indicates star single note
            if (note.effect == 4) {
                starCount++;
            }
        }

        // 5 indicates slider ending
        if (note.effect == 5) {
            let ppScore = Math.floor(basicScore * typeFactor * ComboFactor * 1 * 1.25);
            let pgScore = Math.floor(basicScore * typeFactor * ComboFactor * 0.88 * 1.25);
            let ggScore = Math.floor(basicScore * typeFactor * ComboFactor * Math.pow(0.88, 2) * 1.25);
            let noteExpectedScore = Math.pow(perfectRate, 2) * ppScore + 2 * perfectRate * (1 - perfectRate) * pgScore + Math.pow(1 - perfectRate, 2) * ggScore;
            attributeScore += noteExpectedScore;
            currentCombo++;
            sliderCount++;
        }
    }
    resultCombo = currentCombo;

    // A slider note has a start and a ending.
    // Only when twice is perfect, the perfect lock could be triggered,
    // in this way the total perfect rate would be a little smaller
    var sliderPerfectRate = Math.pow(perfectRate, 2);
    var sliderNoteProportioin = sliderCount / totalNoteCount;
    var totalPerfectRate = sliderNoteProportioin * sliderPerfectRate + (1 - sliderNoteProportioin) * perfectRate;

    // perfect count is not certain itself, so it doesn't floored here
    var perfectCount = totalNoteCount * totalPerfectRate;

    // Calculate skill score
    for (let i = 0; i < 9; i++) {
        let skillInfo = teamInfo[i].skill_info;
        if (skillInfo) {
            let skillExpectedScore = 0;


            // 'skill_effect_type': 11 indicates score up skill
            if (skillInfo.skill_effect_type == 11) {
                switch (skillInfo.trigger_type) {

                    case 3: // 'trigger_type': 3 indicates icon
                        skillExpectedScore = Math.floor(totalNoteCount / skillInfo.trigger_value) *
                            skillInfo.activation_rate_rev / 100 * skillInfo.effect_value;
                        break;

                    case 4: // 'trigger_type': 4 indicates combo
                        skillExpectedScore = Math.floor(totalNoteCount / skillInfo.trigger_value) *
                            skillInfo.activation_rate_rev / 100 * skillInfo.effect_value;
                        break;

                    case 6: // 'trigger_type': 6 indicates Perfect
                        skillExpectedScore = Math.floor(perfectCount / skillInfo.trigger_value) *
                            skillInfo.activation_rate_rev / 100 * skillInfo.effect_value;
                        break;

                    case 12: // 'trigger_type': 12 indicates star icon
                        skillExpectedScore = Math.floor(starCount / skillInfo.trigger_value) *
                            skillInfo.activation_rate_rev / 100 * skillInfo.effect_value;
                        break;

                    case 1: // 'trigger_type': 1 indicates time
                        skillExpectedScore = Math.floor(liveNotes[liveNotes.length - 1].timing_sec / 1000 / skillInfo.trigger_value) *
                            skillInfo.activation_rate_rev / 100 * skillInfo.effect_value;
                        break;
                    default:
                        break;
                }
            }
            skillScore += skillExpectedScore;
            console.log(skillExpectedScore);
        }
    }
    totalScore = attributeScore + skillScore;

    var totalScoringUpRate = 0;
    // Burst scoring up cards expected scoring bonus (e.g. スコア15000達成ごとに13%の確率でスコアが1120増える)
    for (let i = 0; i < 9; i++) {
        let skillInfo = teamInfo[i].skill_info;
        if (skillInfo.skill_effect_type == 11 && skillInfo.trigger_type == 5) {
            let scoringUpRate = skillInfo.effect_value / skillInfo.trigger_value * skillInfo.activation_rate_rev / 100;
            totalScoringUpRate += scoringUpRate;
        }
    }
    totalScore /= (1 - totalScoringUpRate);
    return totalScore;
}


function calculateScoreDistribution(liveInfo) {
    var noteIndex = 0;
    for (var i = 0; i < 120000; i++) {
        while (liveNotes[noteIndex].timing_sec == i) {
            if (noteIndex == liveNotes.length - 1) {
                break;
            }
            noteIndex++;
            //console.log(i);
        }
    }
    // TODO
}