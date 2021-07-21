import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { QANDA_DELETE_RESET } from '../constants/qandaConstans';
import { deleteQanda, listNewQuestions, trainQuestion } from './../actions/qandaAction';
import LoadingBox from './../components/LoadingBox';
import MessageBox from './../components/MessageBox';
import { QUESTION_TRAIN_RESET } from './../constants/qandaConstans';
import schedule from 'node-schedule';




export default function QandAScreen(props) {
  // const qandaList = useSelector((state) => state.qandaList);
  // const { loading, error, qandas } = qandaList;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;


  const qandaDelete = useSelector((state) => state.qandaDelete);
  const {loading: loadingDetele, error: errorDelete, success: successDelete} = qandaDelete;

  const listQ = useSelector((state)=> state.listQuestion);
  const {loading:loadingList, success: successListQuestions, questions} = listQ;

  const questionTrain = useSelector(state => state.questionTrain);
  const {loading: loadingTrain, error: errorTrain, success: successTrain} = questionTrain;


  const dispatch = useDispatch();

  useEffect(() => {
    

    if (successTrain){
      alert("Train thành công!");
      dispatch({type: QUESTION_TRAIN_RESET});
    }
 
    if (successDelete) {
      dispatch({type: QANDA_DELETE_RESET});
    }
    dispatch(listNewQuestions({}));

    
  }, [dispatch, props.history, successDelete, userInfo._id, successTrain]); //sau khi tao hoac xoa thanh cong, dispatch toi listProduct de reload lai 

  const deleteHandler = (index) => {
    if (window.confirm("Are you sure to delete this Question")) {
      dispatch(deleteQanda(index));
    }
  };
  const trainHandler = () => {
    dispatch(trainQuestion());
};

const rule = new schedule.RecurrenceRule();
// rule.hour = 11;
// rule.minute = 18;
rule.second = 1;


// const job = schedule.scheduleJob('/1 * * * * *', function(){
//   var day = new Date();
//   console.log("demm:              " + day.getHours() + " " + day.getMinutes() +" " + day.getSeconds());
//   // job.cancel();
// // dispatch(trainQuestion());
// });



    return (
      <div className="containerNavbar container-table">
        <h1 className="centerText mt-20 mb4">Câu hỏi và trả lời</h1>

        {errorTrain && <MessageBox variant="danger">{errorTrain}</MessageBox>}
        {loadingTrain ? (
          <LoadingBox></LoadingBox>
        ) : (
          <>
            <div className="btnCreateProduct">
              <Button
                size="huge"
                color="green"
                type="button"
                onClick={trainHandler}
              >
                Train
              </Button>
            </div>
            {loadingDetele && <LoadingBox></LoadingBox>}
            {errorDelete && (
              <MessageBox variant="danger">{errorDelete}</MessageBox>
            )}
            {loadingList && <LoadingBox></LoadingBox>}
            {successListQuestions && (
              <>
                <table className="table mb4">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Câu hỏi</th>
                      <th>Hành động</th>
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
                            Chỉnh sửa
                          </Button>
                          <Button
                            color="red"
                            type="button"
                            onClick={() => deleteHandler(index)}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    );
}
