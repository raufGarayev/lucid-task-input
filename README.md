Could this project be done with more libraries? Of course! But i believe interviewers would like to see candidate's skills on more pure project.
Otherwise we all use libraries (not bad ones!) to make our work easier and faster.

Note: App calculates only dummy variables, not the variables which comes from the endpoint, because this is how i understood the task.

List of dummy variables:

```bash
    'revenue': 1000,
    'cost': 500,
    'profit': 500,
    'margin': 0.5,
    'growth': 0.2,
    'customers': 100,
    'churn': 0.1,
    'acquisition': 20
```

To run the project locally:

1. Clone this repo.
2. run

```bash
npm i --force
npm run dev
```

We add --force to installation because of version mismatching between react (19) and react-query package.