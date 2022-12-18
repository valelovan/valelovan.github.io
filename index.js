let count = 0;

document.querySelector("#clicker").onclick = function() {
    const counter = document.querySelector("#counter");
    count++;
    counter.innerHTML = `Count: ${count}`;
}
