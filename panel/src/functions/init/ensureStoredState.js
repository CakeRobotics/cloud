import getStoredState from "redux-persist/es/getStoredState";
import { persistConfig } from "../../redux/store";

const ensureStoredState = async function() {
    await getStoredState(persistConfig);
}

export default ensureStoredState;
