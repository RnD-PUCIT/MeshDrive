import React, { Component } from "react";
import {
    Button,
    NavLink,
    Collapse,
    Table,
} from "reactstrap";
import { connect } from 'react-redux';
import requireAuth from "../../hoc/requireAuth";
import FAIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import { bindActionCreators } from 'redux';
import { setTypeFilter, setTimeFilter } from '../../actions/filtering/applyFilters';
import TimeFilters from "./TimeFilters";
import TypeFilters from "./TypeFilters";
import DriveFilter from "./DriveFilter";
import SizeFilter from "./SizeFilter";
import TagsFilter from "./TagsFilter";
import SpeechSearchBar from "../SpeechSearching/SpeechSearchBar";
var filterTypes = require('./FilterTypes');

class Filtering extends Component {
    state = {
        collapse: false
    };

    handleFolderModalCancel = e => {
        e.preventDefault();
        this.setState(
            {
                showModal: false
            }
        );
    };

    render() {
        const divStyle = {
            display: 'flex',
            alignItems: 'center',
            float:'right'
        };

        return (
            <React.Fragment>

                <hr></hr>
                <SpeechSearchBar/>
                    <span style={divStyle}>
                        <TypeFilters />
                        <TimeFilters />
                        <DriveFilter/>
                        <TagsFilter/>
                        {/* <SizeFilter/> */}                  
                    </span>
                   
              
               
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    return { filters: state.filters };
}
export default connect(mapStateToProps, { setTypeFilter, setTimeFilter })(requireAuth((Filtering)));
