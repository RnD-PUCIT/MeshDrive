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
            <span style={{ margin: '5px' }}>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret color="warning" outline={(this.props.filters.Type[0][filterTypes.PDF] == false &&
                        this.props.filters.Type[1][filterTypes.Word] == false &&
                        this.props.filters.Type[2][filterTypes.Spreadsheets] == false &&
                        this.props.filters.Type[3][filterTypes.Pictures] == false &&
                        this.props.filters.Type[4][filterTypes.Videos] == false &&
                        this.props.filters.Type[5][filterTypes.Audios] == false) ? "outline" : ""} >
                        File Type
  </DropdownToggle>
                    <DropdownMenu>

                        <DropdownItem onClick={() => this.props.setTypeFilter(0, filterTypes.PDF)}
                        > {this.props.filters["Type"][0][filterTypes.PDF] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} PDF Documents</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(1, filterTypes.Word)}
                        > {this.props.filters["Type"][1][filterTypes.Word] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} Word Documents</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(2, filterTypes.Spreadsheets)}
                        >{this.props.filters["Type"][2][filterTypes.Spreadsheets] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} Spreadsheets</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(3, filterTypes.Pictures)}
                        >{this.props.filters["Type"][3][filterTypes.Pictures] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} Pictures</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(4, filterTypes.Videos)}
                        > {this.props.filters["Type"][4][filterTypes.Videos] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} Video</DropdownItem>
                        <DropdownItem onClick={() => this.props.setTypeFilter(5, filterTypes.Audios)}
                        > {this.props.filters["Type"][5][filterTypes.Audios] == true ? <FAIcon icon="check" classes={["fa"]} /> : " "} Audio</DropdownItem>


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
