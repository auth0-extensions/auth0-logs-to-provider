import React, { PropTypes, Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectContainer from 'redux-static';
import { Error, LoadingPanel, Pagination, TableTotals } from 'auth0-extension-ui';

import { logActions } from '../actions';

import LogsTable from '../components/LogsTable';
import LogsDialog from '../components/LogsDialog';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    logs: state.logs,
    filter: state.filter.toJS()
  });

  static actionsToProps = {
    ...logActions
  }

  static propTypes = {
    logs: PropTypes.object.isRequired,
    fetchLogs: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    openLog: PropTypes.func.isRequired,
    clearLog: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchLogs();
  }

  updateFilter = (status) => {
    this.props.setFilter(status);
    this.props.fetchLogs(1, status);
  };

  handleReload = () => {
    this.props.fetchLogs(1, this.props.filter.status);
  };

  handlePageChange = (page) => {
    this.props.fetchLogs(page, this.props.filter.status);
  };

  render() {
    const { error, records, total, loading, activeRecord } = this.props.logs.toJS();

    return (
      <div>
        <div className="col-xs-12">
          <div className="col-xs-6">
            <ul className="nav nav-pills">
              <li className={!this.props.filter.status ? 'active' : null} >
                <a onClick={() => this.updateFilter(false)}>All Runs</a>
              </li>
              <li className={this.props.filter.status ? 'active' : null}>
                <a onClick={() => this.updateFilter(true)}>Failed Runs</a>
              </li>
            </ul>
          </div>
          <ButtonToolbar className="pull-right">
            <Button bsSize="small" className="btn-default" onClick={this.handleReload}>
              <i className="icon icon-budicon-257" /> Reload
            </Button>
          </ButtonToolbar>
        </div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <div className="row">
            <div className="col-xs-12">
              <Error message={error} />
              <LogsTable error={error} records={records} showLogs={this.props.openLog} />
              <LogsDialog log={activeRecord} onClose={this.props.clearLog} />
            </div>
          </div>
        </LoadingPanel>
        <div>
          { total > 10 ?
            <Pagination
              totalItems={total}
              handlePageChange={this.handlePageChange}
              perPage={10}
            /> :
            <TableTotals currentCount={records.length} totalCount={total} />
          }
        </div>
      </div>
    );
  }
});
