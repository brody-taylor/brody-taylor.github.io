function createBoard() {
    /**
     * Creates and displays an empty board.
     * @returns {GameBoard} Returns the board.
     */

    // calculates board dimensions based on window size
    let columns = 75;
    let width = document.body.clientWidth;
    let header = document.getElementById("header").offsetHeight;
    let height = window.innerHeight - header;
    let size = width/columns;
    let rows = Math.floor(height/size);

    // number of rows must be odd
    if (rows % 2 === 0) {
        rows ++;
    }

    // creates and adds an empty game board to the app root
    let board = new GameBoard(rows, columns);
    let root = document.getElementById("app");
    let disp = board.getDisplay();
    disp.style.height = height.toString() + "px";  // prevent y-overflow
    root.appendChild(disp);

    return board;
}

async function generateMaze() {
    /**
     * Replaces the current board with a randomly generated maze with delay between rows.
     */

    // ensures that multiple events cannot occur at once
    if (!$board.isRunning()) {
        $board.setRunning(true);

        $board.setSolved(false);

        let rows = $board.numRows();
        let columns = $board.numColumns();

        // generate a random maze
        let maze = mazeBuilder(rows, columns);

        // set default start and end
        $board.resetStartEnd();
        maze[1][1] = 's';
        maze[rows-2][columns-2] = 'e';

        // convert the board to generated maze one row at a time with a delay
        let delay = 1000 / rows;  // total build time of 1 sec
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                $board.setState(maze[i][j], i, j);
            }
            await new Promise(r => setTimeout(r, delay));
        }

        $board.setRunning(false);
    }
}

async function run() {
    /**
     * Starts the selected pathfinder with delay between steps.
     */

    // runs if path is not already found and another event is not taking place
    if (!$board.isRunning() && !$board.isSolved()) {
        $board.setRunning(true);

        // get selected pathfinding algorithm
        let algo = document.getElementById("algorithm").value;
        let pathfinder;
        if (algo === "dijkstras") {
            pathfinder = new Dijkstras($board);
        } else {
            pathfinder = new aStar($board);
        }

        // each step of pathfinding with delay
        while (!pathfinder.isFinished()) {
            pathfinder.getNext();
            await new Promise(r => setTimeout(r, 5));
        }

        $board.setRunning(false);
        $board.setSolved(true);
    }
}

$board = createBoard();
