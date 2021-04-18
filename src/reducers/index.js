import { combineReducers } from 'redux';
import  * as actionTypes from '../actions/types';

const initialUserState = {
    currentUser : null,
    isLoading : true
};

const user_reducer = (state = initialUserState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                currentUser : action.payload.currentUser,
                isLoading : false
            }
            break;
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }    
        default:
            return state;
            break;
    }
}

const initialChannelState = {
    currentChannel: null,
    isPrivateChannel:false
}

const channel_reducer = (state = initialChannelState, action) =>{
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel : action.payload.currentChannel,
            }
            break;  
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel : action.payload.isPrivateChannel,
            }
            break;  
        default:
            return state;
            break;
    }
}

const rootReducer = combineReducers({
    user: user_reducer,
    channel: channel_reducer
});

export default rootReducer;