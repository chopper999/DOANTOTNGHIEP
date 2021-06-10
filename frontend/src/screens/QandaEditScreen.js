import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { QANDA_UPDATE_RESET } from '../constants/qandaConstans';
import { updateQanda } from '../actions/qandaAction';
import { detailQanda } from './../actions/qandaAction';
import { Button } from 'semantic-ui-react';

export default function QandaEditScreen(props) {
    const qandaId = props.match.params.id;
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const qandaDetail = useSelector((state) => state.qandaDetail);
    const { loading, error, qanda } = qandaDetail;

    const qandaUpdate = useSelector((state) => state.qandaUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = qandaUpdate;

    const dispatch = useDispatch();

    useEffect(() => {  
        if (successUpdate) {
          props.history.push('/qanda'); //redirect ve QandaScreen sau khi da update xong
        }     
        if (!qanda || qanda._id !== qandaId ||successUpdate ) { //Neu khong co Q and A thi load tu backend len, qanda._id !== qandaId để không show Q and A trc do 
          //  kiem tra successUpdate de refresh lai trang khi update thanh cong, tranh show lai thong tin cu
          //  successUpdate = true thi se dispatch toi detailQanda 1 lan nua
          dispatch({type: QANDA_UPDATE_RESET});
          dispatch(detailQanda(qandaId));
        } else {
            setQuestion(qanda.question);
            setAnswer(qanda.answer);
        }
      }, [qanda, dispatch, qandaId, successUpdate, props.history]);
      const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateQanda({_id: qandaId, question, answer}))
      };
    return (
        <div>
            <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Create Question and Answer</h1>
        </div>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="question">Question</label>
              <input
                id="question"
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="answer">Answer</label>
              <input
                id="answer"
                type="text"
                placeholder="Enter answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></input>
            </div>
              <label></label>
              <Button
                  color="red"
                  type="submit"
                  className="block"
                >
                  Update
                </Button>
          </>
        )}
      </form>
        </div>
    )
}
