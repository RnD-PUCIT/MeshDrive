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
import { setTagFilter } from '../../actions/filtering/applyFilters';

var filterTypes = require('./FilterTypes');
class TagsFilters extends Component {
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
        const items = this.props.filters.tagsList.map(t => {
            return (
                <DropdownItem className={t.active?"active":""}>{t.name}</DropdownItem>
            );
        })
        return (
            <span style={{ margin: '5px' }}>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret className="btn-gradient">
                        Tags / Labels
                    </DropdownToggle>
                    <DropdownMenu>

                        {items}

                    </DropdownMenu>
                </Dropdown>
            </span>


        )
    };

}
function mapStateToProps({ filters, user }) {

    return { filters, user };
}
export default connect(mapStateToProps, { setTagFilter })(requireAuth((TagsFilters)));
