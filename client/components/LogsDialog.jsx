import React, { Component } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import './LogsDialog.css';

export default class LogsDialog extends Component {
  static propTypes = {
    log: React.PropTypes.object,
    onClose: React.PropTypes.func.isRequired
  };

  render() {
    if (!this.props.log) {
      return <div />;
    }

    const log = this.props.log;

    let message = `checkpoint: ${log.checkpoint}\nstart: ${log.start}\nend: ${log.end}\nlogsProcessed: ${log.logsProcessed}\n`;

    if (log.error) {
      message += `error: ${JSON.stringify(log.error)}\n`
    }

    return (
      <Modal dialogClassName="logs-dialog" show={this.props.log !== null} onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{log.checkpoint}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{message}</pre>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button bsSize="small" onClick={this.props.onClose}>
              <i className="icon icon-budicon-501"></i> Close
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}
