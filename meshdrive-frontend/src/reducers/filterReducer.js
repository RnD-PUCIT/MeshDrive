import { SET_TYPE_FILTER, SET_TIME_FILTER,UNSET_FILTER, RESET_FILTERS } from "../actions/filtering/types";
var filterTypes = require('../components/Filtering/FilterTypes');
const initialActiveFileIdsState = {
    "CreationTime":
        [{ "Today": false },
        { "This Week": false },
        { "This Month": false },
        { "This Year": false }],
    "Type": [
        { "PDF Documents": false },
        { "Word Documents": false },
        { "Spreadsheets": false },
        { "Pictures": false },
        { "Videos": false },
        { "Audios": false }
    ]
};

export default function (state = initialActiveFileIdsState, action) {
    switch (action.type) {
        case SET_TYPE_FILTER:
            state.Type[action.payload.index][action.payload.value]=true;
        return {...state};
    
        case SET_TIME_FILTER:
        state.CreationTime[action.payload.index][action.payload.value]=true;
        return {...state};

    }
    return state;
}
