"use strict";

const groundFetchURl = "https://api.ohsome.org/v1/";

async function fetchData(url = '', data = {}) {
  let urlEncodedData = "",
      urlEncodedDataPairs = [];

  for( let key in data ) {
    if (data[key] !== "") {
      urlEncodedDataPairs.push( encodeURIComponent( key ) + '=' + encodeURIComponent(data[key]));
    }
  }
  urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );

  let response = await fetch(groundFetchURl+url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: urlEncodedData
  });
  return response.json();
}


const section_inputs = document.getElementById('inputs');
const section_results = document.getElementById('results');

let inputs = Array.from(section_inputs.children);
inputs = inputs.filter(obj => {
  return obj.nodeName == 'INPUT'
});
const sendbutton = document.getElementById('send');

sendbutton.addEventListener('click',function () {

  let sendData = {};
  for (let i = 1; i < inputs.length; i++) {
    sendData[inputs[i].name] = inputs[i].value;
  }

  fetchData(
    inputs[0].value,
    sendData
  )
  .then(data => {
      let outputString = "";
      outputString +="<p><b>Request</b>: "+inputs[0].value+'<br>'+JSON.stringify(sendData)+'<br></p>';

      if (data.groupByResult !== undefined) {
        console.log('test');
        for( let key in data.groupByResult ) {
          outputString += '<p>Gruppe: ' + data.groupByResult[key].groupByObject+'</p>';
          outputString += parseData(data.groupByResult[key]);
        }
      }
      else{
        outputString += parseData(data);
      }
      section_results.innerHTML += '<div class="result">'+outputString+'</div>';
  });

})


const parseData = (data) => {
  let rtn = "";
  if (data.result !== undefined) {
    rtn += "<table>";
    rtn += "<tr>";
    for( let key in data.result[0] ) {
      rtn += '<th>'+key+'</th>'
    }
    rtn += "</tr>";
    for (let i = 0; i < data.result.length; i++) {
      rtn += "<tr>";
      for( let key in data.result[i] ) {
        rtn += '<td>'+data.result[i][key]+'</td>'
      }
      rtn += "</tr>";
    }
    rtn += "</table>";
  }
  else{
    rtn += '<b>ERROR --> Response was:</b> : '+JSON.stringify(data)+'<br>'
  }
  return rtn;
}
