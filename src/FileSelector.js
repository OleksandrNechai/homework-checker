import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
class FileSelector extends React.Component {
    constructor() {
        super();
        this.state = { selectedFilePath: '' };
    }
    handleFileChange(e) {
        this.setState({ selectedFilePath: e.currentTarget.value, selectedFile: e.currentTarget.files[0] });
    }
    handleFileSelected() {
        var extension = getExtension(this.state.selectedFile.name);
        if (/(dws|DWS)$/ig.test(extension)) {
            this.props.onSelected(this.state.selectedFile);
        } else {
            NotificationManager.error(
                'Only .DWS files are allowed.', 'Wrong extension file.', 60 * 1000);
        }
        this.setState({ selectedFilePath: '' });

        function getExtension(filename) {
            var parts = filename.split('.');
            return parts[parts.length - 1];
        }
    }
    render() {
        return (
            <div>
                {/* This strange doble lable solves Edge crazy bug*/}
                <label className="btn btn-default btn-file" htmlFor="selectFile">Select .DWS file</label>
                <input type="file"
                    accept=".dws"
                    name="file"
                    style={{ display: 'none' }} onChange={this.handleFileChange.bind(this)}
                    id="selectFile"
                    value={this.state.selectedFilePath} />
                <label htmlFor="inputID"></label>

                {
                    this.state.selectedFilePath
                        ?
                        <div>
                            <Alert bsStyle="info" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <strong>The file is about to be sent for testing:</strong> {this.state.selectedFilePath}
                            </Alert>
                            <Button bsStyle="primary" onClick={this.handleFileSelected.bind(this)}>TEST IT!</Button>
                        </div>
                        : null
                }
                <NotificationContainer />
            </div>
        );
    }
}
export default FileSelector;