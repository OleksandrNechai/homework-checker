import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Alert } from 'react-bootstrap';
class FileSelector extends React.Component {
    constructor() {
        super();
        this.state = { selectedFilePath: '' };
    }
    handleFileChange(e) {
        this.setState({ selectedFilePath: e.currentTarget.value, selectedFile: e.currentTarget.files[0] });
    }

    render() {
        return (
            <div>
                <label className="btn btn-default btn-file" htmlFor="selectFile">Select .DWS file</label>
                <input type="file"
                    accept=".dws"
                    name="file"
                    style={{ display: 'none' }} onChange={this.handleFileChange.bind(this)}
                    id="selectFile" />

                {
                    this.state.selectedFilePath
                        ?
                        <div>
                            <Alert bsStyle="info" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <strong>The file is about to be sent for testing:</strong> {this.state.selectedFilePath}
                            </Alert>
                            <Button bsStyle="primary" onClick={() => this.props.onSelected(this.state.selectedFile)}>TEST IT!</Button>
                        </div>
                        : null
                }

            </div>
        );
    }
}
export default FileSelector;