"use strict";
const Alexa = require('alexa-sdk');

var answerButton;
var totalButtons = 4;

const ssmlMediumBreak = "<break time = '0.3s'/>";
var fs = require('fs');

var quizLoc = 0;
var quizScore = 0;

var hasInit = false;
var answerCorrect = false;
var quizQuestions = [];
var maxNumberOfQuestions = 0;
var haveAskedQuestions = false;

var quizAnswers = [];
var currentAnswerId = 0;

var allQuestions;

var playerScores = [0,0,0];
var playerAnswers= [false, false, false];


function readQuestions() {
  allQuestions = JSON.parse(fs.readFileSync('./questionAnswerData.json', 'utf8'));
  for (var question in allQuestions) {
    var actualVal = allQuestions[question];
    quizQuestions.push(actualVal["question"]);
    quizAnswers.push(actualVal["answers"]);
    maxNumberOfQuestions += 1;
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

  'HelloIntent': function() {
    readQuestions();
    this.emit('LaunchRequest');
  },

  'AMAZON.HelpIntent': function() {
    this.response.speak("Hi! Big Quiz is designed to test interactions with a quiz for Alexa <break time = '0.3s' /> \
         This quiz will be focused on history <break time = '0.15s' />  specifically world war 2 germany <break time = '0.3s' />  \
         To answer a quiz question <break time = '0.15s' />  just reply with the letter corresponding to the correct answer <break time = '0.3s' />.\
          To make me ask you a question <break time = '0.15s' />  say Alexa ask Big Quiz for a question ");
    this.emit(":responseReady");
  },

  'AMAZON.StopIntent': function() {
    this.response.speak("");
    this.emit(":responseReady");
  },

  'StartQuizIntent': function() {
    quizLoc = 0;
    quizScore = 0;
    // haveAskedQuestions = false;
    currentAnswerId = 0;
    maxNumberOfQuestions = 0;

    hasInit = true;
    readQuestions();
    this.response.speak("I will now set the quiz for you to be tested! <break time = '0.30s' /> Ask me for a question when you'd like to start");;
    this.emit("NextQuestionIntent");
  },

  'NextQuestionIntent': function() {
    if (hasInit === false) {
      this.emit("StartQuizIntent");
      return;
    }
    if (quizLoc > maxNumberOfQuestions) {
      this.response.speak("You have completed all the questions! Your score is : " + quizScore.toString());
      this.emit(":responseReady");
    }
    quizLoc += 1;
    // haveAskedQuestions = true;
    answerCorrect = false;
    // console.log('Questions asked bool value', haveAskedQuestions);
    
    
    this.response.speak(" Question:  <break time = '0.15s' /> " + quizLoc + "Your question is <break time = '0.4s'/> " + quizQuestions[quizLoc] + "and your choices are : a <break time = '0.3s' />  " + quizAnswers[quizLoc].a + " <break time = '0.15s' />  b <break time = '0.3s' />  " + quizAnswers[quizLoc].b + " <break time = '0.15s' />  and c  <break time = '0.3s' /> \
         " + quizAnswers[quizLoc].c + "<break time = '0.15s' />  you can answer the question right now <break time = '0.15s' />  or tell me when you're ready by saying <break time = '0.15s' /> Alexa, ask big quiz if the answer is a or b or c  <break time = '0.3s' />");
    this.emit(":responseReady");
  },

  'AnswerQuestionIntent': function() {
    // if (haveAskedQuestions === true) {
    //   haveAskedQuestions = false;
      //var userAnswer = this.event.request.intent.slots.this.value;
      //var userAnswer = answerButton;
      //var actualAnswer = quizAnswers[quizLoc].correct;

      //var introText = "You answered " + "<break time = '0.15s' />" + userAnswer + "<break time = '0.15s' /> for question " + quizLoc + " <break time = '0.15s' /> ";

      //console.log("User: " + userAnswer.toString());
      //console.log("actualAnswer: " + actualAnswer.toString());
      
      
      var responseText =  calculatePlayerScores();
      
      console.log("Response text :",responseText )
      
      this.response.speak(responseText);
      playerAnswers= [false, false, false];
      this.emit(":responseReady");
    // } else {
    //   this.response.speak("The question hasn't been asked I think <break time = '0.15s' />  maybe you should say <break time = '0.3s' />  Alexa Ask Big Quiz for the next question <break time = '0.3s' /> ");
    //   this.emit(":responseReady");
    // }

  },

  'Unhandled': function() {
    this.response.speak(" This request does not have any code associated with it! ");
    this.emit(":responseReady");
  },

  'WrongAnswerIntent': function() {
    this.response.speak("");
    // this.response.speak("This is not a valid answer <break time = '0.15s' />  try saying a <break time = '0.15s' />  b or c as the answers");
    this.emit(":responseReady");
  }



};


exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  var data = JSON.parse(JSON.stringify(event, null, 2));
  var timestampButton;
  try {
    if (data.state.reported.buttonPressed > 0) {
      answerButton = decodeButton(data.state.reported.buttonPressed);
      console.log("######## Answer for player #####", data.state.reported.player , " #### IS ### " , answerButton); 
      
      timestampButton = data.timestamp;
    //   if (haveAskedQuestions === true) {
        console.log('Question asked answer processed');
        playerAnswers[(data.state.reported.player) - 1] = checkAnswer(answerButton); // this says whether the answer is true or false.
    //   }
    }
    console.log('Button Event');
    return;
  } catch (err) {
    console.log(err);
    try {
      var alexa = Alexa.handler(event, context);
      alexa.registerHandlers(handlers);
      alexa.execute();
    } catch (err) {
      console.log(err);
      console.log('Not Button Event');
    }
  }
};

function decodeButton(buttonCode) {
  var i;
  var answer = ['a', 'b', 'c', 'd'];
  for (i = 0; i < totalButtons; i++) {
    if (buttonCode & (1 << i)) {
      return answer[i];
    }
  }
}

function checkAnswer(userAnswer) {
  var actualAnswer = quizAnswers[quizLoc].correct;
  console.log("User: " + userAnswer.toString());
  console.log("actualAnswer: " + actualAnswer.toString());
  if (userAnswer.length > 1) {
    userAnswer = userAnswer.charAt(0);
  }

  if (userAnswer.toLowerCase() === actualAnswer.toLowerCase()) {
    answerCorrect = true;
  } else {
    answerCorrect = false;
  }
  return answerCorrect;
}

function calculatePlayerScores(){
    console.log("Calculating player socres! ");
    var numberOfCorrect = 0;
    var stringForWinners = "";
    for(var i = 0; i < playerScores.length ; i++){
    console.log("player answer", playerAnswers[i]);
    if(playerAnswers[i] === true){
        playerScores[i] +=1;
        numberOfCorrect +=1;
        stringForWinners += "Player " + (i+1).toString() + "<break time = '0.15s' />";
      }
    }
    if(numberOfCorrect === playerScores.length){
        var responseTxt = "All players <break time = '0.15s' />  were correct!";
        return responseTxt;
    }
    else if(numberOfCorrect === 0){
        var responseTxt = "All players <break time = '0.15s' /> were wrong!";
        return responseTxt;
    }
    return (stringForWinners +  "<break time = '0.15s' /> were correct");

}