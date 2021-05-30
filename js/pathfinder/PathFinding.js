class PathFinder {
    /**
     * Parent class for the pathfinding classes.
     * @param {GameBoard} board - The object containing the game state.
     */

    constructor(board) {

        this.board = board;
        this.columns = board.numColumns();

        // JS cannot equate arrays, so must store coordinates as a single int
        let start = board.getStart();
        let end = board.getEnd();
        this.end = toNum(end[0], end[1], this.columns);
        this.current = toNum(start[0], start[1], this.columns);

        // queue for every explored cell
        this.queue = new PriorityQueue();

        // stores a cell's predecessor in its cheapest known path
        this.predecessor = {};

        // gScore is cost of cheapest known path to a cell
        this.gScore = {};
        this.gScore[this.current] = 0;

        // default is no heuristic
        this.heuristic = function nullHeuristic() { return 0 };

        // stores if pathfinding is finished
        this.finished = false;
    }

    getNext() {
        /**
         * Explores the next cell in the priority queue.
         * Once finished, will display path.
         */

        // gets the next cell from the queue
        this.current = this.queue.pop();

        // termination condition for no possible path
        if (this.current === null) {
            this.finished = true;
            return;
        }

        // termination condition when path is found
        else if (this.current === this.end) {
            this.finished = true;
            setPath(this.board, this.current, this.predecessor);
        }

        // explore each viable neighbor cell
        let current = toCoord(this.current, this.columns);
        let adjacent_all = getAdjacent(this.board, current);
        let end = toCoord(this.end, this.columns);
        for (let i = 0; i < adjacent_all.length; i++){
            let adjacent = adjacent_all[i];
            let adjacent_num = toNum(adjacent[0], adjacent[1], this.columns);

            let adj_gScore = stepCost(current, adjacent) + this.gScore[this.current];
            let adj_fScore = this.heuristic(adjacent[0], adjacent[1], end[0], end[1]);

            // case for first exploration of cell, path is saved
            if (this.gScore[adjacent_num] === undefined) {
                this.queue.push(adjacent_num, adj_fScore + adj_gScore);
                this.gScore[adjacent_num] = adj_gScore;
                this.predecessor[adjacent_num] = this.current;
                if (this.board.getState(adjacent[0], adjacent[1]) === ' ') {
                    this.board.setState('v', adjacent[0], adjacent[1]);
                }
            }

            // case for subsequent explorations of cell, saved if path is cheaper than one currently saved
            else if (adj_gScore < this.gScore[adjacent_num]) {
                this.queue.updatePriority(adjacent_num, adj_fScore +adj_gScore);
                this.gScore[adjacent_num] = adj_gScore;
                this.predecessor[adjacent_num] = this.current;
            }
        }
    }

    isFinished() {
        /**
         * Checks if the path has been found.
         * @returns {boolean} Returns true if the path has been found, false if not.
         */

        return this.finished;
    }
}

class Dijkstras extends PathFinder {
    /**
     * Pathfinder using Dijkstra's algorithm.
     */

    constructor(board) {
        super(board);

        // queue the starting cell, priority is cheapest known path cost
        this.queue.push(this.current, 0);
    }
}

class aStar extends PathFinder {
    /**
     * Pathfinder using A* algorithm.
     */

    constructor(board) {
        super(board);

        // set the heuristic
        this.heuristic = octileHeuristic;

        // queue the starting cell, priority is cheapest known path cost plus heuristic to end
        let start = this.current;
        let end = this.board.getEnd();
        this.queue.push(this.current, this.heuristic(start[0], start[1], end[0], end[1]));
    }
}

function octileHeuristic(x1, y1, x2, y2) {
    /**
     * Heuristic for distance when diagonal movement is allowed.
     * @param {int} x1 - The x coordinate of the current position.
     * @param {int} y1 - The y coordinate of the current position.
     * @param {int} x2 - The x coordinate of the endpoint.
     * @param {int} y2 - The y coordinate of the endpoint.
     * @returns {number} Returns the minimum cost for travelling to the endpoint.
     */

    let x_dist = Math.abs(x2 - x1);
    let y_dist = Math.abs(y2 - y1);

    let non_diagonal = Math.abs(x_dist - y_dist);
    let diagonal = ((x_dist + y_dist) - non_diagonal) / 2;

    return 1.5 * diagonal + non_diagonal;
}

