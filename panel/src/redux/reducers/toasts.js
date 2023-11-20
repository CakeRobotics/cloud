import produce from "immer";
import initialState from "../initialState";

const toasts = function(state = initialState.toasts, action) {
    if (action.type === 'ADD_TOAST') {
        const toast = action.payload;
        return produce(state, draft => {
            draft.push(toast);
        });
    } else if (action.type === 'REMOVE_TOAST') {
        const time = action.payload;
        return state.filter(toast => toast.time !== time);
    }
    return state;
}

export default toasts;
