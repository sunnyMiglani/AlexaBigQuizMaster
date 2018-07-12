import json;
import os;


'''
Steps : 
1. Read the current file of quesitons if available
2. If not, create a new file
3. To this object now containing the information of that file, we write new quesitons into a particular format.
4. This format is defined as :
    > 
        Questions = {1: "Am I working?", 2: "Is this absolutely painful?"}; 
        Answers = { 1: { a: "yes", b: "no", c: "maybe", answer: "a" }, 2: { a: "yes", b: "no", c: "maybe", answer: "c" }};
    > 
    Essentially the system is, for questions we have a list of questions
    for answers we have a list of answers corresponding to the question with a set number of ALWAYS 3 options, and we input what the correct option is as well.
    
5. We now need to wait for user input for the question, then answer "a", "b", "c" and then finally the correct answer value (a||b||c).
6. Once we finish input, we write all the objects into the file and it's uploaded to the cloud to save questions as well.

'''

currentQuestionsInFile = [];


def returnJsonObj(question, answerA, answerB, answerC, correctId):
    questionsDict = {};
    questionsDict["question"] = {}
    questionsDict["answers"] = {};
    questionsDict["question"] = question;
    questionsDict["answers"]["a"] = answerA ;
    questionsDict["answers"]["b"] = answerB;
    questionsDict["answers"]["c"] = answerC;
    questionsDict["answers"]["correct"] = correctId;

    return questionsDict;

def interactiveQuestion():
    shouldLeave = False;
    listOfQuestions = [];

    while(shouldLeave == False):
        question = input("Please enter the question: ");
        answerA = input("Please enter answer A : ");
        answerB = input("Please enter answer B : ");
        answerC = input("Please enter answer C : ");
        correct = input("Please enter which option in a,b,c is the correct answer : ");
        while(correct not in ["a", "b", "c", "A", "B", "C"]):
            correct = input("That's not a valid choice, please enter either a, b or c: ");
        listOfQuestions.append(returnJsonObj(question,answerA, answerB, answerC, correct));

        choice = input("Please say YES if you have more questions to add, else say NO: ");
        if(choice in ["yes", "YES"]):
            shouldLeave = False;
        else:
            shouldLeave = True;

    return listOfQuestions;

    


currentQuestionsInFile = []
someQuestions = []
with open('questionAnswerData.json', 'r') as questionFile:
    if(os.stat("questionAnswerData.json").st_size != 0 ):
        someQuestions = json.load(questionFile);
        
if(someQuestions != []):
    currentQuestionsInFile.append(someQuestions);

getQuestionsList = interactiveQuestion();

currentQuestionsInFile.append(getQuestionsList);

with open('questionAnswerData.json', 'w+') as questionFile:
    json.dump(currentQuestionsInFile, questionFile);

print("--- Goodbye from Alexa Quiz helper! ---");