function getAdjacent(board, cell) {
    /**
     * Finds adjacent non-wall cells.
     * @param {Array.<Array.<String>>} board - A 2D map of the board.
     * @param {Array.<int, int>} cell - The x and y coordinate of a cell.
     * @returns {Array.<Array.<int, int>>} Returns an array of coordinates for non-wall adjacent cells.
     */

    let row = cell[0];
    let column = cell[1];

    // get all possible surrounding coordinates
    let surrounding = [
        [row, column+1], [row, column-1],
        [row+1, column+1], [row+1, column-1],
        [row+1, column], [row-1, column+1],
        [row-1, column-1], [row-1, column]
    ];

    let adjacent = [];
    let row_max = board.numRows()-1;
    let column_max = board.numColumns()-1;
    for (let i = 0; i < 8; i++) {
        let adj_cell = surrounding[i];
        let adj_row = adj_cell[0];
        let adj_column = adj_cell[1];

        // ensure that coordinates are not out of bounds
        if (adj_row >= 0 && adj_row <= row_max && adj_column >= 0 && adj_column <= column_max) {

            // allow diagonal movement only if there is a non-diagonal opening
            if (adj_row !== row && adj_column !== column) {
                if (board.getState(adj_row, adj_column) !== 'w' &&
                    (board.getState(row, adj_column) !== 'w' || board.getState(adj_row, column) !== 'w')) {
                    adjacent.push(adj_cell);
                }
            }

            // for non-diagonal movement, return cells that are not walls
            else {
                if (board.getState(adj_row, adj_column) !== 'w') {
                    adjacent.push(adj_cell);
                }
            }
        }
    }

    return adjacent;
}

function setPath(board, cell, predecessor) {
    /**
     * Sets the path to a cell by iterating through it's predecessors
     * @param {Array.<Array.<String>>} board - A 2D map of the board where the path will be set.
     * @param {int} cell - The destination cell's number.
     * @param {Map<int, int>} predecessor - A map of cells and its predecessor in the cheapest known path.
     */
    while (cell in predecessor) {
        let coords = toCoord(cell, board.numColumns());
        let row = coords[0];
        let column = coords[1];
        if (board.getState(row, column) !== 's' && board.getState(row, column) !== 'e') {
            board.setState('p', row, column);
        }
        cell = predecessor[cell];
    }
}

function stepCost(cell1, cell2) {
    /**
     * Gets the cost to move to an adjacent cell.
     * @param {Array.<int, int>} cell1 - The x and y coordinate for current cell.
     * @param {Array.<int, int>} cell2 - The x and y coordinate for adjacent cell.
     * @returns {number} Returns the cost, 1 for lateral and 1.5 for diagonal.
     */

    if (cell1[0] !== cell2[0] && cell1[1] !== cell2[1]) {
        // uses approximation of square root 2 for increased speed
        return 1.5
    } else {
        return 1;
    }
}

function toNum(x, y, columns) {
    /**
     * Converts an x and y coordinate into a unique number based on number of columns.
     * @param {int} x - The x coordinate.
     * @param {int} y - The y coordinate.
     * @param {int} columns - The number of columns per row.
     * @returns {int} Returns a unique number for the coordinate.
     */

    return columns * x + y;
}

function toCoord(num, columns) {
    /**
     * Gets the coordinates of a numbered cell (assuming numbered left to right, top down).
     * @param {int} num - The cell's number.
     * @param {int} columns - The number of columns per row.
     * @returns {Array.<int>} Returns the x and y coordinate of the numbered cell.
     */

    let x = Math.floor(num / columns);
    let y = num % columns;
    return [x, y];
}
