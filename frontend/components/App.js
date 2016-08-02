'use strict';

const React = require('react');
const _     = require('lodash');
require('whatwg-fetch');

const NewsElement = require('./NewsElement');
const Modal       = require('./Modal');


const App = React.createClass({
  getInitialState: function() {
    return {
      news:         [],
      searchString: '',
      isLoad:       false
    };
  },

  componentDidMount: function() {
    fetch('/v1/news')
      .then(res => {
        return res.json();
      })
      .then(({data}) => {
        this.setState({
          news:   data,
          isLoad: true
        })
      })
  },

  searchHandler: function(e) {
    this.setState({
      searchString: e.target.value.trim()
    })
  },

  setArticleValues: function(id, values) {
    let news    = _.clone(this.state.news);
    let article = _.find(this.state.news, {id});
    _.merge(article, values);

    this.setState({news});
  },

  render: function() {
    const state = this.state;

    if (!state.isLoad) {
      return (
        <div className="load-container center">
          <div className="load-speeding-wheel"></div>
        </div>
      );
    }

    let news = state.news;

    if (state.searchString) {
      news = news.filter(article => article
        .title
        .trim()
        .toLowerCase()
        .indexOf(state.searchString.toLowerCase()) > -1
      )
    }

    let newsFeed = news
      .sort((a, b) => {
        if (a.likes > b.likes) {
          return -1;
        }
        if (a.likes < b.likes) {
          return 1;
        }

        return 0;
      })
      .map(item => {
        return (
          <NewsElement
            news={item}
            setArticleValues={this.setArticleValues}
            key={item.id}
          />);
      });

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="#">
                News
              </a>
            </div>
            <div className="navbar-form navbar-right">
              <div className="input-group">
                <input type="text"
                       className="form-control"
                       placeholder="Search"
                       value={state.searchString}
                       onChange={this.searchHandler}/>
                <span className="input-group-addon">
                  <span className="glyphicon glyphicon-search"></span>
                </span>
              </div>
            </div>
          </div>
        </nav>

        {
          newsFeed.length ?
            newsFeed :
            <h2 className="text-center">Not found</h2>
        }

      </div>
    )
  }
});

module.exports = App;
