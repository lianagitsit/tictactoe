// TODO: draw condition
// TODO: time delay before computer move
// TODO: scoreboard
// TODO: styling

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

    function clickEvent(){
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

        // no win, and at least one open space; computer can move
        if (!checkForWin() && (playerTurns.length + computerTurns.length < 9)){
            computerMove();
        }

        // no win, and no open spaces; game is a draw
        if (!checkForWin() && (playerTurns.length + computerTurns.length === 9)){
            console.log("DRAW!");
        }
        
    }

    function endGame(){
        // remove all event listeners
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", clickEvent);
        }

        // TODO: clear the board
        // TODO: display message, set the score


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
                        //endGame();
                        //return true;
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
        var openSquares = [];
        for (var i = 0; i < squares.length; i++){
            if ((playerTurns.indexOf(squares[i].id) === -1) && (computerTurns.indexOf(squares[i].id) === -1)){
                openSquares.push(squares[i]);
            }
        }
        var move = openSquares[Math.floor(Math.random()*openSquares.length)];
        move.innerHTML = "O";
        move.removeEventListener("click", clickEvent);
        computerTurns.push(move.id);
        console.log("Computer moves so far: " + computerTurns);
        
        checkForWin();
    }

    for (var i = 0; i < squares.length; i++) {
        //console.log("Loop running! i is " + i);
        //console.log(squares[i]);
        squares[i].addEventListener("click", clickEvent);
        //console.log("Just added an event listener");
    } // squares loop

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