import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { QANDA_CREATE_RESET } from '../constants/qandaConstans';
import { QANDA_DELETE_RESET } from '../constants/qandaConstans';
import { createQanda, deleteQanda, listQandas } from './../actions/qandaAction';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';





export default function QandAScreen(props) {
  const qandaList = useSelector((state) => state.qandaList);
  const { loading, error, qandas } = qandaList;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const qandaCreate = useSelector((state)=> state.qandaCreate);
  const {loading: loadingCreate, error: errorCreate, success: successCreate, qanda: createdQanda} = qandaCreate; 

  const qandaDelete = useSelector((state) => state.qandaDelete);
  const {loading: loadingDetele, error: errorDelete, success: successDelete} = qandaDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
        dispatch({type:QANDA_CREATE_RESET});
        props.history.push(`/qanda/${createdQanda._id}/edit`);
    }
    if (successDelete) {
      dispatch({type: QANDA_DELETE_RESET});
    }
    dispatch(listQandas({}));
  }, [createdQanda, dispatch, props.history, successCreate, successDelete, userInfo._id]); //sau khi tao hoac xoa thanh cong, dispatch toi listProduct de reload lai 

  const deleteHandler = (qanda) => {
    if (window.confirm("Are you sure to delete this Q and A?")) {
      dispatch(deleteQanda(qanda._id));
    }
  };
  const createHandler = () => {
    dispatch(createQanda());
};
    return (
      <div className="containerNavbar">
        <h1 className="centerText mt-20 mb4">Question and Aswer</h1>
        <div className="btnCreateProduct">
          <Button color="green" type="button" onClick={createHandler}>
            Create Q&A
          </Button>
        </div>

        {loadingDetele && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

        {loadingCreate && <LoadingBox></LoadingBox>}
        {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}

        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {qandas.map((qanda) => (
                  <tr key={qanda._id}>
                    <td>{qanda._id}</td>
                    <td>{qanda.question}</td>
                    <td>{qanda.answer}</td>
                    <td>
                      <Button
                        primary
                        type="button"
                        onClick={() =>
                          props.history.push(`/qanda/${qanda._id}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        type="button"
                        onClick={() => deleteHandler(qanda)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
}
