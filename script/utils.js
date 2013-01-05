var randomNumber = function (under, over) {

    switch (arguments.length) {

        case 1:
            return parseInt(Math.random() * under + 1);

        case 2:
            return parseInt(Math.random() * (over - under + 1) + under);

        default:
            return 0;

    }

};

var convertTime = function (s) {
    var t = "";
    s = Math.floor(s);
    if (s < 60) return s + "秒";
    t = s % 60 + "秒";
    s = Math.floor(s / 60);
    if (s < 60) return s + "分" + t;
    t = (s % 60) + "分" + t;
    s = Math.floor(s / 60);
    return s + "小时" + t;
};

var getScoreClassName = function (score) {
    if (score === 100) return "score_100";
    if (score > 90) return "score_90";
    if (score > 80) return "score_80";
    if (score > 70) return "score_70";
    if (score > 60) return "score_60";
    return "score_l60";
};

var getTimeClassName = function (time) {
    var timePerQuestion = time / config.TOTAL_TEST_COUNT;
    if (timePerQuestion < 7) return "time_3s";
    if (timePerQuestion < 7.5) return "time_2s";
    if (timePerQuestion < 8) return "time_1s";
    if (timePerQuestion < 8.5) return "time_3l";
    if (timePerQuestion < 9) return "time_2l";
    if (timePerQuestion < 9.5) return "time_1l";
    if (timePerQuestion < 10) return "time_3sm";
    if (timePerQuestion < 10.5) return "time_2sm";
    if (timePerQuestion < 11) return "time_1sm";
    if (timePerQuestion < 11.5) return "time_1c";
    if (timePerQuestion < 12) return "time_2c";
    if (timePerQuestion < 12.5) return "time_3c";
    if (timePerQuestion < 13) return "time_1cc";
    if (timePerQuestion < 13.5) return "time_2cc";
    if (timePerQuestion < 14) return "time_3cc";
    if (timePerQuestion < 14.5) return "time_1a";
    if (timePerQuestion < 15) return "time_2a";
    return "time_3a";
};