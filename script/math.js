var specialNumber = -1;
var scrolling = false;

var startTest = function () {
    if ($("#testTypeSpec")[0].checked) {
        specialNumber = $("#specNum").val();
    }
    prepareTest();
};

var prepareTest = function () {
    var testDiv = document.getElementById("testDiv");
    var now = new Date();
    $(testDiv).data("startTime", now.getTime());
    var qs = [];

    var qExist = function (thisQ) {
        for (var qi = 0; qi < qs.length; qi++) {
            var q = qs[qi];
            if (q.n1 === thisQ.n1 && q.n2 === thisQ.n2) return true;
        }
        return false;
    };

    var generateQ = function () {
        var n1, n2;
        if (config.EXERCISE_TYPE === 0) {
            //加法
            if (specialNumber === -1) {
                n1 = randomNumber(config.TEST_NUMBER_LOW, config.TEST_NUMBER_HIGH);
                n2 = randomNumber(config.TEST_NUMBER_LOW, config.TEST_NUMBER_HIGH);
            } else {
                if (randomNumber(1, 2) === 1) {
                    n1 = specialNumber;
                    n2 = randomNumber(config.TEST_NUMBER_LOW, config.TEST_NUMBER_HIGH);
                } else {
                    n2 = specialNumber;
                    n1 = randomNumber(config.TEST_NUMBER_LOW, config.TEST_NUMBER_HIGH);
                }

            }
        } else {
            //减法
            if (specialNumber === -1) {
                n2 = randomNumber(config.TEST_NUMBER_LOW, (config.TEST_NUMBER_HIGH+1)/2);
                n1 = randomNumber(n2 + 1, (config.TEST_NUMBER_HIGH + 1) * 2);
            } else {
                n2 = parseInt(specialNumber,10);
                n1 = randomNumber(n2 + 1, (config.TEST_NUMBER_HIGH + 1) * 2);
            }
        }

        return {n1:n1, n2:n2};
    };

    for (var i = 0; i < config.TOTAL_TEST_COUNT; i++) {
        var q = generateQ();
        while (qExist(q)) {
            q = generateQ();
        }
        qs.push(q);
        var qDiv = document.createElement("div");
        qDiv.setAttribute("class", "q");
        var qSpan = document.createElement("span");
        $(qSpan).html(q.n1 + (config.EXERCISE_TYPE === 0 ? " + " : " - ") + q.n2 + " = ");
        var answer = document.createElement("input");
        answer.setAttribute("id", "a" + i);
        answer.setAttribute("class", "answer");
        answer.setAttribute("maxLength", 3);
        var hidden_n1 = document.createElement("input");
        hidden_n1.setAttribute("type", "hidden");
        hidden_n1.setAttribute("value", q.n1);
        hidden_n1.setAttribute("id", "q" + i + "_1");
        var hidden_n2 = document.createElement("input");
        hidden_n2.setAttribute("type", "hidden");
        hidden_n2.setAttribute("value", q.n2);
        hidden_n2.setAttribute("id", "q" + i + "_2");
        qDiv.appendChild(qSpan);
        qDiv.appendChild(answer);
        qDiv.appendChild(hidden_n1);
        qDiv.appendChild(hidden_n2);
        testDiv.appendChild(qDiv);
        if (i !== 0) {
            qDiv.style.display = 'none';
        }
        $(qDiv).data("questionNo", i + 1);
    }
    $("#choose").hide();
    $("#test").show();
    $("#questionNumber").html("第1题，共" + config.TOTAL_TEST_COUNT + "题");
};


var prevQuestion = function () {
    if (scrolling === true) return;
    var $nowDiv = $("#testDiv").find("div:visible");
    if ($nowDiv.prev().length > 0) {
        var prevDiv = $nowDiv.prev()[0];
        $("#questionNumber").html("第" + $(prevDiv).data("questionNo") + "题，共" + config.TOTAL_TEST_COUNT + "题");

        scrolling = true;
        $nowDiv.hide("slide", {direction:"right"}, 500, function () {
            $nowDiv.prev().show("slide", {direction:"left"}, 700, function () {
                scrolling = false;
            });
        });

    }
};
var nextQuestion = function () {
    if (scrolling === true) return;
    var $nowDiv = $("#testDiv").find("div:visible");
    if ($nowDiv.next().length > 0) {
        var nextDiv = $nowDiv.next()[0];
        $("#questionNumber").html("第" + $(nextDiv).data("questionNo") + "题，共" + config.TOTAL_TEST_COUNT + "题");
        scrolling = true;
        $nowDiv.hide("slide", {direction:"left"}, 500, function () {
            $(nextDiv).show("slide", {direction:"right"}, 700, function () {
                scrolling = false;
            });
        });
    }
};

