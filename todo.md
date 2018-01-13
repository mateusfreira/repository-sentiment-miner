# Basic
Input project list (json)
Output
	JSON
Tasks
    [x] PMD metrics
# Todo
	[x] Paralelous processing of commits but a queue of commits cloning -> Done
	[x] Checkout a limited number of commits
       		[x] Add a coordinator do the commits processing
		[x] Checkout n +1 commits while waiting for them to be processed
	[x] Implement output options and extentions
	[ ] Implement codesmells tasks
        [x] Callc code smells from the commit history
        [ ] Indentify start and end of code smells
	[x] Test
        [x] Fix the tests of Project analiser
    [x] Add post processor on the tasks
    [x] Add a mult project command line option to run in serie
    [x] Add a progress log log the % of commits procesed already 
    [ ] Create the command-line tool documentation
    [ ] Create the language agnostic task executor
    [ ] Create a demo video how to use the tool with node and with another language
