# Impersonate

Contract logic and testing for cooperative game play, with an eye towards Dark Forest

`git clone https://github.com/dfdao/impersonate.git`

`npm i` to install dependencies.

see package.json scripts section for common actions

`npx hardhat` to see a list of tasks to run.

`npm test` to run tests. 

Right now, this code simulates a simple game where only the `impersonator` is allowed to increment the count. The `Game` contract inherits from `Impersonate`, which allows the `impersonator` to be changed.  

The tests confirm that the original `owner` can transfer ownership to the `dao` and then play the game as if they are impersonating the dao's address.


