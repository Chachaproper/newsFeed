'use strict';

const React = require('react');
const Modal = require('./Modal');
require('whatwg-fetch');


const NewsElement = React.createClass({
  getInitialState: function() {
    return {
      modalIsOpen: false,
      isLike:      false,
      likes:       0
    }
  },

  openModalHandler: function() {
    this.setState({
      modalIsOpen: true
    });
  },

  closeModalHandler: function() {
    this.setState({
      modalIsOpen: false
    });
  },

  setLikeHandler: function() {
    const isLike = !this.state.isLike;
    const id     = this.props.news.id;

    fetch('/v1/like/' + id, {
      method: isLike ? 'POST' : 'DELETE'
    })
      .then(res => {
        return res.json();
      })
      .then(({likes}) => {
        this.setState({
          isLike,
          likes
        }, () => {
          this.props.setArticleValues(id, {likes, isLike})
        });
      });
  },

  componentDidMount: function() {
    this.setState({
      likes:  this.props.news.likes,
      isLike: Boolean(this.props.news.isLike)
    })
  },

  render: function() {
    const news  = this.props.news;
    const state = this.state;

    const description = news.description.slice(0, 25) + '...';

    return (
      <div>
        <div className="news" onClick={this.openModalHandler}>
          <div className="news-img-container pull-left">
            <img className="news-img" src={news.poster} alt=""/>
          </div>

          <div className="news-body">
            <h4 className="news-title">{news.title}</h4>
            <p className="news-desc">{description}</p>
          </div>
          <div className="news-views text-right">
            <span
              className={`glyphicon glyphicon-thumbs-up  ${state.isLike ? 'like' : ''}`}></span> {state.likes}
          </div>
        </div>

        {
          state.modalIsOpen ?
            <Modal isOpen={state.modalIsOpen}
                   modalTitle={news.title}
                   onCloseHandler={this.closeModalHandler}>

              <div className="modal-body">
                <img className="modal-img" src={news.poster}
                     alt={news.title}/>

                {news.description}
              </div>

              <div className="modal-footer">
                <button
                  className={`btn btn-like ${state.isLike ? 'btn-primary' : ''}`}
                  onClick={this.setLikeHandler}>
                  <span className="glyphicon glyphicon-thumbs-up"></span>
                  <span className="badge">{state.likes}</span>
                </button>
              </div>

            </Modal>
            : undefined
        }
      </div>
    )
  }
});

if (process.env.NODE_ENV !== 'production') {
  NewsElement.propTypes = {
    news:             React.PropTypes.object.isRequired,
    setArticleValues: React.PropTypes.func.isRequired
  };
}

module.exports = NewsElement;
