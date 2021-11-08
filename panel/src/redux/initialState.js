const initialState = {
    projects: {
        current: {
            name: null,
            code: "",
            dirty: false,
            state: 'EDITING', // EDITING, SAVING
            props: null,
            info: null, // FIXME: What's this?
        }
    },
    toasts: [], // Toast: { time, title, color?, subtitle?, body? }
    username: null,
    logsEndpoint: null,
};

export default initialState;
