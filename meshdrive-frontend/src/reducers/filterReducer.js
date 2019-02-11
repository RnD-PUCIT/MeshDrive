import {
    SET_TAG_FILTER,
    SET_TYPE_FILTER,
    SET_TIME_FILTER,
    RESET_FILTERS,
    SET_DRIVE_FILTER,
    SET_SIZE_FILTER
} from "../actions/filtering/types";
var filterTypes = require('../components/Filtering/FilterTypes');
const initialState = {
    "CreationTime":
        [{ "Today": false },
        { "This Month": false },
        { "This Year": false }],
    "Type": [
        { "PDF Documents": false },
        { "Word Documents": false },
        { "Spreadsheets": false },
        { "Pictures": false },
        { "Videos": false },
        { "Audios": false }
    ],
    "Drive": [
        {
            "googledrive": false
        },
        {
            "onedrive": false
        },
        {
            "dropbox": false
        }
    ],
    "Size": [
        { "Less than 5MB": false },
        { "Less than 50MB": false },
        { "Less than 100MB": false },
        { "Less than 1GB": false },
        { "More than 1GB": false },
    ],
    "tagsList": []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TYPE_FILTER:
            state.Type[action.payload.index][action.payload.value] = !state.Type[action.payload.index][action.payload.value];
            return { ...state };

        case SET_TIME_FILTER: {
            state.CreationTime[action.payload.index][action.payload.value] = !state.CreationTime[action.payload.index][action.payload.value];
            if (action.payload.index == 0) {
                state.CreationTime[1]["This Month"] = false;
                state.CreationTime[2]["This Year"] = false;
            }
            if (action.payload.index == 1) {
                state.CreationTime[0]["Today"] = false;
                state.CreationTime[2]["This Year"] = false;
            }
            if (action.payload.index == 2) {
                state.CreationTime[1]["This Month"] = false;
                state.CreationTime[0]["Today"] = false;
            }
            return { ...state };
        }

        case SET_DRIVE_FILTER:
            state.Drive[action.payload.index][action.payload.value] = !state.Drive[action.payload.index][action.payload.value];
            return { ...state };

        case SET_SIZE_FILTER:
            state.Size[action.payload.index][action.payload.value] = !state.Size[action.payload.index][action.payload.value];
            return { ...state };

        case SET_TAG_FILTER: {
            var name = action.payload
            let index = state.tagsList.findIndex(t => t === name);
            if (index != -1) {
                state.tagsList.splice(index, 1);
            } else
                state.tagsList.push(name);
            return { ...state };
        }

        case RESET_FILTERS:
            return { ...initialState };

    }
    return state;
}
