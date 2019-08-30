# SimpleQuiz
A simple starting point for making custom quizzes/tests.

You can view a sample setup here: https://nicolasdeory.github.io/SimpleQuiz
  
  
-

The questions are structured in a flow tree fashion, like follows:

`QUESTION -> n FOLLOW-UPs -> CONCLUSION`

The question tree is a json file consisting on a list of questions. Each question can have one of three possible types:

- `question`: The starting point of the test. When the quiz starts, or when the answer action is `random`, a random question will be selected out of a pool of ones with this type. It has the following structure:
```json
{
        "type": "question",
        "id": "sample-question-1",
        "title": "Sample Question 1",
        "options": 
        [
            { 
                "text": "Answer 1",
                "action": "follow-up-1a|follow-up-1b"
            },
            { 
                "text": "Answer 2",
                "action": "follow-up-2"
            },
            { 
                "text": "Answer 3",
                "action": "random"
            }
        ]
    }
```
`id` is the action ID of the question.  
`title` is the text that will be displayed.  
`options` is a list of one to three possible answers. Each answer has a `text` attribute (the button text), and an `action` attribute.  
This `action` attribute indicates which question is going to appear next, when the corresponding answer is selected.  
Inside this attribute, you should specify the ID of the `follow-up` or `result` to display.  
You can use the `|` token to specify multiple possible outcomes, one of which will be selected at random.  
Alternatively, you can specify `random` for the quiz to switch to a random question (from the pool of items with type `question`).  

- `follow-up`: Functionally identical to `question`, but this type excludes the question from the `question` pool (questions that will be selected at the beginning of the test, or with a `random` action).

- `result`: Conclusion of the quiz. The only button that will appear is "Retry", which selects a random `question` from the pool. It is structured as follows:
```json
{
        "type": "result",
        "id": "conclusion-1",
        "text": "You finished the route 1."
    },
```
`id` is the action ID of the question.
`text` is the text that will appear when the conclusion is reached.


## Progress Bar
A progress bar indicates how much of the quiz question have been explored/reached. When it reaches 100%, a congratulatory message is displayed.
It is important to structure the question tree in a way that it is possible to reach every possible node, in order for 100% to be reachable.

## TODO
- Check for unreachable questions and do not count them towards the 100% achievement.
