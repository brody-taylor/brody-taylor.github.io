class BoardCell {
    /**
     * A single cell for the pathfinding board.
     */

    constructor() {
        this.display = document.createElement('td');
        this.setColor("white");
    }

    getDisplay() {
        /**
         * Gets the cell's HTML so it can be displayed.
         * @returns {HTMLObjectElement} Returns the HTML representation of the cell.
         */

        return this.display;
    }

    setColor(color) {
        /**
         * Set a cell's background color.
         * @param {String} color - The background color to be set to.
         */

        this.color = color;

        if (color === "white") {
            this.display.style.backgroundColor = "#E3E2DF";
        } else if (color === "blue") {
            this.display.style.backgroundColor = "#93CCEA";
        } else if (color === "yellow") {
            this.display.style.backgroundColor = "#FFD800";
        } else if (color === "orange") {
            this.display.style.backgroundColor = "#FFA500";
        } else {
            this.display.style.backgroundColor = color;
        }
    }

    getColor() {
        /**
         * Gets the cell's background color.
         * @returns {String} Returns the cell's background color.
         */

        return this.color;
    }
}