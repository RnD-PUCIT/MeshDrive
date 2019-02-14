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
                    <DropdownToggle caret color="info" outline={(this.props.filters.Drive[0][filterTypes.GD] == false &&
      this.props.filters.Drive[1][filterTypes.OD] == false &&
      this.props.filters.Drive[2][filterTypes.DBX] == false)?"outline":""}>
                        Drive Type
  </DropdownToggle>
                    <DropdownMenu
                    >
                        <DropdownItem onClick={() => this.props.setDriveFilter(0, filterTypes.GD)}>
                        {this.props.filters["Drive"][0][filterTypes.GD]==true?<FAIcon icon="check" classes={["fa"]}/>:" "}  Google Drive</DropdownItem>
                        <DropdownItem onClick={() => this.props.setDriveFilter(1, filterTypes.OD)}
                        >
                        {this.props.filters["Drive"][1][filterTypes.OD]==true?<FAIcon icon="check" classes={["fa"]}/>:" "}  One Drive</DropdownItem>
                        <DropdownItem onClick={() => this.props.setDriveFilter(2, filterTypes.DBX)}
                        >
                        {this.props.filters["Drive"][2][filterTypes.DBX]==true?<FAIcon icon="check" classes={["fa"]}/>:" "}  Dropbox</DropdownItem>
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
