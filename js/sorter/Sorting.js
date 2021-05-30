class Sorter {
    /**
     * Parent class for the sorting classes.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        this.board = board;
        this.delay = delay;
        let rows = board.numRows();
        this.items = Array(rows);
        for (let i = 0; i < rows; i++) {
            this.items[i] = this.board.getValue(i);
        }
    }
}

class BubbleSort extends Sorter {
    /**
     * Sorts using bubble sort.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        super(board, delay);
    }

    async sort() {
        /**
         * Sorts with delay between each step.
         */

        let finished = false;
        while (!finished) {

            finished = true;
            for (let i = 1; i < this.items.length; i++) {
                if (this.items[i-1] > this.items[i]) {

                    // indicate that a sort occurred
                    finished = false;

                    // swap values on board
                    this.board.setValue(i, this.items[i-1]);
                    this.board.setValue(i-1, this.items[i]);
                    this.board.setColor(i, "yellow");
                    this.board.setColor(i-1, "yellow");

                    // swap values on list
                    let temp = this.items[i];
                    this.items[i] = this.items[i-1];
                    this.items[i-1] = temp;
                }
            }

            // delay before resetting board color
            await new Promise(r => setTimeout(r, this.delay));
            this.board.resetColor();
        }
    }
}

class SelectionSort extends Sorter {
    /**
     * Sorts using selection sort.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        super(board, delay);
        this.sorted = [];
    }

    async sort() {
        /**
         * Sorts with delay between each step.
         */

        let finished = false;
        while (!finished) {

            let unsorted = this.items;
            let sorted = this.sorted;

            // get index of smallest value in unsorted list
            let min_value = unsorted[0];
            let min_index = 0;
            for (let i = 1; i < unsorted.length; i++) {
                if (unsorted[i] < min_value) {
                    min_value = unsorted[i];
                    min_index = i;
                }
            }

            // move smallest value from unsorted list to sorted list
            sorted.push(unsorted[min_index]);
            unsorted.splice(min_index, 1);

            // update sorted values on the board
            let sorted_end = sorted.length-1;
            this.board.setValue(sorted_end, sorted[sorted_end]);
            this.board.setColor(sorted_end, "yellow");

            // update unsorted values on the board
            let unsorted_start = sorted.length;
            for (let i = 0; i < min_index; i++) {
                this.board.setValue(i+unsorted_start, unsorted[i]);
                this.board.setColor(i+unsorted_start, "yellow");
            }

            // check if sorting is finished
            if (unsorted.length === 0) {
                finished = true;
            }

            // delay before resetting board color
            await new Promise(r => setTimeout(r, this.delay));
            this.board.resetColor();
        }
    }
}

class InsertionSort extends Sorter {
    /**
     * Sorts using insertion sort.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        super(board, delay);
        this.sorted = [];
    }

    async sort() {
        /**
         * Sorts with delay between each step.
         */

        let finished = false;
        while (!finished) {

            let unsorted = this.items;
            let sorted = this.sorted;

            // get unsorted item
            let value = unsorted.shift();

            // get index of insertion point in sorted list
            let insert_index = 0;
            for (let i = 0; i < sorted.length; i++) {
                if (sorted[i] > value) {
                    break;
                }
                insert_index = i + 1;
            }

            // add value to sorted list
            sorted.splice(insert_index, 0, value);

            // update sorted values on the board
            for (let i = insert_index; i < sorted.length; i++) {
                this.board.setValue(i, sorted[i]);
                this.board.setColor(i, "yellow");
            }

            // check if sorting is finished
            if (unsorted.length === 0) {
                finished = true;
            }

            // delay before resetting board color
            await new Promise(r => setTimeout(r, this.delay));
            this.board.resetColor();
        }
    }
}

class MergeSort extends Sorter {
    /**
     * Sorts using merge sort.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        super(board, delay);
    }

    async sort(items = this.items, start = 0) {
        /**
         * Sorts recursively.
         */

        // checks for the base case
        if (items.length <= 1) {
            return items;
        }

        // get index for array split
        let mid = Math.ceil(items.length / 2);

        // recursive call for each half of the split array, called at the same time
        let halves = await Promise.all([
            this.sort(items.slice(0, mid), start),
            this.sort(items.slice(mid), start + mid)
        ]);

        // return the merged halves
        return await this.merge(halves[0], halves[1], start);
    }

    async merge(left, right, start) {
        /**
         * Merges two sorted arrays into one sorted array.
         * @param {Array.<int...>} left - An array to be merged.
         * @param {Array.<int...>} right - An array to be merged.
         * @param {int} start - The merged array's starting index on the board.
         */

        // merge arrays one element at a time until one is empty
        let merged = [];
        while(left.length > 0 && right.length > 0) {
            if (left[0] < right[0]) {
                merged.push(left.shift());
            } else {
                merged.push(right.shift());
            }
        }

        // add remaining array to end
        if (right.length > 0) {
            merged = merged.concat(right);
        } else if (left.length > 0) {
            merged = merged.concat(left);
        }

        // update board with delay between rows
        for (let i = start; i < start + merged.length; i++) {
            this.board.setValue(i, merged[i-start])
            this.board.setColor(i, "yellow");
            await new Promise(r => setTimeout(r, this.delay));
        }

        // resets the board's color after merging has finished
        for (let i = start; i < start + merged.length; i++) {
            this.board.setColor(i, "blue");
        }

        return merged;
    }
}

class QuickSort extends Sorter {
    /**
     * Sorts using quick sort.
     * @param {SortingBoard} board - The object containing the board state.
     * @param {number} delay - The time in ms to delay between each step of the sorter.
     */

    constructor(board, delay) {
        super(board, delay);
        this.delay = delay * 0.75;
    }

    async sort(start = 0, end = this.items.length-1) {
        /**
         * Sorts recursively.
         */

        // check for the base case
        if (start >= end) {
            return;
        }

        let pivot =  await this.partition(start, end);

        // recursive call for each side of the pivot, called at the same time
        await Promise.all([this.sort(start, pivot-1), this.sort(pivot+1, end)]);
    }

    async partition(start, end) {
        /**
         * Partitions a subarray from the array of items.
         * @param {int} start - The starting index for the subarray.
         * @param {int} end - The end index for the subarray (inclusive).
         * @returns {int} Returns the index for a pivot.
         */

        // highlight section being partitioned
        for (let i = start; i < end+1; i++) {
            this.board.setColor(i, "yellow");
        }

        let pivot = start;
        for (let i = start+1; i < end+1; i++) {
            if (this.items[i] <= this.items[start]) {
                pivot ++;
                // swap values
                await this.swap(i, pivot);
            }
        }

        // swap values
        await this.swap(start, pivot);

        // resets the board's color after the swapping has finished
        for (let i = start; i < end+1; i++) {
            this.board.setColor(i, "blue");
        }

        return pivot;
    }

    async swap(first, second) {
        /**
         * Swaps two values in the array of items and updates the board.
         * @param {int} first - Index of an item to be swapped.
         * @param {int} second - Index of an item to be swapped.
         */

        let first_value = this.items[first];
        let second_value = this.items[second];

        this.items[first] = second_value;
        this.items[second] = first_value;

        // update board
        this.board.setValue(first, second_value);
        this.board.setColor(first, "orange");
        this.board.setValue(second, first_value);
        this.board.setColor(second, "orange");

        // add a delay for each swap
        await new Promise(r => setTimeout(r, this.delay));
    }
}
