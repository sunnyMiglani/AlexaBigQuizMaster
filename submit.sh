## Script that only uploads files when needed, doesn't need to zip ##
echo -- Uploading to AWS Servers ---
aws lambda update-function-code --function-name myTestFunctionTwo --zip-file fileb://index.zip
echo "-- Upload Done! --"
