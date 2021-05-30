class BoardRow {
    /**
     * A row for the sorting board.
     */

    constructor(length) {

        this.display = document.createElement('tr');
        this.color = 'blue';
        this.cells = Array(length);
        this.value = 0;

        // create cells and add to display
        for (let i = 0; i < length; i++) {
            let cell = new BoardCell();
            this.cells[i] = cell;
            this.display.appendChild(cell.getDisplay());
        }
    }

    getDisplay() {
        /**
         * Gets the row's HTML so it can be displayed.
         * @returns {HTMLObjectElement} Returns the HTML representation of the row.
         */

        return this.display;
    }

    numCells() {
        /**
         * Gets the number of cells in the row.
         * @returns {int} Returns the number of cells in the row.
         */

        return this.cells.length;
    }

    setValue(value) {
        /**
         * Sets the value of the row, coloring that number of cells.
         * @param {int} value - The new value of the row.
         */

        this.value = value;

        for (let i = 0; i < this.numCells(); i++) {
            if (i < value) {
                this.cells[i].setColor(this.color);
            } else {
                this.cells[i].setColor("white");
            }
        }
    }

    getValue() {
        /**
         * Gets the value of the row.
         * @returns {int} Returns the current value of the row.
         */

        return this.value;
    }

    setColor(color) {
        /**
         * Changes the color of cells in the row.
         * @param {String} color - The color that the row will be changed to.
         */

        this.color = color;

        // only changes color of non-empty cells
        for (let i = 0; i < this.getValue(); i++) {
            this.cells[i].setColor(color);
        }
    }

    getColor() {
        /**
         * Gets the current color of the row.
         * @returns {String} Returns the row's color.
         */

        return this.color;
    }
}