// import {legacy_createStore as createStore, combineReducers} from 'redux';
import {legacy_createStore, combineReducers} from 'redux';
// import {createStore, combineReducers} from 'redux';
import {CollapsedReducer} from "./reducers/CollapsedReducer";
import {LoadingReducer} from "./reducers/LoadingReducer";

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const store = legacy_createStore(reducer);

export default store;


/*
// import {legacy_createStore as createStore, combineReducers} from 'redux';
import {legacy_createStore, combineReducers} from 'redux';
// import {createStore, combineReducers} from 'redux';
// createStore 将被废弃 ，可使用 legacy_createStore 或 legacy_createStore as createStore

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web（持久化存储到浏览器中，默认 localStorage）

import {CollapsedReducer} from "./reducers/CollapsedReducer";
import {LoadingReducer} from "./reducers/LoadingReducer";

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistConfig = {
    key: 'nnpn',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer);

const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store);


// const store = legacy_createStore(reducer);

// 这种导出方式无法使用
// export default {
//     store,
//     persistor
// }

const allstore = {
    store,
    persistor
}

export default allstore;*/
