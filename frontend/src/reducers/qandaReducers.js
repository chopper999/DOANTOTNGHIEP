import { CREATE_NEW_QUESTION_FAIL, LIST_NEW_QUESTION_FAIL, MESS_REPLY_QUESTION_FAIL, MESS_REPLY_QUESTION_SUCCESS, QANDA_CREATE_FAIL, QANDA_CREATE_REQUEST, QANDA_DELETE_FAIL, QANDA_DELETE_REQUEST, QANDA_LIST_REQUEST, QANDA_LIST_SUCCESS, QANDA_UPDATE_FAIL, QANDA_UPDATE_REQUEST, TEXT_TO_SPEECH_FAIL } from "./../constants/qandaConstans";
import { QANDA_DETAILS_FAIL, QANDA_DETAILS_REQUEST, QANDA_LIST_FAIL, QANDA_CREATE_SUCCESS, QANDA_CREATE_RESET, QANDA_DELETE_SUCCESS, QANDA_DELETE_RESET, QANDA_UPDATE_SUCCESS, QANDA_DETAILS_SUCCESS, TEXT_TO_SPEECH_SUCCESS, CREATE_NEW_QUESTION_SUCCESS, LIST_NEW_QUESTION_SUCCESS } from './../constants/qandaConstans';

export const qandaListReducer = (state = {loading: true, qandas: []}, action) => {
    switch (action.type) {
        case QANDA_LIST_REQUEST:
            return {loading: true};
        case QANDA_LIST_SUCCESS:  
            return {loading: false, qandas: action.payload.qandas}
        case QANDA_LIST_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
};

export const qandaCreateReducer = (state={}, action) => {
    switch (action.type) {
        case QANDA_CREATE_REQUEST:
            return {loading: true};
        case QANDA_CREATE_SUCCESS:
            return {loading: false, success: true, qanda: action.payload};
        case QANDA_CREATE_FAIL:
            return {loading: false, error: action.payload};
        case QANDA_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const qandaDetailReducer = (state={loading:true}, action) =>{
    switch (action.type) {
        case QANDA_DETAILS_REQUEST:
            return {loading: true};
        case QANDA_DETAILS_SUCCESS:
            return {loading: false, qanda: action.payload};
        case QANDA_DETAILS_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
};

export const qandaUpdateReducer = (state={}, action) => {
    switch (action.type) {
        case QANDA_UPDATE_REQUEST:
            return {loading: true};
        case QANDA_UPDATE_SUCCESS:
            return {loading: false, success: true, qanda: action.payload};
        case QANDA_UPDATE_FAIL:
            return {loading: false, error: action.payload};
        case QANDA_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const qandaDeleterReducer = (state={}, action) =>{
    switch (action.type) {  
        case QANDA_DELETE_REQUEST:
            return {loading: true};
        case QANDA_DELETE_SUCCESS:
            return {loading: false, success: true};
        case QANDA_DELETE_FAIL:
            return {loading: false, error: action.payload};
        case QANDA_DELETE_RESET:
            return {};
        default:
            return state;
    }
};

export const messReplyReducer = (state={}, action)=> {
    switch (action.type) {
        case MESS_REPLY_QUESTION_SUCCESS:
            return {loading: false, success: true, mess:action.payload};
        case MESS_REPLY_QUESTION_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}
export const textToSpeechReducer = (state={}, action) =>{
    switch (action.type) {
        case TEXT_TO_SPEECH_SUCCESS:
            return {loading: false, success: true, text:action.payload};
        case TEXT_TO_SPEECH_FAIL:
            return {loading:false, error: action.payload};
        default:
            return state;
    }
}

export const createNewQuestionReducer = (state={}, action) =>{
    switch (action.type) {
        case CREATE_NEW_QUESTION_SUCCESS:
            return {loading: false, success: true, question: action.payload};
        case CREATE_NEW_QUESTION_FAIL:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}

export const listNewQuestionReducer = (state={}, action)=>{
    switch (action.type) {
        case LIST_NEW_QUESTION_SUCCESS:
            return {loading:false, success: true, questions: action.payload};
        case LIST_NEW_QUESTION_FAIL:
            return {loading: false, error: action.payload};
    
        default:
            return state;
    }
}