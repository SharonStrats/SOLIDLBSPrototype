// WILL NEED import * as $rdf from 'rdflib';
//import { keyframes } from 'emotion';
//import './results.css';
//import { min, updateLocale } from 'moment';
//import { deleteTriples } from '../../parse';
//import LoadingScreen from '../loadingSrceen';
//import { directive } from '@babel/types';
//import DisplayNav from './NavTabs/DisplalyNav';
//import EventDisplay from './EventDisplay/EventDisplay';
// MAY NEED var CUPurl;
var updateLocation;
var loadSetter;
var eventSetter;
// RG - 2019-02-28
// Loads the data from a URL into the local store

const loadFromUrl =  (url, store) => {
  return new Promise((resolve, reject) => {
    let fetcher = new $rdf.Fetcher(store);
    try {
      fetcher.load(url).then(response => {
        resolve(response.responseText);
        console.log(response.responseText);
        // $rdf.parse(response.responseText, store, $rdf.sym(url).uri,"application/rdf");
      });
    } catch (err) {
      reject(err);
    }
  });
}; 

// RG - 2019-02-28
// Prepares a query by converting SPARQL into a Solid query

const prepare = (qryStr, store) => {
  return new Promise((resolve, reject) => {
    try {
      let query = $rdf.SPARQLToQuery(qryStr, false, store);
      resolve(query);
    } catch (err) {
      reject(err);
    }
  });
};

// RG - 2019-02-28
// Executes a query on the local store

const execute = (qry, store) => {
  return new Promise((resolve, reject) => {
    // console.debug("here");
    const wanted = qry.vars;
    const resultAry = [];
    store.query(
      qry,
      results => {
        // console.debug("here1");
        if (typeof results === "undefined") {
          reject("No results.");
        } else {
          let row = rowHandler(wanted, results);
          // console.debug(row);
          if (row) resultAry.push(row);
        }
      },
      {},
      () => {
        resolve(resultAry);
      }
    );
  });
}; 

// RG - 2019-02-28
// Puts query results into an array according to the projection
 
const rowHandler = (wanted, results) => {
  const row = {};
  for (var r in results) {
    let found = false;
    let got = r.replace(/^\?/, "");
    if (wanted.length) {
      for (var w in wanted) {
        if (got === wanted[w].label) {
          found = true;
          continue;
        }
      }
      if (!found) continue;
    }
    row[got] = results[r].value;
  }
  return row;
}; 
async function updateLoc() {
  console.log('running update');
  document.getElementById('inputErrorMessage').innerHTML = '';
  let input = document.getElementById('locationInput').value;
  console.log(input);
  if (input === '') {
    document.getElementById('inputErrorMessage').innerHTML = 'please enter a city and a state';
  } else {
    let arr = input.split(" ");
    let state = arr[arr.length-1];
    let city = '';
    for (let x = 0; x < arr.length-1;x++){
      city += arr[x] + ' ';
    }
    eventSetter(false);
    await loadSetter(true);
    await updateLocation(city.trim(),state);
    await loadSetter(false);
  }
}
