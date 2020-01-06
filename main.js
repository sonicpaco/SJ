//import { plot as plot, plotGen as plotGen }from './modules/plot.js';
import { plot as plot } from './modules/plot.js';
//import  Plot  from './modules/plot.js';
console.log("main.sj called");

window.sj =
{
    plot: plot
};


// setTimeout(function ()
// {
// }, 1000);


var p = sj.plot('plot 1');


//const p = sj.plot('test_data.dsv', 'audio-plot-1');
//p.generate();

//p.remove();

//debugger;


