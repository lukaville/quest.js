//console.log(generateQuest(making));

function generateQuest(making) {
    cryptedQuestion = "-";
    var questionObject;
    for (i = making.length - 1; i >= 0; i--) {
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

    html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + question + '</div><div class="quiz-answer"><input class="answer" type="text" /><button class="quiz-button" onclick="answerQuestion('+ index +');">Проверить</button></div></div>';

    questionsDiv.append(html);
}

function startQuest() {
    addQuestionDiv(quest.heading, quest.question, quest.questionIndex);
}

function answerQuestion(index) {
    questionDiv = $("#questions").find(".quiz")[index];
    answerInput = $(questionDiv).find(".answer")[0];
    key = answerInput.value;

    try {
        text = GibberishAES.dec(quest.nextQuestion, key);

        if (text == "WIN") {
            alert("Победа!");
        } else {
            quest = JSON.parse(GibberishAES.dec(quest.nextQuestion, key));
            //$(questionDiv).find(".answer")[0].find(".quiz-button").attr('disabled','disabled');
            addQuestionDiv(quest.heading, quest.question, quest.questionIndex);
        }
        
    } catch(error) {
        alert("Неправильный ответ!");
    }
}

startQuest();