class PriorityQueue {
    /**
     * Priority queue implemented using an Array.
     * Should be replaced with a heap for better performance.
     */

    constructor() {
        this.queue = [];
    }

    isEmpty(){
        /**
         * Checks if there are items in the queue.
         * @returns {boolean} Returns true if the queue is empty, false if not.
         */

        return this.queue.length === 0;
    }

    pop(){
        /**
         * Gets and removes the next item in the queue.
         * @returns item - Next item in queue.
         */

        if (this.queue.length > 0) {
            return this.queue.pop()[1];
        } else {
            return null;
        }
    }

    push(item, priority){
        /**
         * Adds an items to the queue.
         * @param item - The item to be queued.
         * @param {number} priority - The priority of the item (lower number has higher priority).
         */

        for (let i = 0; i < this.queue.length; i++){
            if (priority > this.queue[i][0]){
                this.queue.splice(i, 0, [priority, item]);
                return;
            }
        }
        this.queue.push([priority, item]);
    }

    updatePriority(item, new_priority){
        /**
         * Changes the priority of an item.
         * @param item - The item that will have its priority changed.
         * @param {number} new_priority - The priority that the item will be set to.
         */

        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i][1] === item) {
                this.queue.splice(i, 1);
                this.push(item, new_priority);
                return;
            }
        }
    }
}