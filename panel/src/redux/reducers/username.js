import initialState from "../initialState";

const username = function(state = initialState.username, action) {
    if (action.type === 'SET_USERNAME') {
        const username = action.payload;
        return username;
        // return {
        //     ...state,
        //     username,
        // }
    }
    return state;
}

export default username;
