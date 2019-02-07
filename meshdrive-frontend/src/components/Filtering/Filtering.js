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
import {bindActionCreators} from 'redux';
import {setTypeFilter,setTimeFilter} from '../../actions/filtering/applyFilters';
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
        return (
            <React.Fragment>

                <hr></hr>
                <span class="filter-btn">
                    <Button color="info" size="sm"
                        onClick={() => this.setState({ collapse: !this.state.collapse })}
                    >
                        <FAIcon icon="filter" classes={["fa"]} />
                        Filters
                    </Button>
                </span>

                <hr></hr>

                <Collapse isOpen={this.state.collapse}>

                    <Table>
                        <tr>
                            <th >Creation Time</th>
                            <th>Type</th>
                            <th>Size</th>
                        </tr>
                        <tr>
                            <td>
                         
                               
                                <div onClick={()=>this.props.setTimeFilter(0,filterTypes.Today)}>Today</div>
                                <div onClick={()=>this.props.setTimeFilter(1,filterTypes.ThisWeek)}>This Week</div>
                                <div onClick={()=>this.props.setTimeFilter(2,filterTypes.ThisMonth)}>This Month</div>
                                <div onClick={()=>this.props.setTimeFilter(3,filterTypes.ThisYear)}>This Year</div>
                            </td>
                            <td>
                                <Button onClick={()=>this.props.setTypeFilter(0,filterTypes.PDF)}>PDF Documents</Button>
                                <Button onClick={()=>this.props.setTypeFilter(1,filterTypes.Word)}>Word Documents</Button>
                                <Button onClick={()=>this.props.setTypeFilter(2,filterTypes.Spreadsheets)}>Spreadsheets</Button>
                                <Button onClick={()=>this.props.setTypeFilter(3,filterTypes.Pictures)}>Pictures</Button>
                                <Button onClick={()=>this.props.setTypeFilter(4,filterTypes.Videos)}>Video</Button>
                                <Button onClick={()=>this.props.setTypeFilter(5,filterTypes.Audios)}>Audio</Button>
                               
                            
                            </td>
                            <td>
                                {/* <tr> Less than  5MB  </tr>
                                <tr> Less than 50MB </tr>
                                <tr> Less than 100MB </tr>
                                <tr> Less than  500MB </tr>
                                <tr> Less than 1GB </tr>
                                <tr> Greater than 1GB </tr> */}
                            </td>
                        </tr>
                    </Table>

                </Collapse>
            </React.Fragment>
        );
    }
}
function mapStateToProps(state) {
    return{ filters:state.filters};
}
export default connect(mapStateToProps, {setTypeFilter,setTimeFilter})(requireAuth((Filtering)));
