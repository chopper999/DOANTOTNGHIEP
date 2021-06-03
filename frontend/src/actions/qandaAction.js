import Axios from 'axios';
import { QANDA_CREATE_FAIL, QANDA_LIST_SUCCESS, QANDA_CREATE_REQUEST, QANDA_LIST_REQUEST, QANDA_LIST_FAIL, QANDA_CREATE_SUCCESS, QANDA_DELETE_REQUEST, QANDA_DELETE_SUCCESS, QANDA_DELETE_FAIL, QANDA_UPDATE_REQUEST, QANDA_UPDATE_SUCCESS, QANDA_UPDATE_FAIL, QANDA_DETAILS_REQUEST, QANDA_DETAILS_SUCCESS, QANDA_DETAILS_FAIL } from '../constants/qandaConstans';

export const listQandas = ({}) =>async (dispatch) =>{
    try {
        dispatch({type: QANDA_LIST_REQUEST});
        const {data} = await Axios.get('/api/qanda');
        dispatch({type: QANDA_LIST_SUCCESS, payload: data});
    
    } catch (error) {
        dispatch({type: QANDA_LIST_FAIL, payload: error.message});
    }
};


export const createQanda = qanda => async (dispatch, getState) => {
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
        const {data} = await Axios.get("/api/qanda/" + qandaId);
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

export const updateQanda = (qanda) => async(dispatch, getState)=>{
    dispatch({type: QANDA_UPDATE_REQUEST, payload: qanda});
    const {userSignin: {userInfo}} = getState();
    try {
        const {data} = await Axios.put(`/api/qanda/${qanda._id}`, qanda,{
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({type: QANDA_UPDATE_SUCCESS, payload: data});
    
    } catch (error) {
        const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: QANDA_UPDATE_FAIL, payload: message });
    
    }
}

export const deleteQanda = (qandaId) => async(dispatch, getState)=>{
    dispatch({type: QANDA_DELETE_REQUEST, payload: qandaId});
    const {userSignin: {userInfo}} = getState();
    try {
        const {data} = Axios.delete(`/api/qanda/${qandaId}`,
        {headers: {Authorization: `Bearer ${userInfo.token}`},
    })
    dispatch({type: QANDA_DELETE_SUCCESS, payload:data});
    } catch (error) {
        const message = 
        error.response && error.response.data.message   //message tu message ben orderRouter
          ? error.response.data.message
          : error.message;
        dispatch({type:QANDA_DELETE_FAIL, payload: message});
    }
}