import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { initPromise } from '../App';

import rootReducer from './reducers';

const persistConfig = {
    key: 'root_redux_store',
    storage,
    whitelist: ['username'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

// Use this function to avoid early access to store (that's, before persistent values are loaded)
const getState = async function() {
    await initPromise;
    return await store.getState();
}
const dispatch = store.dispatch;
const rawStore = store;

export { rawStore, persistor, persistConfig, getState, dispatch };