var quickAnswerClick = function () {
    $("#testDiv").find("div:visible").find(".answer").val(this.value);
    nextQuestion();
};

var submitAnswer = function () {
    if (scrolling === true) {
        setTimeout(submitAnswer, 500);
        return;
    }
    var now = new Date();
    var scorePerQuestion = Math.floor(100 / config.TOTAL_TEST_COUNT);
    var totalScore = 100;
    $("#testDiv").children().each(function () {
        var no = $(this).data("questionNo") - 1;
        var a = parseInt($("#a" + no).val(), 10);
        var n1 = parseInt($("#q" + no + "_1").val(), 10);
        var n2 = parseInt($("#q" + no + "_2").val(), 10);
        var v;
        if (!isNaN(a)) {
            if (config.EXERCISE_TYPE === 0) {
                v = n1 + n2;
            } else {
                v = n1 - n2;
            }
        }
        var span;
        if (a === v) {
            if ($(this).find("span.cry").length > 0) {
                $(this).find("span.cry").removeClass("cry").addClass("smile");
            } else {
                if ($(this).find("span.smile").length === 0) {
                    span = document.createElement("span");
                    span.setAttribute("class", "smile");
                    $(span).html("&nbsp;&nbsp;");
                    this.appendChild(span);
                }
            }
        } else {
            if ($(this).find("span.smile").length > 0) {
                $(this).find("span.smile").removeClass("smile").addClass("cry");
            } else {
                if ($(this).find("span.cry").length === 0) {
                    span = document.createElement("span");
                    span.setAttribute("class", "cry");
                    $(span).html("&nbsp;&nbsp;");
                    this.appendChild(span);
                }
            }
            totalScore = totalScore - scorePerQuestion;
        }


    });
    var totalTime = (now.getTime() - $(testDiv).data("startTime")) / 1000;
    var $score = $("#score");
    $score.find(".score").html("总得分:" + totalScore);
    $("#scorePic")[0].setAttribute("class", getScoreClassName(totalScore));
    $score.find(".time").html("总用时:" + convertTime(totalTime));
    $("#timePic")[0].setAttribute("class", getTimeClassName(totalTime));
};

var newQuestion = function () {
    if (confirm("确认要重新选题吗？") === true) {
        window.location = "index.html";
    }
};

var getMathType = function () {
    var url = window.location.href; //获取当前页面的url
    var offset = url.indexOf("?"); //设置参数字符串开始的位置
    if (offset !== -1) {
        var type = url.substring(offset+1);
        if (type === "minus") {
            config.EXERCISE_TYPE = 1;
        }
    } else {
        config.EXERCISE_TYPE = 0;
    }
};

$(document).ready(function () {
    getMathType();
    var specNumSel = $("#specNum")[0];
    for (var i = config.TEST_NUMBER_LOW; i <= config.TEST_NUMBER_HIGH; i++) {
        var o = document.createElement("option");
        o.value = i;
        o.text = i;
        specNumSel.add(o);
    }

    var maxQuickAnswerNumber = (config.TEST_NUMBER_HIGH + 1) * 2;
    var quickAnswerDiv = document.getElementById("quickAnswer");
    for (var index = 1; index <= maxQuickAnswerNumber; index++) {
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", index.toString());
        button.setAttribute("class", "qb");
        quickAnswerDiv.appendChild(button);
        if (index % 10 === 0) {
            quickAnswerDiv.appendChild(document.createElement("br"));
        }
    }

    $(quickAnswerDiv).on("click", ".qb", quickAnswerClick);
    $("#start").on("click", startTest);
    $("#prevQuestion").on("click", prevQuestion);
    $("#nextQuestion").on("click", nextQuestion);
    $("#submitAnswer").on("click", submitAnswer);
    $("#newQuestion").on("click", newQuestion);

});