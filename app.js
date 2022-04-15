// global lets.
let questionList = [];
let correctAnswer = "";
let question = "";
let allAnswers = [];
let round = 0;
let quNumber = 0;
let time = "off";
const priceAmount = ["0", "100", "200", "300", "500", "1,000", "2,000", "4,000", "8,000", "16,000",
    "32,000", "64,000", "125,000", "250,000", "500,000", "1,000,000"];

/**************************************** Helpers ******************************************/

// shuffle array values.
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// add "0" before number when its less than 10.
function addPreZeros(number) {
    if (number < 10)
        return "0" + number;
    else
        return number;
}

function hideElements() {
    for (let i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).style.display = "none";
    }
}

function showElements() {
    for (let i = 0; i < arguments.length; i++) {
        document.getElementById(arguments[i]).style.display = "block";
    }
}

function changeElement(name, att, newAtt) {
    switch (att) {
        case "value":
            document.getElementById(name).value = newAtt;
            break;

        case "remove":
            if (document.getElementById(name) != null) {
                document.getElementById(name).remove();
            }
            break;

        case "write into":
            document.getElementById(name).innerHTML = newAtt;
            break;

        case "concat":
            document.getElementById(name).innerHTML += newAtt;
            break;

        case "backgroundColor":
            document.getElementById(name).style.backgroundColor = newAtt;
            break;
    }
}

// replace substring with "☼" in questionList
function indicate(str) {
    questionList[quNumber] = questionList[quNumber].replace(str, "☼");
}

/********************************************** Code ***********************************************/

// get the data from the api and put the questions values on an array.
// moreover, create the opening screen.
function onLoad() {

    const str = "https://opentdb.com/api.php?amount=100";

    fetch(str)
        .then((resp) => resp.json())
        .then(function (data) {
            let authors = data;
            questionList = JSON.stringify(authors).split("}");
            questionList[0] = questionList[0].slice(30, questionList[0].length - 1);
        })

    setTimeout(function () {
        showElements("startAndGoAway", "amountList", "text", "password");
        hideElements("goAway");
    }, 650);
}

let isFirst = true;
// show a question on the screen.
function openQuestion() {

    // change music.
    if (isFirst) {
        document.getElementById("music").src =
            "https://www.youtube.com/embed/Hll_igbaa5E?autoplay=1&start=42";
        isFirst = false;
    }

    setTimeout(function () {
        timer(0, 30);
        nextQuestion();
        hideElements("text", "start", "goAway", "password");
        showElements("round", "fifty", "extraTime");
        if (didExtraTimeUsed) { showElements("noExtraTime") };
        if (didFiftyUsed) { showElements("noFifty") };
        changeElement("round", "write into", "Round:" + round);
        changeElement("line" + round, "backgroundColor", "orange");
    }, 1000);
}

// load the next question.
function nextQuestion() {
    round++; // move to the next question.
    quNumber++;

    // split the question data by attributs.
    indicate("type"); indicate("difficulty"); indicate("category");
    indicate("question"); indicate("correct_answer"); indicate("incorrect_answers");
    let quAttList = questionList[quNumber].split("☼");

    // sort by difficulty levels.
    if (round <= 5) {
        if (quAttList[3].slice(3, 4) != "e") { // easy
            round--;
            nextQuestion();
            return;
        }
        if (round == 5) quNumber = 0;
    }
    else if (round <= 10) { // medium
        if (quAttList[3].slice(3, 4) != "m") {
            round--;
            nextQuestion();
            return;
        }
        if (round == 10) quNumber = 0;
    }
    else {
        if (quAttList[3].slice(3, 4) != "h") { // hard
            round--;
            nextQuestion();
            return;
        }
    }

    question = quAttList[4].slice(3, quAttList[4].length - 3);

    allAnswers = []; // init the answers of the current question.

    // replace &quot with "
    while (question.indexOf('&quot') > -1) {
        question = question.replace("&quot;", '"');
    }
    // replace &#039; with '
    while (question.indexOf('&#039;') > -1) {
        question = question.replace("&#039;", "'");
    }

    // cheat working
    if (cheat) {
        correctAnswer = "*" + quAttList[5].slice(3, quAttList[5].length - 3);
    }

    else {
        correctAnswer = quAttList[5].slice(3, quAttList[5].length - 3);
    }

    let incorrectAnswers = quAttList[6].slice(2, quAttList[6].length - 0);

    // replace &quot with "
    while (incorrectAnswers.indexOf('&quot') > -1) {
        incorrectAnswers = incorrectAnswers.replace("&quot;", '"');
    }

    // replace &#039; with '
    while (incorrectAnswers.indexOf('&#039;') > -1) {
        incorfrect_answers = incorrectAnswers.replace("&#039;", "'");
    }

    // define an array to the answers and push the wrong answers
    let temp = incorrectAnswers.split('"');

    // ignore openning and ending chars.
    for (let i = 0, j = 0; i < temp.length; i++) {
        if (temp[i] != "," && temp[i] != '}' && temp[i] != '{'
            && temp[i] != ']' && temp[i] != '[' && temp[i] != null) {
            allAnswers[j] = temp[i];
            j++;
        }
    }

    // add the correct answer to the array.
    allAnswers[allAnswers.length] = correctAnswer;
    shuffle(allAnswers);
    openAnswers(correctAnswer, allAnswers, question, false);
}

