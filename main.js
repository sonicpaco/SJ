//import { plot as plot, plotGen as plotGen }from './modules/plot.js';
import { plot as plot } from './modules/plot.js';
//import  Plot  from './modules/plot.js';
console.log(111111);

window.sj =
{
    plot: plot
};


// setTimeout(function ()
// {
// }, 1000);

const p = sj.plot('test_data.dsv', 'audio-plot-1');
p.generate();


//debugger;


