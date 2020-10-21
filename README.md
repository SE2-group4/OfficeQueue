# Office Queue

# Usage
**How to**

run the project

Once you clone the repository, run the following commands

```
cd code/backend
npm install
node server.js
node server.js --test //for running tests
```
to start the back-end server; meanwhile, starting back from the repository in another command line terminal, run the following commands

```
cd code/frontend
npm install
npm start
```
to start the front-end application.

**How to**

run the API tests

**Note:** the module *newman* must be installed before use. The server must be running with the option --test
```
cd ./code/backend/tests
newman run ./test_api -g ./test_globals
```

# Timesheet 

shared doc: https://docs.google.com/spreadsheets/d/1BhAylhX6DKVsiF553WJ_e5kOh3fLocSAoIg1Q5QpHeI

