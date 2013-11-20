var Quest = function(quest) {
    this.currentQuestion = quest.questions;

    var questionsDiv = $("#questions");

    var answeredQuestionNumber = 0;

    var thisObject = this;

    // Change title, subtitle and footer
    $("header > h1")[0].innerHTML = quest.title;
    $("header > h4")[0].innerHTML = quest.subtitle;
    $("footer")[0].innerHTML = quest.footer;

    this.generateQuest = function(making) {
        var cryptedQuestion = GibberishAES.enc(JSON.stringify(making[making.length - 1]), making[making.length - 2].answer);
        for (i = making.length - 2; i >= 0; i--) {
            var questionObject = {
                heading: making[i].heading,
                question: making[i].question,
                nextQuestion: cryptedQuestion,
                questionIndex: i
            }
            cryptedQuestion = GibberishAES.enc(JSON.stringify(questionObject), making[i].answer);
        }
        return JSON.stringify(questionObject);
    }

    this.startQuest = function() {
        addQuestionDiv(this.currentQuestion.heading, this.currentQuestion.question, this.currentQuestion.questionIndex);
    }

    function updateProgressBar() {
        $("#progress").width((answeredQuestionNumber)/quest.questionNumber*680);
    }

    function addQuestionDiv(heading, question, index) {
        var html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + question + '</div><div class="quiz-answer"><input class="quiz-answer-input" onkeyup="" type="text" /><button class="quiz-button">' + quest.checkButtonMessage + '</button></div></div>';

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
        var html = '<div class="quiz"><div class="quiz-heading">' + heading + '</div><div class="quiz-content">' + message + '</div></div>';

        questionsDiv.append(html);
    }

    this.answerQuestion = function(questionIndex) {
        var questionDiv = $(questionsDiv).find(".quiz")[questionIndex];
        var answerInput = $(questionDiv).find(".quiz-answer-input")[0];
        var key = answerInput.value;

        try {

            this.currentQuestion = JSON.parse(GibberishAES.dec(this.currentQuestion.nextQuestion, key));

            if (typeof(this.currentQuestion.nextQuestion) == "undefined") {
                answeredQuestionNumber++;

                var winBlock = this.currentQuestion;

                // Disable entering
                $(questionDiv).find(".quiz-button").attr('disabled','disabled');
                $(questionDiv).find(".quiz-answer-input").attr('disabled','disabled');

                // Show win block
                addWinDiv(winBlock.heading, winBlock.question);

            } else {
                // Disable entering
                $(questionDiv).find(".quiz-button").attr('disabled','disabled');
                $(questionDiv).find(".quiz-answer-input").attr('disabled','disabled');

                answeredQuestionNumber++;

                addQuestionDiv(this.currentQuestion.heading, this.currentQuestion.question, this.currentQuestion.questionIndex);
            }
        } catch(error) {
            alert(quest.wrongAnswerMessage);
        }

        updateProgressBar();
    }
}