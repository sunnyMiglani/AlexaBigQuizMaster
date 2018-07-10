"use strict";
const Alexa = require('alexa-sdk');
const ssmlMediumBreak = "<break time = '0.3s'/>";


var handlers = {

    'LaunchRequest': function () {
        this.response.speak("Hi! Welcome to the Big quiz! <break time = '0.3s' /> \
         This program is designed to test interactions with alexa in a quiz format <break time = '0.3s' /> \
          To get instructions <break time = '0.15s' />  say Alexa ask Big Quiz for help <break time = '0.15s' />  \
          or to start the quiz say Alexa <break time = '0.15s' />  ask big quiz to start quiz");
        this.emit(':responseReady');
    },

    'HelloIntent': function () {
       this.emit('LaunchRequest');
    },

    'AMAZON.HelpIntent': function () {
        this.response.speak("Hi! Big Quiz is designed to test interactions with a quiz for Alexa <break time = '0.3s' /> \
         This quiz will be focused on history <break time = '0.15s' />  specifically world war 2 germany <break time = '0.3s' />  \
         To answer a quiz question <break time = '0.15s' />  just reply with the letter corresponding to the correct answer <break time = '0.3s' /> ");
        this.emit(":responseReady");
    },

    'AMAZON.StopIntent': function () {
        this.response.speak("Bye from Big Quiz!");
        this.emit(":responseReady");
    },

};


exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};