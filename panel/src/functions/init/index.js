import ensureStoredState from "./ensureStoredState";
import ensureUsername from "./ensureUsername";

const init = async function() {
    await ensureStoredState();
    await ensureUsername();
}

export default init;
