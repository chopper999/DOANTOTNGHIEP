import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { Button } from 'semantic-ui-react';
import { DATASET_CREATE_RESET } from './../constants/qandaConstans';
import { createDataset } from "../actions/qandaAction";

export default function DatasetCreateScreen(props) {
    const datasetCreate = useSelector(state => state.datasetCreate);
    const {loading: loadingCreate, error: errorCreate, success: successCreate, dataset} = datasetCreate;
    const [tag, setTag] = useState('');
    const [pattern, setPattern] = useState('');
    const [response, setResponse] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        if (successCreate){
            if(dataset === "Tag bạn thêm đã có, vui lòng chọn Add"){
              window.alert(dataset);
            }
            else{
              window.alert("Create successfully!");
            }
            dispatch({type: DATASET_CREATE_RESET});
            props.history.push('/dataset');
        }
    }, [successCreate, dispatch, props.history])
    const submitHandler = (e) => {
        e.preventDefault();
        if(tag==="" || pattern==="" || response ===""){
          window.alert("Please input all field!");
        }
        else{
          dispatch(createDataset(tag, pattern, response));
        }
      };
    return (
        <div>
            <form className="form containerForm" onSubmit={submitHandler}>
        <div>
          <h1 className="centerText">Tạo câu hỏi và trả lời</h1>
        </div>
        {loadingCreate ? <LoadingBox></LoadingBox>:
        errorCreate ? <MessageBox variant="danger">{errorCreate}</MessageBox>
        :(
          <>
            <div>
              <label htmlFor="tag">Loại</label>
              <input
                id="tag"
                type="text"
                placeholder="Nhập loại"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="pattern">Câu hỏi</label>
              <input
                id="pattern"
                type="text"
                placeholder="Nhập câu hỏi"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              ></input>
            </div>
            <div>
              <label htmlFor="response">Trả lời</label>
              <input
                id="response"
                type="text"
                placeholder="Nhập câu trả lời"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              ></input>
            </div>
            <div>
              <label></label>
              <Button color="red" type="submit" className="block">
                Tạo
              </Button>
            </div>
          </>
        )}
      </form>
        </div>
    )
}
