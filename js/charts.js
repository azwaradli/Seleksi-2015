
function drawCO2Map(year) {
drawMarkersMap(year, "CO2EmissionTransportation", "chartCO2", "green", "#a70d15", "CO2 Emission from Transport (MMT)");
}

function drawElecticityRenewableMap(year) {
drawMarkersMap(year, "ElectricityByRenewable", "chartElectric", "brown", "yellow", "Renewable Electricity (GWh)");
}

function drawMarkersMap(year, dataset, div, colorOne, colorTwo, text) {
/* Ambil data */
var json = (function() {
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'url': "dataset/" + dataset + ".json",
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
    return json;
})();

var country = "Country";

var result = [];

json.forEach( function(entry) {
  var n = 0;
  if ( (entry[year] != "") && (entry[year] != null) ) {
    n = entry[year];

    if ( dataset == "ElectricityByRenewable" ) {
      n = n / 1000000;
    }

	  result.push([entry[country], n]);
  }
});
/* */

var data = new google.visualization.DataTable();
data.addColumn('string', 'Country');
data.addColumn('number', text);
data.addRows(result);

var options = {
  colorAxis: {colors: [colorOne, colorTwo]},
  backgroundColor: 'transparent',
};

var chart = new google.visualization.GeoChart(document.getElementById(div));
chart.draw(data, options);

google.visualization.events.addListener(chart, 'select', selectHandler);

function selectHandler(e) { 
  var selectedItem = chart.getSelection()[0];
  if (selectedItem) {
    var value = data.getValue(selectedItem.row, 0);
    //alert('The user selected ' + value);
    drawElectricPie(year, value);
    drawCO2Pie(year, value);
    $('#country_name').html('Detail data untuk negara ' + value);
  }
}
}

function drawChart(dataset, type) {
/* Ambil data */
var json = (function() {
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'url': "dataset/" + dataset + ".json",
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
    return json;
})();

//var totalEmission = [];
var RCEmission = [];
var IEmission = [];
var EEmission = [];
var OEmission = [];
var result = [];

json.forEach( function(entry) {
  var n = 0;
  /*if ( entry["Indicator Code"] == "EN.ATM.CO2E.KT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        totalEmission.push(parseFloat(entry[n]));
      } else {
        totalEmission.push(null);                
      }
    }
  } else*/ if ( entry["Indicator Code"] == "EN.CO2.BLDG.MT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        RCEmission.push(parseFloat(entry[n])*1000);
      } else {
        RCEmission.push(null);                
      }
    }
  } else if ( entry["Indicator Code"] == "EN.CO2.ETOT.MT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        EEmission.push(parseFloat(entry[n])*1000);
      } else {
        EEmission.push(null);                
      }
    }
  } else if ( entry["Indicator Code"] == "EN.CO2.MANF.MT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        IEmission.push(parseFloat(entry[n])*1000);
      } else {
        IEmission.push(null);                
      }
    }
  } else if ( entry["Indicator Code"] == "EN.CO2.OTHX.MT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        OEmission.push(parseFloat(entry[n])*1000);
      } else {
        OEmission.push(null);                
      }
    }
  } else if ( entry["Indicator Code"] == "EN.CO2.TRAN.MT" ) {
    for ( i = 1960; i <= 2014; ++i ) {
      n = i.toString();

      if ( (entry[n] != "") && (entry[n] != null) ) {
        if ( RCEmission[i-1960] != null ) {
          result.push([n, (parseFloat(entry[n])*1000), RCEmission[i-1960], IEmission[i-1960], OEmission[i-1960]]);
        }
      }
    }
  }
});

/* */

var data = new google.visualization.DataTable();
data.addColumn('string', 'Year');
//data.addColumn('number', 'Total Emission');
data.addColumn('number', 'Transportation Emission');
data.addColumn('number', 'Residential-Commercial Emission');
//data.addColumn('number', 'Electricity Generation Emission');
data.addColumn('number', 'Industrial Emission');
data.addColumn('number', 'Other Emission');

var options = {
  width: 600,
  height: 400,
  bar: {groupWidth: "95%"},
  legend: { position: "none" },
  vAxis: { title: 'Emission (million metric tons)', textPosition: 'none', gridlines: { color: 'transparent' }, },
  backgroundColor: '#FAFAFA',
  legend: { position: 'right' },
  animation:{
    duration: 250,
    startup: true 
  }
};

var index = 0;
var drawChart = function() {
                    if (index < result.length) {
                        data.addRow(result[index++]);
                        chart.draw(data, options);
                    }
                }


var chart = new google.visualization.LineChart(document.getElementById('columnchart_values'));
google.visualization.events.addListener(chart, 'animationfinish', drawChart);
chart.draw(data, options);
drawChart();


}

function drawCO2Pie(year, country) {
/* Ambil data */
var json = (function() {
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'url': "dataset/PieChartCO2.json",
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
    return json;
})();

var result = [];

json.forEach( function(entry) {
  var n = 0;
  
  if ( entry["Indicator Code"] == "EN.CO2.BLDG.MT" ) {

      if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
        result.push(["Residential-Commercial", parseFloat(entry[year])]);
      }

  } else if ( entry["Indicator Code"] == "EN.CO2.ETOT.MT" ) {

      if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
        result.push(["Electricity", parseFloat(entry[year])]);
      }

  } else if ( entry["Indicator Code"] == "EN.CO2.MANF.MT" ) {

      if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
        result.push(["Industrial", parseFloat(entry[year])]);
      }

  } else if ( entry["Indicator Code"] == "EN.CO2.OTHX.MT" ) {

      if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
        result.push(["Other", parseFloat(entry[year])]);
      }

  } else if ( entry["Indicator Code"] == "EN.CO2.TRAN.MT" ) {

      if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
        result.push(["Transportation", parseFloat(entry[year])]);
      }

  }
});

/* */
var data = new google.visualization.DataTable();
data.addColumn('string', 'Source');
data.addColumn('number', 'Emission');
data.addRows(result);

var options = {
  backgroundColor: 'transparent',
  legend: {textStyle: {color: 'white'}},
  animation:{
        duration: 1000,
        easing: 'out' 
  }
};

var chart = new google.visualization.PieChart(document.getElementById('piechart_CO2'));
chart.draw(data, options);
}

function drawElectricPie(year, country) {
/* Ambil data */
var json = (function() {
  var json = null;
  $.ajax({
      'async': false,
      'global': false,
      'url': "dataset/PieChartElectric.json",
      'dataType': "json",
      'success': function (data) {
          json = data;
      }
  });
    return json;
})();

var result = [];

json.forEach( function(entry) {
  var n = 0;

  if ( (entry["Country"] == country) && (entry[year] != "") && (entry[year] != null) ) {
    result.push(["Non-Renewable", parseFloat(entry[year])]);
    result.push(["Renewable", 100-parseFloat(entry[year])]);
  }

});

/* */
var data = new google.visualization.DataTable();
data.addColumn('string', 'Source');
data.addColumn('number', 'Emission');
data.addRows(result);

var options = {
  backgroundColor: 'transparent',
  legend: {textStyle: {color: 'white'}}
};

var chart = new google.visualization.PieChart(document.getElementById('piechart_Elec'));
chart.draw(data, options);
}
