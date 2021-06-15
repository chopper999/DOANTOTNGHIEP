import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { Button } from 'semantic-ui-react';
import { DATASET_UPDATE_RESET } from "../constants/qandaConstans";
import { detailDatasetTag, updateDataset } from "../actions/qandaAction";

export default function DatasetEditScreen(props) {
  const dataIndex = props.match.params.index;
  const [tag, setTag] = useState('');
  const [pattern, setPattern] = useState('');
  const [response, setResponse] = useState('');

  const datasetDetail = useSelector(state => state.datasetDetail);
  const {loading, error, dataset: dataDetail} = datasetDetail;

  const datasetUpdate = useSelector(state => state.datasetUpdate);
  const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = datasetUpdate;

  const datasetList = useSelector(state => state.datasetList);
  const {datasets} = datasetList;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successUpdate) {
        dispatch({type: DATASET_UPDATE_RESET});
      props.history.push('/dataset');
    }
    if (!dataDetail || dataDetail!== datasets[dataIndex].tag) {
      dispatch({ type: DATASET_UPDATE_RESET });
      dispatch(detailDatasetTag(dataIndex));
    } else {
        setTag(dataDetail);
        setPattern('');
        setResponse('');
    }
  }, [dataDetail, dispatch,dataIndex, successUpdate, props.history]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateDataset(tag,pattern,response));
  };

  return (
    <div>
      <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Add Question and Answer</h1>
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
              <label htmlFor="tag">Tag</label>
              <input
                id="tag"
                type="text"
                placeholder=""
                value={tag}
                disabled
              ></input>
            </div>
            <div>
              <label htmlFor="pattern">Pattern</label>
              <input
                id="pattern"
                type="text"
                placeholder="Enter pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="response">Response</label>
              <input
                id="response"
                type="text"
                placeholder="Enter response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              ></input>
            </div>
            <div>
              <label></label>
              <Button color="red" type="submit" className="block">
                Update
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
