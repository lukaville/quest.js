//console.log(generateQuest(making));

var Quest = function(quest) {
    var currentQuestion = quest.questions;
    var questionsDiv = $("#questions");

    thisObject = this;

    this.generateQuest = function(making) {
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

    this.startQuest = function() {
        addQuestionDiv(currentQuestion.heading, currentQuestion.question, currentQuestion.questionIndex);
    }

    function addQuestionDiv(heading, question, index) {
        var html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + question + '</div><div class="quiz-answer"><input class="quiz-answer-input" onkeyup="" type="text" /><button class="quiz-button">Проверить</button></div></div>';

        var questionDiv = questionsDiv.append(html);

        $(questionsDiv).find(".quiz-button")[index].onclick = function() {
            thisObject.answerQuestion(index);
        };

        $(questionsDiv).find(".quiz-answer-input")[index].onkeyup = function(event) {
            if (event.keyCode == 13) thisObject.answerQuestion(index);
        };

        
        inputs = questionsDiv.find("input");
        inputs[inputs.length-1].focus();
    }

    function addWinDiv(heading, message) {
        html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + message + '</div></div>';

        questionsDiv.append(html);
    }

    this.answerQuestion = function(questionIndex) {
        var questionDiv = $(questionsDiv).find(".quiz")[questionIndex];
        answerInput = $(questionDiv).find(".quiz-answer-input")[0];
        key = answerInput.value;

        try {
            currentQuestion = JSON.parse(GibberishAES.dec(currentQuestion.nextQuestion, key));

            try {
                winBlock = JSON.parse(currentQuestion.nextQuestion);

                // Disable entering
                $(questionDiv).find(".quiz-button").attr('disabled','disabled');
                $(questionDiv).find(".quiz-answer-input").attr('disabled','disabled');

                // Show win block
                addWinDiv(winBlock.heading, winBlock.question);

            } catch(error) {

                // Disable entering
                $(questionDiv).find(".quiz-button").attr('disabled','disabled');
                $(questionDiv).find(".quiz-answer-input").attr('disabled','disabled');

                addQuestionDiv(currentQuestion.heading, currentQuestion.question, currentQuestion.questionIndex);
            }
        } catch(error) {
            alert("Неправильный ответ!");
        }
    }
}