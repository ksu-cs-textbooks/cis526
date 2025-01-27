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
 * When the calculate-in-main button is clicked,
 * simulate calculation by stalling in the main thread.
 */
document.querySelector('#calculate-in-main').addEventListener('click', function(event) {
    event.preventDefault();
       
    // Get the number of permutations and convert it from a string to a base 10 integer
    var n = parseInt(document.querySelector('#n').value, 10);
  
    // Signal the start
    document.querySelector('#calculation-message').textContent = `Calculating in main thread for ${n} seconds...`;
  
    // Because stalling will prevent the UI from updating to display the message, 
    // use a setTimeout of 0 duration to trigger stalling *after* the UI update
    setTimeout(function(){
        // Stall for n seconds
        stall(n);

        // Signal completion 
        document.querySelector('#calculation-message').textContent = `Calculation complete!`;    
    }, 0);
});
 
/**
 * When the calculate-in-web-worker button is clicked,
 * simulate calculation by stalling in the worker.
 */
document.querySelector('#calculate-in-web-worker').addEventListener('click', function(event) {
    event.preventDefault();

    // Get the number to calculate the Fibonacci number for and convert it from a string to a base 10 integer
    var n = parseInt(document.querySelector('#n').value, 10);
  
    // Signal the start
    document.querySelector('#calculation-message').textContent = `Calculating in web worker for ${n} seconds...`;

    // Set up the web worker
    var worker = new Worker('stall.js');

    // Set up message listener
    worker.onmessage = function(event){
        // Signal completion
        document.querySelector('#calculation-message').textContent = `Calculation complete!`;
    }

    // Stall for the specified amount of time
    worker.postMessage(n);
});

/**
 * When the colored squares are clicked, toggle thier "active" class.
 */
document.querySelectorAll('.squares > div').forEach(function(square) {
    square.addEventListener('click', function(event) {
        square.classList.toggle('active');
    });
})