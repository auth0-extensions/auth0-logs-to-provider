import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Table, TableAction, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

export default class LogsTable extends Component {
  static propTypes = {
    showLogs: React.PropTypes.func.isRequired,
    error: React.PropTypes.string,
    records: React.PropTypes.array.isRequired
  };

  render() {
    const { error, records } = this.props;
    if (!error && records.size === 0) {
      return <div>There are no logs available.</div>;
    }

    return (
      <div>
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="10%">Status</TableColumn>
            <TableColumn width="20%">Start</TableColumn>
            <TableColumn width="20%">End</TableColumn>
            <TableColumn width="15%">Logs Processed</TableColumn>
            <TableColumn width="20%">Checkpoint</TableColumn>
            <TableColumn width="12%" />
          </TableHeader>
          <TableBody>
            {records.map((record, index) => {
              const success = !record.error;
              const color = success ? 'green' : '#A93F3F';
              const status = success ? 'Success' : 'Failed';
              return (
                <TableRow key={index}>
                  <TableIconCell color={color} icon="446" />
                  <TableTextCell>{status}</TableTextCell>
                  <TableTextCell>{record.start}</TableTextCell>
                  <TableTextCell>{record.end}</TableTextCell>
                  <TableTextCell>{record.logsProcessed}</TableTextCell>
                  <TableTextCell>{record.checkpoint}</TableTextCell>
                  <TableCell>
                    <ButtonToolbar style={{ marginBottom: '0px' }}>
                      <TableAction
                        id={`view-${index}`} type="default" title="Show Logs" icon="489"
                        onClick={() => this.props.showLogs(record)}
                      />
                    </ButtonToolbar>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}
