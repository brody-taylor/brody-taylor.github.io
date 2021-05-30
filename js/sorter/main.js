function createBoard() {
    /**
     * Creates and displays a sorting board.
     * @returns {SortingBoard} Returns the sorting board.
     */

    // calculates board dimensions based on window size
    let columns = 100;
    let width = document.body.clientWidth;
    let header = document.getElementById("header").offsetHeight;
    let height = window.innerHeight - header;
    let cell_size = width/columns;
    let rows = Math.floor(height/cell_size);

    // creates and adds an empty game board to the app root
    let board = new SortingBoard(rows, columns);
    let root = document.getElementById("app");
    let disp = board.getDisplay();
    disp.style.height = height.toString() + "px";  // prevent y-overflow
    root.appendChild(disp);

    return board;
}

async function randomize() {
    /**
     * Randomizes the value of each row.
     */

    // ensures that multiple events cannot occur at once
    if (!$board.isRunning()) {
        $board.setRunning(true);
        $board.setSorted(false);

        let columns = $board.numColumns();
        let rows = $board.numRows();

        // randomize the value of each row and display with a delay
        let delay = 1000 / rows;  // total build time of 1 sec
        for (let i = 0; i < rows; i++) {
            let value = Math.floor(Math.random() * (columns + 1));
            $board.setValue(i, value);
            await new Promise(r => setTimeout(r, delay));
        }

        $board.setRunning(false);
    }
}

async function run() {
    /**
     * Starts the selected sorter.
     */

    // runs if board is not already sorted and another event is not taking place
    if (!$board.isRunning() && !$board.isSorted()) {
        $board.setRunning(true);

        let algo = document.getElementById("algorithm").value;
        let sorter;
        let delay = 5000 / $board.numRows();
        if (algo === "bubble") {
            sorter = new BubbleSort($board, delay);
        } else if (algo === "quick") {
            sorter = new QuickSort($board, delay);
        } else if (algo === "insertion") {
            sorter = new InsertionSort($board, delay);
        } else if (algo === "merge") {
            sorter = new MergeSort($board, delay);
        } else {
            sorter = new SelectionSort($board, delay);
        }

        await sorter.sort();

        $board.setSorted(true);
        $board.setRunning(false);
    }
}

$board = createBoard();
randomize();
