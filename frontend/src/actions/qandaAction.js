import Axios from 'axios';
import { QANDA_CREATE_FAIL, QANDA_LIST_SUCCESS, QANDA_CREATE_REQUEST, QANDA_LIST_REQUEST, QANDA_LIST_FAIL, QANDA_CREATE_SUCCESS, QANDA_DELETE_REQUEST, QANDA_DELETE_SUCCESS, QANDA_DELETE_FAIL, QANDA_UPDATE_SUCCESS, QANDA_UPDATE_FAIL, QANDA_DETAILS_SUCCESS, QANDA_DETAILS_FAIL, MESS_REPLY_QUESTION_FAIL, CREATE_NEW_QUESTION_FAIL, LIST_NEW_QUESTION_FAIL, LIST_NEW_QUESTION_SUCCESS, QUESTION_TRAIN_SUCCESS, DATASET_LIST_SUCCESS, DATASET_DETAIL_FAIL, DATASET_UPDATE_SUCCESS, QANDA_DETAILS_REQUEST } from '../constants/qandaConstans';
import { TEXT_TO_SPEECH_FAIL, MESS_REPLY_QUESTION_SUCCESS, TEXT_TO_SPEECH_SUCCESS, CREATE_NEW_QUESTION_SUCCESS, QUESTION_TRAIN_REQUEST, QUESTION_TRAIN_FAIL, DATASET_LIST_REQUEST, DATASET_LIST_FAIL, DATASET_DELETE_REQUEST, DATASET_DELETE_SUCCESS, LIST_NEW_QUESTION_REQUEST, DATASET_DETAIL_REQUEST, DATASET_DETAIL_SUCCESS, DATASET_UPDATE_FAIL } from './../constants/qandaConstans';



export const listQandas = () =>async (dispatch) =>{
    try {
        dispatch({type: QANDA_LIST_REQUEST});
        const {data} = await Axios.get('/api/qanda');
        dispatch({type: QANDA_LIST_SUCCESS, payload: data});
    
    } catch (error) {
        dispatch({type: QANDA_LIST_FAIL, payload: error.message});
    }
};


export const createQanda = (qanda) => async (dispatch, getState) => {
    dispatch({type: QANDA_CREATE_REQUEST, payload: qanda});
    const {userSignin: {userInfo}} = getState();
    try {
        const {data} = await Axios.post(
            '/api/qanda',
            {},
            {
                headers: {Authorization: `Bearer ${userInfo.token}`},
            }
        );
    dispatch({
        type:QANDA_CREATE_SUCCESS,
        payload: data.qanda,
    });
    } catch (error) {
        const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: QANDA_CREATE_FAIL, payload: message });
    }
}

export const detailQanda = (qandaId) => async (dispatch) =>{
    try {
        dispatch({type: QANDA_DETAILS_REQUEST, payload: qandaId});
        const {data} = await Axios.get("https://quocdatit.tk/update/chat-getlistquestions/" + qandaId);
        dispatch({type:QANDA_DETAILS_SUCCESS, payload: data});
    
    } catch (error) {
        dispatch({
            type: QANDA_DETAILS_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message
          });
    }
}

export const updateQanda = (qandaId, tag, answer) => async(dispatch)=>{
    const dataAPI = {
        tag: tag,
        responses: answer
    };
    try {
        const {data} = await Axios.post(`https://quocdatit.tk/update/chat-newquestions/${qandaId}`, dataAPI);
        dispatch({type: QANDA_UPDATE_SUCCESS, payload: data});
    } catch (error) {
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: QANDA_UPDATE_FAIL, payload: message });
    
    }
}

export const deleteQanda = (index) => async(dispatch)=>{
    dispatch({type: QANDA_DELETE_REQUEST, payload: index});
    // const {userSignin: {userInfo}} = getState();
    try {
        const {data} = Axios.get(`https://quocdatit.tk/update/chat-delete-newquestions/${index}`,
    //     {headers: {Authorization: `Bearer ${userInfo.token}`},
    // }
    )
    dispatch({type: QANDA_DELETE_SUCCESS, payload:data});
    } catch (error) {
        const message = 
        error.response && error.response.data.message   //message tu message ben orderRouter
          ? error.response.data.message
          : error.message;
        dispatch({type:QANDA_DELETE_FAIL, payload: message});
    }
}


