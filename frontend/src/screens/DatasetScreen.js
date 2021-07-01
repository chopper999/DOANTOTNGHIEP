import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { deleteDataset, listDatasets } from '../actions/qandaAction';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { DATASET_DELETE_RESET } from '../constants/qandaConstans';
import { DATASET_CREATE_RESET } from './../constants/qandaConstans';



export default function DatasetScreen(props) {

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const datasetList = useSelector(state => state.datasetList);
  const {loading: loadingListDataset, error: errorListDataset, datasets} = datasetList;

  const datasetDelete = useSelector(state => state.datasetDelete);
  const {loading: loadingDelete, error: errorDelete, success: successDelete} = datasetDelete;

  const datasetCreate = useSelector(state => state.datasetCreate);
  const {loading: loadingCreate, error: errorCreate, success: successCreate, dataset} = datasetCreate;
    
  const dispatch = useDispatch();
  useEffect(() => {
    if(successDelete){
      dispatch({type: DATASET_DELETE_RESET});
    }
    if(successCreate){
      dispatch({type: DATASET_CREATE_RESET});
    }
    dispatch(listDatasets({}));
  }, [dispatch, props.history, userInfo._id, successDelete, successCreate]); //sau khi tao hoac xoa thanh cong, dispatch toi listProduct de reload lai

  const deleteHandler = (tag) => {
    if (window.confirm("Are you sure to delete this product?")) {
      dispatch(deleteDataset(tag));
    }
    
  };
  const createHandler = ()=>{
    props.history.push(`/dataset/createEdit`)
  }

  return (
    <div className="containerNavbar">
      <h1 className="centerText mt-20 mb4">Dataset for question and answer</h1>
      <div className="btnCreateProduct">
              <Button
                size="huge"
                color="green"
                type="button"
                onClick={createHandler}
              >
                Create
              </Button>
            </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingListDataset ? (<LoadingBox></LoadingBox>)
      : errorListDataset ? (<MessageBox variant = "danger">{errorListDataset}</MessageBox>)
      :(
        <>
        <table className="table mb4">
          <thead>
            <tr>
              <th>Index</th>
              <th>Tag</th>
              <th>Patterns</th>
              <th>Responses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {datasets && (
              datasets.map((dataset, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{dataset.tag}</td>
                <td>{dataset.patterns.map((pattern)=>(
                  <div>{pattern}</div>
                ))}</td>
                <td>{dataset.responses.map((response)=>(
                  <div>{response}</div>
                ))}</td>
                <td className="button_action">
                  <Button
                    primary
                    type="button"
                    onClick = {()=> props.history.push(`/dataset/${index}/edit`)}
                  >
                    Add
                  </Button>
                  <Button
                    color="red"
                    type="button"
                    onClick = {() => deleteHandler(dataset.tag)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </>
      )}
    </div>
  );
}