// get the optional answers and the right one and create a answers table.
// on click reveal the correct answer.
function openAnswers(correctAnswer, answers, question, isFifty) {

    // create question&answer table.
    const table = document.createElement("TABLE");
    table.setAttribute("id", "table");
    table.style.width = "50%";
    table.style.marginLeft = "23%";
    document.body.appendChild(table);

    // in case of using 50/50 lifeline- hide 2 inccorect answer.
    const ansNum = answers.length;
    if (isFifty) {
        let randomNumber = Math.floor(Math.random() * 4);
        while (answers[randomNumber] == correctAnswer) {
            randomNumber = Math.floor(Math.random() * 4);
        }
        for (let i = 0; i < answers.length; i++) {
            if (answers[i] != correctAnswer && i != randomNumber) {
                answers[i] = "-";
            }
        }
    }

    // set question&answes table
    for (let i = 0; i < ansNum + 1; i++) {
        let row = table.insertRow(0);
        let cell = row.insertCell(0);
        cell.setAttribute("id", answers[i]);
        cell.style.width = "600px"; cell.style.textAlign = "center";
        if (i == ansNum) { // question cell
            cell.innerHTML = question;
            cell.className = "text"; cell.style.backgroundColor = "black"; cell.style.color = "orange";
            cell.style.opacity = "100%";
            continue;
        }
        cell.innerHTML = answers[i];
        if (answers[i] == "-") {
            cell.className = "text";
            cell.style.color = "white"
            continue;
        }
        cell.className = "button";

        cell.onclick = function () {
            cell.disabled = true;
            checkAnswer(correctAnswer, this.innerHTML);
        }
    }
}

function checkAnswer(correctAnswer, clickValue) {

    // change global let is_correct if user clicked on the correct answer
    let is_correct = false;
    if (clickValue == correctAnswer) {
        is_correct = true;
        changeElement("round", "write into", "Round:" + round); // update round number

        // play the winning music
        if (round == 15) {
            document.getElementById("music").src =
                "https://www.youtube.com/embed/04854XqcfCY?start=39&autoplay=1";
        }
    }
    else { // red color for wrong answer.
        document.getElementById(clickValue).style.background =
            "linear-gradient(to bottom, red 5%, red 100%)";
    } // orange for correct.
    document.getElementById(correctAnswer).style.background =
        "linear-gradient(to bottom, orange 5%, orange 100%)";
    document.getElementById(correctAnswer).style.color = "black";

    setTimeout(function () {
        clearInterval(cancel);
        changeElement("table", "remove");
        time = "off";

        if (!is_correct) { // in case of wrong.
            endOfGame("lose");
        }

        else if (round == 15) { // in case of winning the big prize
            endOfGame("win")
        }

        else { // game is continue, move to the next screen.
            changeElement("start", "write into", "Next Round");
            changeElement("text", "write into", "Round " + round +
                " is complete <br> You earn " + priceAmount[round] + "$");
            showElements("text", "start", "goAway");
            hideElements("timer", "fifty", "extraTime");
            if (didExtraTimeUsed) { hideElements("noExtraTime") };
            if (didFiftyUsed) { hideElements("noFifty") };

            if (round == 5) { // first "safe place"
                changeElement("text", "concat", "<p style='font-size:28px; color: gold'>This is 'safe place', your "
                    + priceAmount[round] + "$ is guaranteed.<br>Now we start with medium-difficulty questions.</p>");
            }
            if (round == 10) { // second"safe place"
                changeElement("text", "concat", "<p style='font-size:28px; color: gold'>This is 'safe place', your "
                    + priceAmount[round] + "$ is guaranteed.<br>Now we start with high-difficulty questions.</p>");
            }
            if (round == 14) { // before the last question.
                changeElement("text", "concat", "<p style='font-size:28px; color: gold'> OMG! Next round is the one million $ question!!!</p>");
            }
        }
    }, 1000);
}

