import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { QANDA_UPDATE_RESET } from '../constants/qandaConstans';
import { updateQanda } from '../actions/qandaAction';
import { detailQanda, listNewQuestions } from './../actions/qandaAction';
import { Button } from 'semantic-ui-react';

export default function QandaEditScreen(props) {
    const qandaId = props.match.params.index;
    const [question, setQuestion] = useState('');
    const [tag, setTag] = useState('');
    const [answer, setAnswer] = useState('');
    const qandaDetail = useSelector((state) => state.qandaDetail);
    const { loading, error, qanda } = qandaDetail;
    const qandaUpdate = useSelector((state) => state.qandaUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = qandaUpdate;

    const listQ = useSelector((state)=> state.listQuestion);
    const {questions} = listQ;

    const dispatch = useDispatch();

    useEffect(() => {  
        if (successUpdate) {
          dispatch({type: QANDA_UPDATE_RESET});
          props.history.push('/qanda'); //redirect ve QandaScreen sau khi da update xong
        }    
        if (!qanda || qanda!== questions[qandaId] ) { 
          dispatch({type: QANDA_UPDATE_RESET});
          dispatch(detailQanda(qandaId));
        } else {
            setQuestion(qanda);
        }
      }, [qanda, dispatch, qandaId, successUpdate, props.history]);
      const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateQanda(qandaId, tag, answer));
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
            <div>
              <label htmlFor="tag">Tag</label>
              <input
                id="tag"
                type="text"
                placeholder="Enter tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
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
