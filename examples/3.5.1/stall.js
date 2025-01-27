/** @function stall 
 * Synchronously stalls for the specified amount of time 
 * to simulate a long-running calculation
 * @param {int} seconds - the number of seconds to stall
 */
function stall(seconds) {
    var startTime = Date.now();
    var endTime = seconds * 1000 + startTime;
    while(true) {
        if(Date.now() > endTime) break;
    }
}


/**
 * Message handler for messages from the main thread
 */
onmessage = function(event) {
    // stall for the specified amount of time 
    stall(event.data);
    // Send an answer back to the main thread
    postMessage(`Stalled for ${event.data} seconds`);
    // Close the worker since we create a
    // new worker with each stall request.
    // Alternatively, we could re-use the same
    // worker.
    close();
};