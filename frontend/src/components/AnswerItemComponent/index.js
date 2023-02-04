import { useDispatch, useSelector } from "react-redux";
import {Link} from "react-router-dom";
import './index.css'
import moment from 'moment';
import { deleteAnswer } from "../../store/answers";
import { getAnswer, fetchAnswers } from "../../store/answers";
import Vote from "../VoteComponent";

const AnswerItem = ({answer}) => {
    const dispatch = useDispatch();
    const { id, description, answererId, createdAt} = answer;
    const answerer = useSelector(getAnswer(answererId))
    const sessionUser = useSelector(state => state.session.user);
    const date = moment(createdAt).fromNow()

    const handleClick = () => {
        dispatch(deleteAnswer(id))
    }

    const dispatchAnswer = () => {
        dispatch(fetchAnswers())
    }

    return(
        <div className="answer-container">
            {answerer ? <div>
                <div className="answer-show-bottom" key={`question${id}`}>
                    <Vote key={`answer${id}`} post={answerer} sessionUser={sessionUser} isAnswer={true} dispatchPost={dispatchAnswer}/>
                <div className="answer-body">{description}</div>
                </div>
                {sessionUser && sessionUser.id === answererId ?<div className="crud-functions answer-crud">
                    <div style={{display:"flex"}}>
                        <div className="edit-delete" style={{marginRight:"5px"}}><Link to={`/answers/${id}/edit`}>Edit</Link></div>
                        <div className="edit-delete" onClick={handleClick}>Delete</div>
                    </div>
                    <div style={{marginLeft:0}}>Answered by <span>{answerer?.displayName}</span> {date}</div>
                </div> : <div className="crud-functions answer-crud" style={{textAlign:"right"}}><div style={{marginLeft:0, width:"100%"}}>Answered by <span>{answerer?.displayName}</span> {date}</div></div> }
            </div>
            : <></>
            }
        </div>
        )
    }


export default AnswerItem;