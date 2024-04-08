import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

const initialState = {
    sidebarShow: 'responsive',
    isUserLoggedIn: false,
    doctors: [],
    translators: [],
};

const sidebarState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest };
        default:
            return state;
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, isUserLoggedIn: true, loginErr: false };

        case 'SAVE_DOCTORS_TO_CACHE':
            const doctors = action.payload;

            return {
                ...state,
                doctors,
            };

        case 'SAVE_TRANSLATORS_TO_CACHE':
            const translators = action.payload;

            return {
                ...state,
                translators,
            };

        default:
            return state;
    }
};

const combinedReducer = combineReducers({ sidebarState, reducer });

const store = createStore(
    combinedReducer,
    devToolsEnhancer({
        trace: true,
    })
);

export default store;
