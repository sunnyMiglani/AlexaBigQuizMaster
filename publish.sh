# A script to only deploy lambda code, instead of deploying via ask cli 
rm index.zip 
cp questionAnswerData.json lambda_data/
cd lambda_data

zip  -R -X -g ../index.zip '*.json' 'node_modules/' '*.js' '*.txt'
cd ..
echo --ZIP DONE--
aws lambda update-function-code --function-name alexaQuizSimple --zip-file fileb://index.zip
echo -- Uploaded! --
