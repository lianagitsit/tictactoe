// TODO: scoreboard
// TODO: styling
// TODO: computer strategy

$(document).ready(function () {
    console.log("Okay I'm ready");

    var topL = document.getElementById("top-L");
    var topM = document.getElementById("top-M");
    var topR = document.getElementById("top-R");
    var midL = document.getElementById("mid-L");
    var midM = document.getElementById("mid-M");
    var midR = document.getElementById("mid-R");
    var bottomL = document.getElementById("bottom-L");
    var bottomM = document.getElementById("bottom-M");
    var bottomR = document.getElementById("bottom-R");

    var squares = [topL, topM, topR, midL, midM, midR, bottomL, bottomM, bottomR];

    var playerTurns = [];
    var computerTurns = [];
    var winCombos = [["top-L", "top-M", "top-R"], ["mid-L", "mid-M", "mid-R"],
                    ["bottom-L", "bottom-M", "bottom-R"], ["top-L", "mid-L", "bottom-L"],
                    ["top-M", "mid-M", "bottom-M"], ["top-R", "mid-R", "bottom-R"],
                    ["top-L", "mid-M", "bottom-R"], ["top-R", "mid-M", "bottom-L"]];

    var whoseTurn;
    // toggles lock from player clicks during timeout before computer move
    var lockout = false;

    function clickEvent(){
        // if locked out, function does not execute
        if (lockout === true){
            return;
        }
        whoseTurn = 1;
        console.log("Player turn: " + whoseTurn);
        // use 'this' to know which element to modify. if you use squares[i] you'll get a bug, 
        // because this closure stores the reference to squares[i] and not the value itself; 
        // i disappears when the loop ends, so the ref is undefined
        this.innerHTML = "X";
        //console.log("I got clicked!" + this.id);
        playerTurns.push(this.id);
        console.log("PLayer turns so far: " + playerTurns);
        this.removeEventListener("click", clickEvent);

        // lock the board from clicks after player's move
        lockout = true;

        // no win, and at least one open space; computer can move
        var wasThereAWin = checkForWin();
        if (!wasThereAWin && (playerTurns.length + computerTurns.length < 9)){
            // time delay before computer move, final to be ~2000?
            setTimeout(computerMove, 1000);
        }

        // no win, and no open spaces; game is a draw
        if (!wasThereAWin && (playerTurns.length + computerTurns.length === 9)){
            console.log("DRAW!");
            endGame();
        }
        
    }

    function endGame(){
        // deactivate board by removing all event listeners
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", clickEvent);
        }
        console.log("game over");

        // clear the board
        setTimeout(clearBoard, 3000);

        // TODO: display message, set the score

    }

    function clearBoard() {
        // clear the squares
        for (var i = 0; i < squares.length; i++){
            squares[i].innerHTML = "";
        }

        // clear the player and computer move logs
        playerTurns = [];
        computerTurns = [];

        // reset the game
        setTimeout(gamePlay, 3000);
    }

    function checkForWin(){
        // set array to player or computer moves
        var myArray;
        if (whoseTurn === 1){
            myArray = playerTurns;
        } else {
            myArray = computerTurns;
        }
        var track;
        // compare this array to winning combinations
        for (var combo = 0; combo < winCombos.length; combo++) {
            track = 0;
            for (var win = 0; win < winCombos[combo].length; win++){
                // if a winning move is in this array, track it
                if (myArray.indexOf(winCombos[combo][win]) !== -1){
                    track += 1;
                    // if this array has a winning combination, display appropriate win message
                    if (track === 3){
                        if (whoseTurn === 1){
                            console.log("YOU WIN!");
                            endGame();
                            return true;
                        } else if (whoseTurn === 0) {
                            console.log("COMPUTER WINS!");
                            endGame();
                            return true;
                        }
                    }
                } else {
                    break;
                }
            }
        }
        return false;
    }

    function computerMove(){
        whoseTurn = 0;
        console.log("Computer move " + whoseTurn);

        // build array of open squares by checking the board against the move logs
        var openSquares = [];
        for (var i = 0; i < squares.length; i++){
            if ((playerTurns.indexOf(squares[i].id) === -1) && (computerTurns.indexOf(squares[i].id) === -1)){
                openSquares.push(squares[i]);
            }
        }

        // choose a random open square and place the O
        var move = openSquares[Math.floor(Math.random()*openSquares.length)];
        move.innerHTML = "O";

        // deactivate that square
        move.removeEventListener("click", clickEvent);

        // log the move
        computerTurns.push(move.id);
        console.log("Computer moves so far: " + computerTurns);

        // unlock the board for the player
        lockout = false;
        
        checkForWin();
    }
    
    function gamePlay(){
        console.log("game is ready to play");
        lockout = false;
        for (var i = 0; i < squares.length; i++) {
            //console.log("Loop running! i is " + i);
            //console.log(squares[i]);
            squares[i].addEventListener("click", clickEvent);
        } 
        return true;
    }

    gamePlay();

}); // document ready



        
    // old code wtf 
    /*var track = 0;
    for (var turn = 0; turn < playerTurns.length; turn++){
        for (var combo = 0; combo < winCombos.length; combo++) {
            console.log("Moving onto next combo...");
            //for (var win = 0; win < winCombos[combo].length; win++) {
                if (playerTurns[turn] === winCombos[combo]) {
                    // player’s move exists in winning combo
                    track += 1;
                    console.log("Winning moves so far: " + track);
                    if (track === 3) {
                        console.log("SUCCESS GAME OVER!");
                        break;
                    } // game win conditional
                } // move success conditional
            //} // winning moves loop 
        } // winCombos loop
    }*/ // playerTurns loop