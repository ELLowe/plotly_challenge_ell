function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let endpoint = '/metadata/' + sample;
  d3.json(endpoint).then(function(data){
    // Use d3 to select the panel with id of `#sample-metadata`
    metaDataContent = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
    metaDataContent.html('');
    // Use `Object.entries` to add each key and value pair to the panel
    let metaData = Object.entries(data);
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    for (let i = 0; i < metaData.length; i++) {
      // metaData[i] is each inner list -> [key, value]
      // create a text string: 'key: value'
      let string = metaData[i][0] + ': ' + metaData[i][1];

      // create a paragraph or text element to contain this string
      metaDataContent.append('p').text(string);
    }

  });

}

function buildCharts(sample) {

  // Used `d3.json` to fetch the sample data for the plots
  let endpoint = '/samples/' + sample;

    d3.json(endpoint).then(function(selection){
      console.log('selection:', selection);
      let ids = selection['otu_ids'];
      let labels = selection['otu_labels'];
      let quantity = selection['sample_values'];
  
    
      // Built a Bubble Chart using the sample data
  
      var bubbleTrace = {
        x: ids,
        y: quantity,
        text: labels,
        mode: 'markers',
        marker: {
          size: quantity,
          color: ids
        }
      };
      
      var bubbleData = [bubbleTrace];
      
      var bubbleLayout = {
        title: 'Bacteria In Belly Button Samples',
        xaxis: {title: 'OTU IDs'},
      };
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout,{responsive: true});
  
      // Built a Pie Chart
      // Used slice() to grab the top 10 of each
      let top10quantities = quantity.slice(0,10);
      let top10ids = ids.slice(0,10);
      let top10labels = labels.slice(0,10);
  
      var pieTrace = {
        values: top10quantities,
        labels: top10ids,
        hovertext: top10labels,
        hoverinfo: 'hovertext',
        type: 'pie'
      };
      
      var pieData = [pieTrace];
  
      var pieLayout = {
        title: 'Top 10 Bacteria In This Belly Button Sample',
        showlegend: true
  
      };
      
      Plotly.newPlot("pie", pieData, pieLayout,{responsive: true});

    });



    // gauge Chart
    let gaugeEndpoint = '/metadata/' + sample;

    d3.json(gaugeEndpoint).then(function(selection){
      console.log('metadata:', selection);
      let wfreq = parseInt(selection['WFREQ'],10);
      console.log('wfreq', wfreq);
      let colorBar = "white"
      if(wfreq < 4){
        colorBar = "red";
      }else if(wfreq < 6){
        colorBar ="coral";
      }else{
        colorBar ="green";
      }
      let gaugeData = [{
        domain: {x: [0, 1], y: [0, 1]}, 
        value: wfreq,
        title: {text: "Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {axis:
          {range: [0, 10]},
          bar: {color: colorBar},
          borderwidth: 2,
          bordercolor: "gray",
          number:{color:colorBar},
          steps: [
            {range: [0, 2], color: 	'#ff3333'},
            {range: [2, 4], color: 	'	#ff6633'},
            {range: [4, 6], color: '#ffff4d'},
            {range: [6, 8], color: '#d2ff4d'},
            {range: [8, 10], color: '#4dff4d'},
          ],
          threshold: {line: 
            {color: "black", width: 4},
          thickness: 1, value: wfreq
          }
        }
      }];

      let gaugeLayout = {
        // width: 500,
        // height: 500,
        // margin: {t: 0, b: 0},
        font: {color: colorBar}
      };

      Plotly.newPlot("gauge",gaugeData,gaugeLayout,{responsive: true});
  });
}




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
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
