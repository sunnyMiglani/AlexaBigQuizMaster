# AlexaBigQuizMaster

Alexa BIG Quiz master is an app created to use a set of questions and answers in quiz format to test interaction with sight impaired students in schools.

The structure of the quiz is multiple choice so it can easily implement button clicks and patterns to interact with the system, and does not depend on a relatively easier True/False system.

## Flow of the program

Flow of the program involves:
1.  Creating the quiz format using the `questions_read_write.py` file.
2.  Sending / Uploading the file to AWS Lambda including the `questionAnswerData.json` file.
3.  Using the front end interaction model to interact with the app on Alexa.

### **For Step 1:**
The program shall look for a file called `questionAnswerData.json` and take in the current JSON format into memory (to make it easier to write out in a structured format). The program will then ask the users for a question and the **THREE** possible answers, in the order a->b->c. 

This is then stored with the a,b,c equivalent into the system and saved into the file as a JSON structure defined in the file itself.

# Alexa App Interaction
### Invocation:
To use the app, the user must say `Alexa, Ask Big Quiz ...` where `...` is the command.

To get a list of commands or how to interact with the app, the user can say `Alexa, Ask Big Quiz for help`.

The list of commands are as follows:
1. `Ask Big Quiz for Help` : The app explains what it's made for and how to interact with it.
2. `Ask Big Quiz to ask me a question`: The quiz master will ask you a question from the JSON file, usually in order (not random) and expect an answer back either instantly or using the next command
3. `Ask Big Quiz is the answer <a,b,c>`: The options a,b,c will correspond to the question, **Must be aware that you cannot reply with the answer, it has to be the option**. For example, if the options are Hitler, Germany or War, you must reply A for Hitler, B for Germany or C for war instead of replying Hitler, Germany or War.
4. `Ask Big Quiz to reset the quiz`: This is to reset the quiz incase something has gone wrong or to retest interactions. This resets all variables in the backend to their initial values.

### Flow:

The flow of the program is relatively plain, the program shall wait for an instruction for a question / starting quiz / resetting quiz to initialise the variables.

There is a check in the program that checks to see if the quiz has been initialised (as in the program has read in the Questions and Answers from the JSON file) before the program can ask questions. If the user asks for a question before initialisation, then the program initialises and expects the user to repeat the request for a question


## Extension / Bugs:

1. A much needed extension to the app would be the ability to get Alexa to repeat the current question, and possibly make it slower this time.


2. Send the questions through an [Alexa Speech Helper as available in the repository on speaking](https://github.com/sunnyMiglani/AlexaSpeakingTest) to make them more understandable for the users as right now alexa seems to ignore grammar in the questions. 

3. Allow users to check current score at any point / include it in the questions being asked.

4. BUG: The user can say `A` but alexa might hear it as `Hey` and consider the answer incorrect, a solution for this is to simply add a check that says if (~ any form of hey/Hey/HEY ~) : answer = A.

5. BUG: At some point the program might lose track of how many questions have been done, and might repeat questions, a simple system to keep track of this is to use the JSON file to have a tag that says number of questions completed. Make sure to reset this whenever the program ends.

This can be done using the EndOfSessionIntent (official name unknown) that exists in Alexa's requests.



## About / Support

Project was made in association with the Bristol Interaction Group, as part of a research project looking into using smart devices such as Alexa to create a more inclusive learning system for sight impaired students in classes. This app in particular was created as a base to test interaction for MCQ based quizes, where button inputs and other non vocal inputs could be tested. 

For support, contact [Sunny Miglani](github.com/sunnymiglani). 

