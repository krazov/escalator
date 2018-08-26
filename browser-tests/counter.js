import escalator from '../src/escalator.js';

const counter = escalator(
    { name: 'minutes', range: 60 },
    { name: 'seconds', range: 60 }
);

const $counter = document.getElementById('counter');

setInterval(() => {
    $counter.textContent = counter.increase('seconds').print();
}, 500);
