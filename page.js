$(document).ready(function() {
    
    var RETRY_TEXT = "Retry";
    var EXPLORED_ALL_TEXT = "You have explored every possible route!";
    var INVALID_ID_TEXT = "Invalid question ID:";

    function map(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    function changeQuestion(newId) {
        currentId = newId;
        currentQuestion = flowDictionary.find(x => x.id == currentId);
        if (currentQuestion === undefined) {
            alert(INVALID_ID_TEXT + " " + currentId);
            changeQuestion(questionDictionary[Math.floor(Math.random() * questionDictionary.length)].id);
            return;
        }
        if (!exploredBranches.some(x=>x.id == currentQuestion.id)){
            exploredBranches.push(currentQuestion);
            exploredRatio = exploredBranches.length / flowDictionary.length;
            $(".progress-bar").css("width", "calc("+exploredRatio*100 + '%'+" - 14px");
            if(exploredRatio == 1) {
                $(".progress-title").text(EXPLORED_ALL_TEXT)
                $(".progress-container").css("top", "calc(50% + 192px)");
            }
        }
        transitionQuestion();
    }

    function changeTexts() {
        var q = currentQuestion;
        if (q.type == "question" || q.type == "follow-up") {
            $(".title").text(q.title);
            $("#option1").show();
            if (q.options.length == 1) {
                $("#option2").hide();
                $("#option3").hide();
            } else if (q.options.length == 2) {
                $("#option2").show();
                $("#option3").hide();
                $("#option2").find("span").text(q.options[1].text);
            } else {
                $("#option2").show();
                $("#option3").show();
                $("#option2").find("span").text(q.options[1].text);
                $("#option3").find("span").text(q.options[2].text);
            }
            $("#option1").find("span").text(q.options[0].text);
        } else {
            $(".title").text(q.text);
            $("#option1").find("span").text(RETRY_TEXT);
            $("#option2").hide();
            $("#option3").hide();
        }
    }

    function transitionQuestion() {
        $(".title").css("transform", "translateX(-400px)");
        let i = 1;
        $(".option-container").children().each(function () {
            let self = this;
            $(self).addClass("moving");
            setTimeout(function () { // ENTER ANIM
                $(self).css("transform", "translateX(-350px) rotateX(0) rotateY(0)");
            }, i * 25);
            i++;

            let oldVal = $(self).css("transition");
            setTimeout(function () { // JUMP TO RIGHT SIDE
                $(self).css("transition", "transform 0s");
                $(self).css("transform", "translateX(350px)");
                changeTexts();
            }, 75 + i * 25);

            setTimeout(function () { //ENDING ANIM
                $(self).css("background", "#fff");
                $(self).children("span").css("color", "rgba(255,0,0,0.6)");
                $(self).css("transition", oldVal);
                $(self).css("transform", "translateX(0)");
            }, 85 + i * 25);

            setTimeout(function () {
                $(".option-container").children().each(function () {
                    $(this).removeClass("moving");
                })
            }, 400);
        });

        let oldTitleTrans = $(".title").css("transition");
        setTimeout(function () {
            $(".title").css("transition", "transform 0s");
            $(".title").css("transform", "translateX(400px)");
        }, 100);
        setTimeout(function () {
            $(".title").css("transition", oldTitleTrans);
            $(".title").css("transform", "translateX(0px)");
        }, 110);
    }

    // Constants
    var ROTATION_X_MULT = 10;
    var ROTATION_Y_MULT = 10;

    var flowDictionary = {}
    var questionDictionary = {}
    var currentQuestion = {}
    var currentId = "";
    var exploredBranches = [];
    var exploredRatio = 0;

    $('.option-button').mousemove(function(e) { 
        if($(this).hasClass("moving")) return;
        var x = e.clientX - $(this).offset().left + $(window).scrollLeft();
        var y = e.clientY - $(this).offset().top + $(window).scrollTop();
         
        var rY = map(x, 0, $(this).width(), -ROTATION_Y_MULT, ROTATION_Y_MULT);
        var rX = map(y, 0, $(this).height(), -ROTATION_X_MULT, ROTATION_X_MULT);

        $(this).css("transform",`rotateX(${-rX}deg) rotateY(${rY}deg)`);
        $(this).css("background", "#222");
        $(this).children("span").css("color", "rgba(255,179,0,0.6)");
    });
    $('.option-button').mouseout(function() {
        if($(this).hasClass("moving")) return;
        $(this).css("transform",`rotateX(0) rotateY(0)`);
        $(this).css("background", "#fff");
        $(this).children("span").css("color", "rgba(255,0,0,0.6)");
    });

    $(".option-button").click(function() {
        var btnID = $(this).attr("id");
        if(currentQuestion.type == "result") {
            action = questionDictionary[Math.floor(Math.random() * questionDictionary.length)].id;
            changeQuestion(action);
            return;
        }
        var action = "";
        if(btnID == "option1") {
            action = currentQuestion.options[0].action;
        } else if (btnID == "option2") {
            action = currentQuestion.options[1].action;
        } else {
            action = currentQuestion.options[2].action;
        }
        if (action == "random"){
            action = questionDictionary[Math.floor(Math.random() * questionDictionary.length)].id;
            changeQuestion(action);
            return;
        }
        if(action.includes("|")) {
            var spl = action.split("|");
            action = spl[Math.floor(Math.random() * spl.length)];
        }
        changeQuestion(action)
    });

    $.getJSON("questionsBrig.json", function(data) {
        flowDictionary = data;
        questionDictionary = flowDictionary.filter(x => x.type == "question");
        changeQuestion(questionDictionary[Math.floor(Math.random() * questionDictionary.length)].id);
    });
});