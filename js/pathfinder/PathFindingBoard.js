class GameBoard {
    /**
     * Stores the pathfinding board.
     * @param {int} rows - Number of rows in the board, should be odd.
     * @param {int} columns - Number of columns in the board, should be odd.
     */

    constructor(rows, columns) {

        // number of rows and columns must be odd for maze generation
        if (rows % 2 === 0) {
            rows--;
        }
        if (columns % 2 === 0) {
            columns--;
        }

        this.start = null;
        this.end = null;
        this.board = Array(rows).fill(null).map(()=> (Array(columns)));
        this.display = document.createElement("table");

        // add event listener to handle interaction with cells
        document.addEventListener("mouseup", function() {$board.handleMouseUp()});

        // define event variables
        this.selected = null;
        this.running = false;
        this.solved = false;

        // build display and 2D map of cells
        let key = 0;
        for (let i = 0; i < rows; i++) {

            // add each row element to display table
            let row = document.createElement("tr");
            this.display.appendChild(row);

            for (let j = 0; j < columns; j++) {

                // create new cell
                this.board[i][j] = new BoardCell(key);
                key++;

                // get new cell's display
                let cell = this.board[i][j].getDisplay();
                row.appendChild(cell);

                // add event listeners to cells to handle interactions
                cell.addEventListener("mousedown", function() {$board.handleMouseDown(i, j)});
                cell.addEventListener("mouseover", function() {$board.handleCellHover(i, j)});
            }
        }

        // set default start and end
        this.setStart(0, 0);
        this.setEnd(rows-1, columns-1);
    }

    getDisplay() {
        /**
         * Gets the board's HTML so it can be displayed.
         * @returns {HTMLObjectElement} Returns the HTML representation of the board.
         */

        return this.display;
    }

    getState(row, column) {
        /**
         * Gets the state of a cell on the board.
         * @param {int} row - The row that the cell is located in.
         * @param {int} column - The column that the cell is located in.
         * @returns {String} Returns abbreviation ' ' for empty, 'w' for wall, 'v' for visited, 'p' for path, 's' for start, and 'e' for end.
         */

        return this.board[row][column].getState();
    }

    setState(state, row, column) {
        /**
         * Sets the state of a cell on the board.
         * @param {String} state - Abbreviation ' ' for empty, 'w' for wall, 'v' for visited, 'p' for path, 's' for start, and 'e' for end.
         * @param {int} row - The row that the cell is located in.
         * @param {int} column - The column that the cell is located in.
         */

        if (state === 's') {
            this.setStart(row, column);
        } else if (state === 'e') {
            this.setEnd(row, column);
        } else {
            this.board[row][column].setState(state);
        }
    }

    getStart() {
        /**
         * Gets the row and column of the board's start cell.
         * @returns {Array.<int, int>} Returns an array storing the row and column for the board's start cell.
         */

        return this.start;
    }

    setStart(row, column) {
        /**
         * Replaces the board's start cell.
         * @param {int} row - The row of the new start cell.
         * @param {int} column - The column of the new start cell.
         */

        // clear old start
        if (this.start !== null) {
            this.board[this.start[0]][this.start[1]].setState(' ');
        }

        // set new start
        this.board[row][column].setState('s');
        this.start = [row, column];
    }

    getEnd() {
        /**
         * Gets the row and column of the board's end cell.
         * @returns {Array.<int, int>} Returns an array storing the row and column for the board's end cell.
         */

        return this.end;
    }

    setEnd(row, column) {
        /**
         * Replaces the board's end cell.
         * @param {int} row - The row of the new end cell.
         * @param {int} column - The column of the new end cell.
         */

        // clear old end
        if (this.end !== null) {
            this.board[this.end[0]][this.end[1]].setState(' ');
        }

        // set new end
        this.board[row][column].setState('e');
        this.end = [row, column];
    }

    resetStartEnd() {
        /**
         * Removes the start and end cell (useful during maze generation).
         */

        this.start = null;
        this.end = null;
    }

    numRows() {
        /**
         * Gets the number of rows.
         * @returns {int} Returns the number of rows.
         */

        return this.board.length;
    }

    numColumns() {
        /**
         * Gets the number of columns.
         * @returns {int} Returns the number of columns.
         */

        return this.board[0].length;
    }

    handleMouseDown(row, column) {
        /**
         * Event listener for a click.
         * Will record the state of the cell that was clicked on if nothing else is running.
         */

        if (!this.isRunning() && !this.isSolved()) {
            this.selected = this.board[row][column].getState();
            this.handleCellHover(row, column);
        }
    }

    handleMouseUp() {
        /**
         * Event listener for release of a click.
         * Resets the click event variable.
         */

        this.selected = null;
    }

    handleCellHover(row, column) {
        /**
         * Event listener for cell hovering.
         * If click has occurred, will respond depending on the state of the cell that was clicked.
         */

        if (this.selected !== null) {
            let hovered = this.board[row][column].getState();

            // moving start point
            if (this.selected === 's' && hovered === ' ') {
                this.setStart(row, column);
            }

            // moving end point
            else if (this.selected === 'e' && hovered === ' ') {
                this.setEnd(row, column);
            }

            // editing walls
            else if ((this.selected === ' ' || this.selected === 'w') && (hovered === ' ' || hovered === 'w')) {
                if (this.selected === ' ') {
                    this.board[row][column].setState('w');
                } else {
                    this.board[row][column].setState(' ');
                }
            }
        }
    }

    isRunning() {
        /**
         * Checks if something is currently running on the board (maze generation, pathfinding).
         * @returns {boolean} Returns true if something is running, false if not.
         */

        return this.running;
    }

    setRunning(running) {
        /**
         * Set if something has begun or finished running.
         * @param {boolean} running - True if something has started running, false if it has finished.
         */

        this.running = running;
    }

    isSolved() {
        /**
         * Check if pathfinding has occurred on the board.
         * @returns {boolean} Returns true if pathfinding has occurred, false if not.
         */

        return this.solved;
    }

    setSolved(solved) {
        /**
         * Set if pathfinding has occurred on the board.
         * @param {boolean} solved - True if pathfinding has occured, false if not.
         */

        this.solved = solved;
    }
}
