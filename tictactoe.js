// TODO: computer strategy
// BONUS: two players?

$(document).ready(function () {

    // could this be tighter with an object?
    var topL = document.getElementById("top-L");
    var topM = document.getElementById("top-M");
    var topR = document.getElementById("top-R");
    var midL = document.getElementById("mid-L");
    var midM = document.getElementById("mid-M");
    var midR = document.getElementById("mid-R");
    var bottomL = document.getElementById("bottom-L");
    var bottomM = document.getElementById("bottom-M");
    var bottomR = document.getElementById("bottom-R");

    // array of DOM nodes for the board
    var squares = [topL, topM, topR, midL, midM, midR, bottomL, bottomM, bottomR];

    var playerTurns = [];
    var computerTurns = [];
    var winCombos = [["top-L", "top-M", "top-R"], ["mid-L", "mid-M", "mid-R"],
                    ["bottom-L", "bottom-M", "bottom-R"], ["top-L", "mid-L", "bottom-L"],
                    ["top-M", "mid-M", "bottom-M"], ["top-R", "mid-R", "bottom-R"],
                    ["top-L", "mid-M", "bottom-R"], ["top-R", "mid-M", "bottom-L"]];

    var whoseTurn;
    var playerSymbol;
    var compSymbol;

    // matches to win per series before reset
    const GAME_WIN = 3;

    // toggles lock from player clicks during timeout before computer move
    var lockout = false;

    //initializes scoreboard
    var playerScore = 0;
    var compScore = 0;
    var playerScoreBoard = document.getElementById("player-score");
    var compScoreBoard = document.getElementById("comp-score");


    // sets game end message
    var message = document.getElementById("message");

    // access space-savers object
    // an array of dom nodes that are all spans
    var savers = document.getElementsByClassName("saver");

    // toggles play again button
    var playAgainButton = document.getElementById("play-again");

    var firstMatch;

    // called at the end of each match and before the next
    function activateBoard(){
        lockout = false;

        // clear the match outcome message
        message.innerHTML = "Best 2 out of 3 WINS!"; 

        // add event listeners to each square
        for (var i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", playerMove);
        } 
    }

    // resets the game after a series win
    function playAgain(){

        firstMatch = true;

        // reset scoreboard
        playerScore = 0;
        compScore = 0;
        playerScoreBoard.innerHTML = playerScore;
        compScoreBoard.innerHTML = compScore;

        reset();

        // hide play again button
        playAgainButton.style.visibility = "hidden";
    }

    // allow player to choose X or O
    function assignX() {
        playerSymbol = "X";
        compSymbol = "O";
        topL.removeEventListener("click", assignX);
        topR.removeEventListener("click", assignO);
        document.getElementById("x").style.visibility = "hidden";
        document.getElementById("o").style.visibility = "hidden";
        reset();
    }

    function assignO(){
        playerSymbol = "O";
        compSymbol = "X";    
        topL.removeEventListener("click", assignX);
        topR.removeEventListener("click", assignO);
        document.getElementById("x").style.visibility = "hidden";
        document.getElementById("o").style.visibility = "hidden";
        reset();   
    }

    function playerMove(){
        // if locked out, function does not execute
        if (lockout === true){
            return;
        }
        whoseTurn = 1;
        
        this.innerHTML = "<span class=\"player-color\">" + playerSymbol + "<\/span>";
        playerTurns.push(this.id);
        this.removeEventListener("click", playerMove);

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
            message.innerHTML = "It's a DRAW!";
            endGame();
        }
        
    }

    function endGame(){
        // deactivate board by removing all event listeners
        for (var i = 0; i < squares.length; i++) {
            squares[i].removeEventListener("click", playerMove);
        }

        // do not clear the board if there has been a game win
        if (playerScore === GAME_WIN || compScore === GAME_WIN){
            return;
        } else {
            // clear the board
            setTimeout(reset, 1500);
        }
    }

    function chooseSymbol() {
        message.innerHTML = "Choose X or O!<br />(X moves first)";

        // DOM traversal to access first child of a saver span and add the x and o id back
        topL.firstChild.setAttribute("id", "x");
        topL.firstChild.innerHTML = "X";
        topR.firstChild.setAttribute("id", "o");
        topR.firstChild.innerHTML = "O";
        
        // reset board and allow player symbol choice
        topL.addEventListener("click", assignX);
        topR.addEventListener("click", assignO);

        firstMatch = false;
    }

    function reset() {
        // clear the player and computer move logs
        playerTurns = [];
        computerTurns = [];

        // reset the squares
        for (var i = 0; i < squares.length; i++){
            squares[i].innerHTML = "<span class=\"saver\">.<\/span>";
            squares[i].classList.remove("wincolor");
        }

        // if this is the first match after a series win, let player choose symbol 
        if (firstMatch === true){
            chooseSymbol();
            return;
        // if this is the nth match in a series, play resumes as normal
        } else {
            // if player chose O, computer goes first
            if (playerSymbol === "O"){
                setTimeout(computerMove, 1000);
                activateBoard();
            } else {
                setTimeout(activateBoard, 500);
            }
        }
    }

    function checkForWin(){
        // set comparison array to player or computer moves
        var myArray;
        if (whoseTurn === 1){
            myArray = playerTurns;
        } else {
            myArray = computerTurns;
        }

        // compare this array to winning combinations
        for (var combo = 0; combo < winCombos.length; combo++) {
            var count = 0;
            for (var win = 0; win < winCombos[combo].length; win++){

                // if a winning move is in this array, count it
                if (myArray.indexOf(winCombos[combo][win]) !== -1){
                    count += 1;

                    // if this array has a winning combination, display appropriate win message
                    if (count === 3){
                        // style this combo to highlight winning squares
                        for (var i = 0; i < winCombos[combo].length; i++){
                            document.getElementById(winCombos[combo][i]).classList.add("wincolor");                           
                        }
                        
                        // if it's the player's turn, update player's score
                        if (whoseTurn === 1){
                            playerScore += 1;
                            playerScoreBoard.innerHTML = playerScore;                                                    
                            // if player has won three matches, display WIN message
                            if (playerScore === GAME_WIN){
                                message.innerHTML = "<span class=\"game-over flash\">YOU WIN! GAME OVER!<\/span>";
                                playAgainButton.style.visibility = "visible";
                            } 

                        // if it's the computer's turn, update computer's score
                        } else if (whoseTurn === 0) {
                            compScore += 1;
                            compScoreBoard.innerHTML = compScore;                                    
                            // if computer has won three matches, display LOSE message
                            if (compScore === GAME_WIN){
                                message.innerHTML = "<span class=\"game-over flash\">YOU LOSE! GAME OVER!<\/span>";
                                playAgainButton.style.visibility = "visible";
                            }
                        }
                        endGame();
                        return true;
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

        // build array of open squares by checking the board against the move logs
        var openSquares = [];
        for (var i = 0; i < squares.length; i++){
            if ((playerTurns.indexOf(squares[i].id) === -1) && (computerTurns.indexOf(squares[i].id) === -1)){
                openSquares.push(squares[i]);
            }
        }

        // choose a random open square and place the O
        var move = openSquares[Math.floor(Math.random()*openSquares.length)];
        move.innerHTML = "<span class=\"comp-color\">" + compSymbol + "<\/span>";

        // deactivate that square
        move.removeEventListener("click", playerMove);

        // log the move
        computerTurns.push(move.id);

        // unlock the board for the player
        lockout = false;
        
        checkForWin();
    }
    
    // Begin the game! 
    playerScoreBoard.innerHTML = playerScore;
    compScoreBoard.innerHTML = compScore;

    message.classList.add("main");

    topL.addEventListener("click", assignX);
    topR.addEventListener("click", assignO);

    playAgainButton.addEventListener("click", playAgain);
    

}); 
