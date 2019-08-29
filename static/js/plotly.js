// Created a pie chart of the sqlite data

// get data from the database
var db = openDatabase("../../db/bellybutton.sqlite", "1.0","bellybutton.sqlite",2*1024*1024);

function reader(){
  db.get('SELECT * FROM theTable WHERE id =?',[id,sample,EVENT,ETHNICITY,GENDER,AGE,WFREQ,BBTYPE,LOCATION,COUNTRY012,ZIP012,COUNTRY1319,ZIP1319,DOG,CAT,IMPSURFACE013,NPP013,MMAXTEMP013,PFC013,IMPSURFACE1319,NPP1319,MMAXTEMP1319,PFC1319],(err, result)=>{
    if (err){
      console.log(err)
    }else{
      let rows = result.rows;
      let values = rows.sample_values;
      let chartLabels = rows.otu_ids;
      let hoverLabels = rows.otu_labels;
    }
  })
}

var data = [{
    values: values,
    labels: chartLabels,
    type: 'pie'
  }];
  
  var layout = {
    hovertext: hoverLabels,
    height: 400,
    width: 500
  };
  
  Plotly.newPlot('pie', data, layout);

  // OR... ?

function buildPlot() {
  /* data route */
  var url = "/samples/<sample>";
    d3.json(url).then(data => {
      Plotly.newPlot('plot', data,layout);
    });
}

buildPlot();

  