// Chat bot API reply message
const api = `https://quocdatit.tk/chatbot/chat-run`;
export const replyMess = (userMail, name, request_question) => async(dispatch) =>{
    const dataAPI = {
        user: userMail,
        name: name,
        request_question: request_question
    };
    if(request_question){
        try {
            const {data} = await Axios.post(api, dataAPI);
            if (data){
                    dispatch({
                        type: MESS_REPLY_QUESTION_SUCCESS,
                        payload: data,
                    })
                }
            return data;
        } catch (error) {
            const message =
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            dispatch({ type: MESS_REPLY_QUESTION_FAIL, payload: message });
          }
    }
    
      
}

// Text to speech API
const apiTextToSpeech = `https://quocdatit.tk/texttospeech/soundAPI`;
export const textToSpeech = (text) => async(dispatch) => {
    const dataAPI = {text: text}
    try {
        const {data} = await Axios.post(apiTextToSpeech, dataAPI);
        if (data) {
            dispatch({
                type: TEXT_TO_SPEECH_SUCCESS, payload: data
            })
        }
        return data;
    } catch (error) {
        const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: TEXT_TO_SPEECH_FAIL, payload: message });
    }
}

//Create new Question
export const createNewQ = (question) => async(dispatch) => {
    try {
        const {data} = await Axios.post("/api/qanda/newQuestion", {"question":question});
        
        if(data){
            dispatch({type: CREATE_NEW_QUESTION_SUCCESS, payload: data});

        }
    } catch (error) {
        dispatch({
            type: CREATE_NEW_QUESTION_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message
          });
    }
}


//List question
export const listNewQuestions = () => async(dispatch) => {
    try {
        dispatch({type: LIST_NEW_QUESTION_REQUEST})
        const {data} = await Axios.get(`https://quocdatit.tk/update/chat-getlistquestions`);
            dispatch({type: LIST_NEW_QUESTION_SUCCESS, payload: data});
    
    } catch (error) {
        dispatch({
            type: LIST_NEW_QUESTION_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message
          });
    }
}

//TRAIN
export const trainQuestion = () => async(dispatch) => {
    dispatch({ type: QUESTION_TRAIN_REQUEST });
    try {
        const {data} = await Axios.get(`https://quocdatit.tk/chatbot/chat-training`);
        if (data){
            dispatch({type: QUESTION_TRAIN_SUCCESS, payload: data});
        }
    
    } catch (error) {
        dispatch({
            type: QUESTION_TRAIN_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message
          });
    }
}

//dataset 
export const listDatasets = () => async (dispatch) => {
    
    try {
        dispatch({type: DATASET_LIST_REQUEST});
        const {data} = await Axios.get(`https://quocdatit.tk/dataset/get-all-dataset`);
        if(data){
            dispatch({type: DATASET_LIST_SUCCESS, payload: data.intents});
        }
    
    } catch (error) {
        const message =
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({ type: DATASET_LIST_FAIL, payload: message });
      }
}

//delete dataset by tag
export const deleteDataset = (tag) => async (dispatch) => {
  dispatch({ type: DATASET_DELETE_REQUEST, payload: tag });
  const urlAPI = `https://quocdatit.tk/dataset/delete-dataset`;
  const dataAPI = {
    tag: tag,
  };
  try {
    const { data } = Axios.post(urlAPI, dataAPI);
    dispatch({ type: DATASET_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: MESS_REPLY_QUESTION_FAIL, payload: message });
  }
};

// Dataset detail 

export const detailDatasetTag = (index) => async (dispatch) =>{
    try {
        dispatch({type: DATASET_DETAIL_REQUEST, payload: index});
        const {data} = await Axios.get(`https://quocdatit.tk/dataset/get-tag-dataset/`+index);
        dispatch({type: DATASET_DETAIL_SUCCESS, payload: data});
    
    } catch (error) {
        dispatch({
            type: DATASET_DETAIL_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message
          });
    }
}

export const updateDataset = (tag, patterns, responses) => async(dispatch) =>{
    const dataAPI = {
        tag: tag,
        patterns: patterns,
        responses: responses
    };
    try {
        const {data} = await Axios.post(`https://quocdatit.tk/dataset/edit-dataset/`, dataAPI);
        dispatch({type: DATASET_UPDATE_SUCCESS, payload:data});
    
    } catch (error) {
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: DATASET_UPDATE_FAIL, payload: message });
    }
} 