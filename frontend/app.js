'use strict';

const React  = require('react');
const render = require('react-dom').render;

const App = require('./components/App');


render(
  <App/>,
  document.getElementById('root')
);
