import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { QANDA_CREATE_RESET } from '../constants/qandaConstans';
import { QANDA_DELETE_RESET } from '../constants/qandaConstans';
import { deleteQanda, listNewQuestions } from './../actions/qandaAction';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';





export default function QandAScreen(props) {
  // const qandaList = useSelector((state) => state.qandaList);
  // const { loading, error, qandas } = qandaList;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;


  const qandaDelete = useSelector((state) => state.qandaDelete);
  const {loading: loadingDetele, error: errorDelete, success: successDelete} = qandaDelete;

  const listQ = useSelector((state)=> state.listQuestion);
  const {loading: loadingListQuestions, error: errorListQuestion, success: successListQuestions, questions} = listQ;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listNewQuestions({}));

    if (successDelete) {
      dispatch({type: QANDA_DELETE_RESET});
    }

    
  }, [dispatch, props.history, successDelete, userInfo._id]); //sau khi tao hoac xoa thanh cong, dispatch toi listProduct de reload lai 

  const deleteHandler = (index) => {
    if (window.confirm("Are you sure to delete this Question")) {
      dispatch(deleteQanda(index));
    }
  };
    return (
      <div className="containerNavbar">
        <h1 className="centerText mt-20 mb4">Question and Answer</h1>

        {loadingDetele && <LoadingBox></LoadingBox>}
        {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
        

        {successListQuestions && <>
            <table className="table mb4">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Question</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{question}</td>
                    <td>
                      <Button
                        primary
                        type="button"
                        onClick={() =>
                          props.history.push(`/qanda/${index}/edit`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        color="red"
                        type="button"
                        onClick={() => deleteHandler(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>}
      </div>
    );
}