// create the ending game scrren
function endOfGame(status) {

    // calculate the prize amount.
    if (status != "goAway") {
        if ((round % 5) == 0) round--;
        round = round - (round % 5);
    }

    if (status == "win") {
        isFirst = true;
        changeElement("text", "write into",
            "<p style='font-size:28px; color: gold'>WOW! You are the big winner.<br> What are you going to do with your 1,000,000$ ?</p>");
    }
    else if (status == "goAway") {
        changeElement("text", "write into",
            "<p style='font-size:28px'>Nice! You are not greedy.<br> Your prize is: " + priceAmount[round] + "$</p>");
    }
    else { // case of losing.
        changeElement("text", "write into",
            "<p style='font-size:40px'>Game over! <br> Your prize is: " + priceAmount[round] + "$</p>");
    }

    initNextGame();
}

function initNextGame() {

    hideElements("round", "timer", "goAway", "fifty", "extraTime",
        "noExtraTime", "noFifty", "start", "text");
    changeElement("start", "write into", "Play Again");
    cleanAmountList();

    setTimeout(function () {
        showElements("text", "start", "password");
    }, 500);

    round = 0;
    quNumber = 0;
    time = "off";
    didFiftyUsed = false;
    didExtraTimeUsed = false;
    onLoad(); // loading new questions for the next game.
}

// push the price amounts to the list element 
function setAmountList() {
    for (let i = priceAmount.length - 1; i > 0; i--) {
        const row = document.createElement("li");

        row.appendChild(document.createTextNode(priceAmount[i] + "$"));
        document.getElementById("amountList").appendChild(row);
        row.setAttribute("id", "line" + i);

        if (i % 5 == 0) { // "safe place" 
            row.style.color = "red";
        }
    }
}

// init the amounts list for the next game.
function cleanAmountList() {
    for (let i = 1; i < priceAmount.length; i++) {
        changeElement("line" + i, "backgroundColor", "black");
    }
}

let didFiftyUsed = false; // init global fifty lifeline.
function fiftyFifty() {
    if (didFiftyUsed) { return };

    //check if the question have less than 4 answers
    if (allAnswers.length < 4) {
        alert("There are only 2 answers... 50/50 is too much");
        return;
    }

    didFiftyUsed = true;
    changeElement("table", "remove");
    openAnswers(correctAnswer, allAnswers, question, true);
    showElements("noFifty"); // cannot use 50/50 again.
}

let didExtraTimeUsed = false; // init global extraTime lifeline.
function extraTime() {
    if (didExtraTimeUsed) {
        return;
    }

    // add 30 seconds to the current time.
    clearInterval(cancel);
    time = "off";
    timer(0, parseInt(document.getElementById("timer").innerHTML.
        slice(3, document.getElementById("timer").innerHTML.length)) + 30);

    didExtraTimeUsed = true;
    showElements("noExtraTime"); // cannot use extra time again.
}

let optionToCheat = false; // cheat availability
let cheat = false; // cheat activity.
function password() {
    if (optionToCheat) {
        if (!cheat) {
            changeElement("next", "write into", "Press here to unmark the correct answers");
            changeElement("password massage", "write into", "CHEAT IS RUNNING");
            document.getElementById("password massage").style.color = "green";
            cheat = true;
        }
        else {
            changeElement("next", "write into", "Press here to mark the correct answers");
            changeElement("password massage", "write into", "CHEAT IS NOT RUNNING");
            document.getElementById("password massage").style.color = "red";
            cheat = false;
        }
    }

    else {
        const answer = document.getElementById("text box").value;

        switch (answer) {
            case "yarin": case "YARIN": case "Yarin":
                optionToCheat = true;
                changeElement("next", "write into", "Press here to mark the correct answers");
                changeElement("password massage", "write into", "CHEAT IS NOT RUNNING");
                document.getElementById("password massage").style.color = "red";
                hideElements("text box");
                break;

            default:
                alert("Incorrect name");
                return;
        }
    }
}

// Allocate time for raound.
let cancel;
function timer(minutes, seconds) {
    if (time == "off") {
        time = "on";
        const timer = document.getElementById("timer");
        showElements("timer");
        timer.innerHTML = addPreZeros(minutes) + ":" + addPreZeros(seconds);
        cancel = setInterval(decrementSeconds, 1000);

        // timer going down.
        function decrementSeconds() {
            if (seconds == 0 && minutes > 0) {
                seconds = 59;
                minutes -= 1;
            }

            else if (seconds > 1 || seconds > 0 && minutes > 0) {
                seconds -= 1;
            }

            else if (seconds == 1 && minutes == 0) { // end of time
                timer.innerHTML = "";
                changeElement("table", "remove");
                endOfGame(false);
                clearInterval(cancel);
            }

            //show the timer
            timer.innerHTML = addPreZeros(minutes) + ":" + addPreZeros(seconds);
            document.body.appendChild(timer);
        }
    }
}