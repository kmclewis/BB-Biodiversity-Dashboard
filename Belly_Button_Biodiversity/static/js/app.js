function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
  console.log(response);
  var metaData = response;

  
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  var empty = d3.select("#sample-metadata");
  empty.html("");
  // Collecting and adding data for the metadata panel
  Object.entries(metaData).forEach(([key,value]) => {
    var row = panel.append("tr");
    var cell = row.append("td");
    cell.text(`${key}: ${value}`);      
    });
  
  // BONUS: Build the Gauge Chart
// variable to hold wash frequency for gauge chart
var level = metaData.WFREQ;

// code for the gauge chart
// Trig to calc meter point
var degrees = 9 - level,
     radius = .5;
var radians = degrees * Math.PI / 9;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 10, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: ''},
  { values: [45/9, 45/9, 45/9, 45/9, 45/9, 45/9, 45/9, 45/9, 45/9,45],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(133,180,138, .5)', 'rgba(138,187,143, .5)',
  'rgba(140,191,136, .5)','rgba(183,204,146, .5)',
  'rgba(213,228,157, .5)','rgba(229,231,179, .5)', 
  'rgba(233,230,202, .5)','rgba(244,241,229, .5)',
  'rgba(248,243,236, .5)','rgba(255,255,255, 0)']},
  labels: [''],
  hoverinfo: '',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',

  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);

})}


function buildCharts(sample) {
  // Use `d3.json` to fetch the data for the pie and bubble chart
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    
    // variables to hold bubble chart data
    var ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;
    // plotting the bubble chart
    var trace1 = {
      x: ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: ids,
        size: sample_values
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: '',
      showlegend: false,
      sizemode: 'area'
       };
    
    Plotly.newPlot('bubble', data, layout);
    
    // variables to hold pie chart data
    var pieValues = sample_values.slice(0,10);
    var pieLabels = ids.slice(0,10);
    var pieText = otu_labels.slice(0,10);

    // plotting the pie chart
    var data = [{
      labels: pieLabels,
      values: pieValues,
      hovertext: pieText,
      type: 'pie'
    }];
    
    var layout = {
      autosize: false,
      margin: {
        l: 10,
        r: 10,
        b: 70,
        t: 0,
        pad: 0,
      },
      // sizemode: 'area'
      height: 487.50,
      width: 450.
    };
    
    Plotly.newPlot('pie', data, layout);



})}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);6
}

// Initialize the dashboard
init();
