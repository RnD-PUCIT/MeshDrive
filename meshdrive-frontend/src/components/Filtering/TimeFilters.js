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
            <span style={{margin:'5px'}}>              
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret className="btn-gradient">
                        Creation Time
  </DropdownToggle>
                    <DropdownMenu
                    >

                        <DropdownItem onClick={() => this.props.setTimeFilter(0, filterTypes.Today)} 
                         className={this.props.filters["CreationTime"][0][filterTypes.Today]==true?"active":""}
                       >
                        Today
                        </DropdownItem>

                    
                        <DropdownItem onClick={() => this.props.setTimeFilter(1, filterTypes.ThisWeek)}
                         className={this.props.filters["CreationTime"][1][filterTypes.ThisWeek]==true?"active":""}>
                        This Week
                        </DropdownItem>

                        <DropdownItem onClick={() => this.props.setTimeFilter(2, filterTypes.ThisMonth)}
                         className={this.props.filters["CreationTime"][2][filterTypes.ThisMonth]==true?"active":""}>
                        This Month
                        </DropdownItem>

                        <DropdownItem onClick={() => this.props.setTimeFilter(3, filterTypes.ThisYear)}
                         className={this.props.filters["CreationTime"][3][filterTypes.ThisYear]==true?"active":""}>
                        This Year
                        </DropdownItem>


                    </DropdownMenu>
                </Dropdown>
                </span>

   
        )
    };

}
function mapStateToProps({filters}) {
   
    return { filters};
}
export default connect(mapStateToProps, { setTypeFilter, setTimeFilter })(requireAuth((TimeFilters)));
