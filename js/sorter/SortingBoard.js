class SortingBoard {
    /**
     * Stores the sorting board.
     * @param {int} rows - Number of rows in the board.
     * @param {int} columns - Number of columns in the board.
     */

    constructor(rows, columns) {
        this.board = Array(rows).fill(null);
        this.display = document.createElement("table");

        // define event variables
        this.sorted = false;
        this.running = false;

        // build display and 2D map of cells
        for (let i = 0; i < rows; i++) {

            // create new row
            let row = new BoardRow(columns);
            this.board[i] = row;

            // get and add new row's display
            let row_disp = row.getDisplay();
            this.display.appendChild(row_disp);
        }
    }

    getDisplay() {
        /**
         * Gets the boards's HTML so it can be displayed.
         * @returns {HTMLObjectElement} Returns the HTML representation of the cell.
         */

        return this.display;
    }

    setSorted(sorted) {
        /**
         * Set if the board has been sorted.
         * @param {boolean} sorted - True if the board has been sorted, false if not.
         */

        this.sorted = sorted;
    }

    isSorted() {
        /**
         * Checks if the board has been sorted.
         * @returns {boolean} Returns true if the board is sorted, false if not.
         */

        return this.sorted;
    }

    setValue(row, value) {
        /**
         * Changes the value of a row.
         * @param {int} row - The row to have its value changed.
         * @param {int} value - The new value of the row.
         */

        this.board[row].setValue(value);
    }

    getValue(row) {
        /**
         * Gets the value of a row.
         * @param {int} row - The row to get the value of.
         * @returns {int} Returns the row's value.
         */

        return this.board[row].getValue();
    }

    setColor(row, color) {
        /**
         * Changes the color of a row.
         * @param {int} row - The row to have its color changed.
         * @param {String} color - The new color of the row.
         */

        this.board[row].setColor(color);
    }

    resetColor() {
        /**
         * Resets the color of each row back to the default (blue).
         */

        for (let i = 0; i < this.numRows(); i++) {
            this.board[i].setColor('blue');
        }
    }

    numRows() {
        /**
         * Gets the number of rows in the board.
         * @returns {int} Returns the number of rows in the board.
         */

        return this.board.length;
    }

    numColumns() {
        /**
         * Gets the number of columns in the board.
         * @returns {int} Returns the number of columns in the board.
         */

        return this.board[0].numCells();
    }

    isRunning() {
        /**
         * Checks if something is currently running on the board (sorting, unsorting).
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
}
