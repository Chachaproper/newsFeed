'use strict';

const React = require('react');

const Modal = React.createClass({
  openHandler: function() {
    document.body.classList.add('modal-open');
  },

  closeHandler: function(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    document.body.classList.remove('modal-open');
    this.props.onCloseHandler();
  },

  componentDidMount: function() {
    if (this.props.isOpen) {
      this.openHandler();
    } else {
      this.closeHandler();
    }
  },

  render: function() {
    const props = this.props;

    return (
      <div>
        <div className={`modal fade ${props.isOpen ? 'in block' : ''}`}
             onClick={this.closeHandler}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button className="close"
                        onClick={this.closeHandler}>
                  ×
                </button>

                <h4>{props.modalTitle}</h4>
              </div>

              {props.children}
            </div>
          </div>
        </div>

        <div
          className={`modal-backdrop fade ${props.isOpen ? 'in' : ''}`}></div>
      </div>
    );
  }
});

if (process.env.NODE_ENV !== 'production') {
  Modal.propTypes = {
    isOpen:         React.PropTypes.bool,
    modalTitle:     React.PropTypes.string,
    onCloseHandler: React.PropTypes.func
  };
}

module.exports = Modal;
