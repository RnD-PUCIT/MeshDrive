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
class TypeFilters extends Component {
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
                <Dropdown  isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret className="btn-gradient" >
                        File Type
  </DropdownToggle>
                    <DropdownMenu>

                        <DropdownItem onClick={() => this.props.setTypeFilter(0, filterTypes.PDF)}
                         className={this.props.filters["Type"][0][filterTypes.PDF]==true?"active":""}>PDF Documents</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(1, filterTypes.Word)}
                         className={this.props.filters["Type"][1][filterTypes.Word]==true?"active":""}>Word Documents</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(2, filterTypes.Spreadsheets)}
                         className={this.props.filters["Type"][2][filterTypes.Spreadsheets]==true?"active":""}>Spreadsheets</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(3, filterTypes.Pictures)}
                         className={this.props.filters["Type"][3][filterTypes.Pictures]==true?"active":""}>Pictures</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(4, filterTypes.Videos)}
                         className={this.props.filters["Type"][4][filterTypes.Videos]==true?"active":""}>Video</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(5, filterTypes.Audios)}
                         className={this.props.filters["Type"][5][filterTypes.Audios]==true?"active":""}>Audio</DropdownItem>


                    </DropdownMenu>
                </Dropdown>
                </span>
     

        )
    };

}
function mapStateToProps(state) {
    return { filters: state.filters };
}
export default connect(mapStateToProps, { setTypeFilter, setTimeFilter })(requireAuth((TypeFilters)));
