"use strict";
const Alexa = require('alexa-sdk');
const ssmlMediumBreak = "<break time = '0.3s'/>";
var fs = require('fs');

var quizLoc = 0;
var quizScore = 0;

var hasInit = false;

var quizQuestions = [];
var maxNumberOfQuestions = 1;
var haveAskedQuestions = false;

var quizAnswers = [];
var currentAnswerId = 0;

var allQuestions;


function readQuestions(){
    allQuestions = JSON.parse(fs.readFileSync('./questionAnswerData.json', 'utf8'));
    // console.log(allQuestions);
    for(var question in allQuestions){
        var actualVal = allQuestions[question];
        quizQuestions.push(actualVal["question"]);
        quizAnswers.push(actualVal["answers"]);
    }
    console.log(quizQuestions);
    console.log(quizAnswers);
}

var handlers = {

    'LaunchRequest': function() {
        this.response.speak("Hi! Welcome to Big Quiz! \
        You can ask for help or you can say Alexa, Ask Big Quiz to start quiz ").listen("If you're not sure <break time = '0.15s' />  just ask for help by saying <break time = '0.15s' />  Alexa ask big quiz for help! ");
        this.emit(":responseReady");

    },

    'HelloIntent': function () {
       this.emit('LaunchRequest');
    },

    'AMAZON.HelpIntent': function () {
        this.response.speak("Hi! Big Quiz is designed to test interactions with a quiz for Alexa <break time = '0.3s' /> \
         This quiz will be focused on history <break time = '0.15s' />  specifically world war 2 germany <break time = '0.3s' />  \
         To answer a quiz question <break time = '0.15s' />  just reply with the letter corresponding to the correct answer <break time = '0.3s' />.\
          To make me ask you a question <break time = '0.15s' />  say Alexa ask Big Quiz for a question ");
        this.emit(":responseReady");
    },

    'AMAZON.StopIntent': function () {
        this.response.speak("");
        this.emit(":responseReady");
    },

    'StartQuizIntent': function(){
        quizLoc = 0;
        quizScore = 0;
        hasInit = true;
        readQuestions();
        this.response.speak("I will now set the quiz for you to be tested! <break time = '0.30s' /> Ask me for a question when you'd like to start").listen("You can say <break time = '0.15s' /> Alexa ask big quiz for the next question!");
        this.emit(":responseReady");
    },

    'NextQuestionIntent' : function(){
        if(hasInit === false){
            this.emit("StartQuizIntent");
        }
        if(quizLoc > maxNumberOfQuestions){
            this.response.speak("You have completed all the questions! Your score is : " + quizScore.toString());
            this.emit(":responseReady");
        }
        quizLoc +=1;
        haveAskedQuestions = true;
        this.response.speak("Your question is <break time = '0.4s'/> " + quizQuestions[quizLoc] + "and your choices are : a <break time = '0.3s' />  " + quizAnswers[quizLoc].a + " <break time = '0.15s' />  b <break time = '0.3s' />  " + quizAnswers[quizLoc].b + " <break time = '0.15s' />  and c  <break time = '0.3s' /> \
         " + quizAnswers[quizLoc].c + "<break time = '0.15s' />  you can answer the question right now <break time = '0.15s' />  or tell me when you're ready <break time = '0.3s' />" ).listen();
        this.emit(":responseReady");
    },

    'AnswerQuestionIntent': function(){
        if(haveAskedQuestions === true){
            haveAskedQuestions = false;
            console.log(this); 
            var userAnswer = this.event.request.intent.slots.this.value;
            var actualAnswer = quizAnswers[quizLoc].correct;
          
            if(userAnswer === actualAnswer){
                this.response.speak("You're right! You have gained one point <break time = '0.3s' /> " + " <break time = '0.15s' /> If you would like to continue <break time='0.15s' />  ask me for another question").listen();
                quizScore +=1;
                this.emit(":responseReady");
            }
            else {
                this.response.speak(" You are wrong <break time = '0.15s' /> you have not gained any points <break time = '0.3s' /> . The answer is " + (quizAnswers[quizLoc].actualAnswer) + " <break time = '0.15s' /> If you would like to continue <break time='0.15s' />  ask me for another question").listen();
                this.emit(":responseReady");
            }
        }
        else
        {
            this.response.speak("The question hasn't been asked I think <break time = '0.15s' />  maybe you should say <break time = '0.3s' />  Alexa Ask Big Quiz for the next question <break time = '0.3s' /> ");
            this.emit(":responseReady");
        }
        this.response.speak("The question hasn't been asked I think <break time = '0.15s' />  maybe you should say <break time = '0.3s' />  Alexa Ask Big Quiz for the next question <break time = '0.3s' /> ");
        this.emit(":responseReady");
    },

    'Unhandled': function(){
        this.response.speak(" This request does not have any code associated with it! ");
        this.emit(":responseReady");
    },

    'WrongAnswerIntent': function(){
        this.response.speak("This is not a valid answer <break time = '0.15s' />  try saying a <break time = '0.15s' />  b or c as the answers");
        this.emit(":responseReady");
    }

    

};


exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};