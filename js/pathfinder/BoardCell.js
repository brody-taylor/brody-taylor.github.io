class BoardCell {
    /**
     * A single cell for the pathfinding board.
     */

    constructor() {
        this.display = document.createElement('td');
        this.setState(' ');
    }

    getDisplay() {
        /**
         * Gets the cell's HTML so it can be displayed.
         * @returns {HTMLObjectElement} Returns the HTML representation of the cell.
         */

        return this.display;
    }

    setState(state) {
        /**
         * Associates a background color with a cell's state.
         * @param {String} state - Abbreviation ' ' for empty, 'w' for wall, 'v' for visited, 'p' for path, 's' for start, and 'e' for end.
         */

        this.state = state;

        if (state === ' ') {
            this.display.style.backgroundColor = "#E3E2DF";
        } else if (state === 'w') {
            this.display.style.backgroundColor = "#93CCEA";
        } else if (state === 'v') {
            this.display.style.backgroundColor = "#FFD800";
        } else if (state === 'p') {
            this.display.style.backgroundColor = "#FFA500";
        } else if (state === 's') {
            this.display.style.backgroundColor = "#007F66";
        } else if (state === 'e') {
            this.display.style.backgroundColor = "#E62020";
        } else {
            this.display.style.backgroundColor = "#E3E2DF";
        }
    }

    getState() {
        /**
         * Gets the cell's current state.
         * @returns {String} Returns abbreviation ' ' for empty, 'w' for wall, 'v' for visited, 'p' for path, 's' for start, and 'e' for end.
         */

        return this.state;
    }
}