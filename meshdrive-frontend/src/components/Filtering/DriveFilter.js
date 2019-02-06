import React, { Component } from "react";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,

} from "reactstrap";
import { connect } from 'react-redux';
import requireAuth from "../../hoc/requireAuth";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { bindActionCreators } from 'redux';
import { setDriveFilter} from '../../actions/filtering/applyFilters';

var filterTypes = require('./FilterTypes');
class DriveFilters extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    render() {
        return (
            <span style={{margin:'5px'}}>                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret className="btn-gradient">
                        Drive
  </DropdownToggle>
                    <DropdownMenu
                    >
                        <DropdownItem onClick={() => this.props.setDriveFilter(0, filterTypes.GD)}>Google Drive</DropdownItem>
                        <DropdownItem onClick={() => this.props.setDriveFilter(1, filterTypes.OD)}>One Drive</DropdownItem>
                        <DropdownItem onClick={() => this.props.setDriveFilter(2, filterTypes.DBX)}>Dropbox</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                </span>

   
        )
    };

}
function mapStateToProps(state) {
    return { filters: state.filters };
}
export default connect(mapStateToProps, { setDriveFilter })(requireAuth((DriveFilters)));
