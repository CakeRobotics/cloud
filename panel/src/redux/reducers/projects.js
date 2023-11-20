import produce from "immer";
import initialState from "../initialState";

const projects = function(state = initialState.projects, action) {
    if (action.type === 'SET_CODE') {
        if (state.current.state !== 'EDITING') {
            return state;
        }
        const code = action.payload;
        return produce(state, draft => {
            draft.current.code = code;
        });
    } else if (action.type === 'SET_PROJECT_NAME') {
        const projectName = action.payload;
        return produce(state, draft => {
            draft.current.name = projectName;
        });
    } else if (action.type === 'SET_EDITOR_DIRTY') {
        const editorDirty = action.payload;
        return produce(state, draft => {
            draft.current.dirty = editorDirty;
        });
    } else if (action.type === 'SET_EDITOR_STATE') {
        const editorState = action.payload;
        return produce(state, draft => {
            draft.current.state = editorState;
        });
    } else if (action.type === 'SET_PROJECT_INFO') {
        const editorState = action.payload;
        return produce(state, draft => {
            draft.current.info = editorState;
        });
    } else if (action.type === 'SET_PROPS') {
        const props = action.payload;
        return produce(state, draft => {
            draft.current.props = props;
        });
    }
    return state;
}

export default projects;
