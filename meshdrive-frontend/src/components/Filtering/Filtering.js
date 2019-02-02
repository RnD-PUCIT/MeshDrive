import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
class Filtering extends Component {
    state = {
        showModal: false
    };

    handleFolderModalCancel = e => {
        e.preventDefault();
        this.setState(
            {
                showModal: false
            }
        );
    };
    handleFolderSubmit = e => {
        e.preventDefault();
        this.setState(
            {
                showModal: false

            }
        );
    }


    render() {
        return (
            <React.Fragment>
                <span class="filter-btn">
                    <Button color="info" size="sm"
                        onClick={() => this.setState({ showModal: true })}
                    >
                        <FAIcon icon="filter" classes={["fa"]} />
                           Filters
        </Button>
                </span>

                <Modal
                    centered
                    isOpen={this.state.showModal}
                    onAbort={this.handleFolderModalCancel}
                >

                    <ModalHeader>Select a filter</ModalHeader>
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={!this.state.valid}>
                            Apply
              </Button>
                        <Button color="secondary" onClick={this.handleFolderModalCancel}>
                            Cancel
              </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        );
    }
}
export default (Filtering);
