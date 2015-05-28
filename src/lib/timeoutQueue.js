/**
 * Queue for throttled sending of queries
 * Interval between queires is set in constructor
 * @todo autotest
 */
export class TimeoutQueue {
    constructor(timeout = 300) {
        this.running = false;
        this.queue = [];
        this.timeout = timeout;
    }

    add(callback) {
        // DGExt.utils.log('added func');
        this.queue.push(() => {
            // DGExt.utils.log('started func');
            var finished = callback();
            if (typeof finished === "undefined" || finished) {
                this.next();
            }
        });

        if (!this.running) {
            // DGExt.utils.log('not running: next');
            this.next();
        }

        return this;
    }

    next() {
        this.running = false;
        var shift = this.queue.shift();
        if (shift) {
            // DGExt.utils.log('queueing func');
            this.running = true;
            setTimeout(shift, this.timeout);
        }
    }
}
