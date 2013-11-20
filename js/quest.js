//console.log(generateQuest(making));

function generateQuest(making) {
    cryptedQuestion = JSON.stringify(making[making.length - 1]);
    var questionObject;
    for (i = making.length - 2; i >= 0; i--) {
        questionObject = {
            heading: making[i].heading,
            question: making[i].question,
            nextQuestion: cryptedQuestion,
            questionIndex: (i)
        }
        cryptedQuestion = GibberishAES.enc(JSON.stringify(questionObject), making[i].answer);
    }
    return JSON.stringify(questionObject);
}

function addQuestionDiv(heading, question, index) {
    questionsDiv = $("#questions");

    html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + question + '</div><div class="quiz-answer"><input class="answer" onkeyup="if (event.keyCode == 13) answerQuestion(this)" type="text" /><button class="quiz-button" onclick="answerQuestion(this);">Проверить</button></div></div>';

    questionsDiv.append(html);
    inputs = questionsDiv.find("input");
    inputs[inputs.length-1].focus();
}

function addWinDiv(heading, message) {
    questionsDiv = $("#questions");

    html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + message + '</div></div>';

    questionsDiv.append(html);
}

function startQuest() {
    addQuestionDiv(quest.heading, quest.question, quest.questionIndex);
}

function answerQuestion(button) {
    var questionAnswerDiv = $(button).parent()[0];
    answerInput = $(questionAnswerDiv).find(".answer")[0];
    key = answerInput.value;

    try {
        quest = JSON.parse(GibberishAES.dec(quest.nextQuestion, key));
        console.log(JSON.stringify(quest));

        try {
            winBlock = JSON.parse(quest.nextQuestion);

            // Disable entering
            $(questionAnswerDiv).find(".quiz-button").attr('disabled','disabled');
            $(questionAnswerDiv).find(".answer").attr('disabled','disabled');

            // Show win block
            addWinDiv(winBlock.heading, winBlock.question);

        } catch(error) {

            // Disable entering
            $(questionAnswerDiv).find(".quiz-button").attr('disabled','disabled');
            $(questionAnswerDiv).find(".answer").attr('disabled','disabled');
            addQuestionDiv(quest.heading, quest.question, quest.questionIndex);
        }
    } catch(error) {
        console.log(error);
        alert("Неправильный ответ!");
    }
}

startQuest();