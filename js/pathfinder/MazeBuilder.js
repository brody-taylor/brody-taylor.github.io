    function mazeBuilder(rows, columns) {
    /**
     * Generates a random maze using Eller's algorithm.
     * @param {int} rows - Number of rows in the maze (must be odd).
     * @param {int} columns - Number of columns in the maze (must be odd).
     * @returnss {Array.<Array.<String>>} Returns a 2D map of a maze where walls are 'w' and empty cells are ' '.
     */

    // get an empty maze layout
    let maze = emptyMaze(rows, columns);

    // build maze for all rows except last
    for (let i = 1; i < rows-2; i += 2) {

        // horizontal connections
        for (let j = 3; j < columns; j += 2) {
            let current_set = maze[i][j];
            let previous_set = maze[i][j-2];

            // 50% chance to connect adjacent columns of differing sets
            if (current_set !== previous_set && Math.random() < 0.5) {
                // remove wall
                maze[i][j-1] = previous_set;
                // unify the newly connected sets
                maze = convertSet(maze, previous_set, current_set);
            }
        }

        // vertical connections
        for (let j = 1; j < columns; j +=2) {
            let current_set = maze[i][j];
            let connected = false;
            let start = j;

            // randomly connect cells in each set
            while (j+1 < columns && maze[i][j+1] === current_set) {
                j+=1;
                if (j % 2 !== 0) {
                    if (Math.random() < 0.3) {
                        connected = true;
                        maze[i+1][j] = current_set;
                        maze[i+2][j] = current_set;
                    }
                }
            }

            // force at least one connection per set if none have occurred
            if (!connected) {
                let connection = 2 * Math.floor(Math.random() * (1 + ((j - start) / 2))) + start;
                maze[i+1][connection] = current_set;
                maze[i+2][connection] = current_set;
            }
        }
    }

    // handle last row
    let row = rows - 2;
    for (let i = 3; i < columns; i+=2) {
        if (maze[row][i] !== maze[row][i-2]) {
            maze[row][i-1] = maze[row][i];
            maze = convertSet(maze, maze[row][i-2], maze[row][i]);
        }
    }

    // remove the final set number
    maze = convertSet(maze, ' ', maze[1][1]);

    return maze;
}

function emptyMaze(rows, columns) {
    /**
     * Constructs an empty maze where each open cell is surrounded by walls.
     * @param {int} rows - Number of rows in the maze (must be odd).
     * @param {int} columns - Number of columns in the maze (must be odd).
     * @returnss {Array.<Array.<String|int>>} Returns a 2D map where walls are 'w' and each open cell has a unique number.
     */

    // create an empty board
    let maze = Array(rows).fill(null).map(()=> (Array(columns)));

    let set = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (i % 2 !== 0 && j % 2 !== 0) {
                // fill non-walls with a unique set number
                maze[i][j] = set;
                set ++;
            } else {
                maze[i][j] = 'w';
            }
        }
    }

    return maze;
}

function convertSet(maze, new_set, old_set) {
    /**
     * Unifies two sets.
     * @param {Array.<Array.<String|int>>} maze - A 2D map of the maze, where sets are indicated by a unique number.
     * @param {int} new_set - The set number that will persist.
     * @param {int} old_set - The set number that will be converted.
     * @returns {Array.<Array.<String|int>>} Returns a 2D map of the maze where the two sets have been unified.
     */

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[0].length; j++) {
            if (maze[i][j] === old_set) {
                maze[i][j] = new_set;
            }
        }
    }
    return maze;
}