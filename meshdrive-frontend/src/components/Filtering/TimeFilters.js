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
import { setTypeFilter, setTimeFilter } from '../../actions/filtering/applyFilters';

var filterTypes = require('./FilterTypes');
class TimeFilters extends Component {
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
            <span style={{ margin: '5px' }}>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret color="secondary" outline={(this.props.filters["CreationTime"][0][filterTypes.Today] == false &&
                        this.props.filters["CreationTime"][1][filterTypes.ThisWeek] == false &&
                        this.props.filters["CreationTime"][2][filterTypes.ThisMonth] == false &&
                        this.props.filters["CreationTime"][3][filterTypes.ThisYear] == false) ? "outline" : ""}>
                        Creation Time
  </DropdownToggle>
                    <DropdownMenu
                    >

                        <DropdownItem onClick={() => this.props.setTimeFilter(0, filterTypes.Today)}
                        >
                            {this.props.filters["CreationTime"][0][filterTypes.Today] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "}   Today
                        </DropdownItem>


                        <DropdownItem onClick={() => this.props.setTimeFilter(1, filterTypes.ThisWeek)}
                        >
                            {this.props.filters["CreationTime"][1][filterTypes.ThisWeek] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} This Week
                        </DropdownItem>

                        <DropdownItem onClick={() => this.props.setTimeFilter(2, filterTypes.ThisMonth)}
                        >
                            {this.props.filters["CreationTime"][2][filterTypes.ThisMonth] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} This Month
                        </DropdownItem>

                        <DropdownItem onClick={() => this.props.setTimeFilter(3, filterTypes.ThisYear)}
                        >
                            {this.props.filters["CreationTime"][3][filterTypes.ThisYear] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} This Year
                        </DropdownItem>


                    </DropdownMenu>
                </Dropdown>
            </span>


        )
    };

}
function mapStateToProps({ filters }) {

    return { filters };
}
export default connect(mapStateToProps, { setTypeFilter, setTimeFilter })(requireAuth((TimeFilters)));
