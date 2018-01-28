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
	[x] Implement codesmells tasks
        [x] Callc code smells from the commit history
        [x] Indentify start and end of code smells
	[x] Test
        [x] Fix the tests of Project analiser
    [x] Add post processor on the tasks
    [x] Add a mult project command line option to run in serie
    [x] Add a progress log log the % of commits procesed already 
    [ ] Create the command-line tool documentation
    [x] Create the language agnostic task executor
    [ ] Create a demo video how to use the tool with node and with another language
    [x] Check fatal when project do not exists
    [x] Finish the commits page
    [x] Improve UI 
        [x] Improve updateProjectState method on Home screen (sort of a requests overflow)
    [x] Restore processing after failure
    [ ] Reduces data trafic of the commits check
    [ ] Pretty good citation https://dibt.unimol.it/staff/fpalomba/documents/C4.pdf
    [x] Find tool to check code metrics
    [x] Add a tool in Java for https://github.com/mauricioaniche/ck
    [ ] Add a start end filter on commits miner
    [ ] Add a timeou on the tasks
    [ ] Add feature to remove projects from list
    [ ] Compare with https://github.com/mauricioaniche/repodriller
    [x] Add retry when task failure
    [ ] Add retry and time to try as a configuratio
    [ ] Add config to the task to choose the number of commits to process at the same time
    [ ] Add config to the task if it need the Add retry and time to try as a configuratio
    [ ] Add config to the task to choose the number of commits to process at the same time
    [ ] Add config to the task if it need the commit folder to be externall