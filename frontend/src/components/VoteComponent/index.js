import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchVotes, getVotes, makeVote, downVote } from "../../store/vote";
import { ReactComponent as GrayUpArrow } from './svgs/gray-up-arrow.svg';
import { ReactComponent as OrangeUpArrow } from './svgs/orange-up-arrow.svg';
import { ReactComponent as GrayDownArrow } from './svgs/gray-down-arrow.svg';
import { ReactComponent as OrangeDownArrow } from './svgs/orange-down-arrow.svg';


const Vote = ({post, sessionUser, isAnswer, dispatchPost}) => {
    const dispatch = useDispatch();
    const votes = post.votesAttributes;

    const initialVotes = votes.map((vote) => {return vote.vote ? 1 : -1}).reduce((vote, current) => vote + current, 0)
    const initialVoters = votes.map((vote) => {return vote.voterId})
    let initialVote = ""

    const [voteCount, setVoteCount] = useState()
    const [voters, setVoters] = useState([])
    const [vote, setVote] = useState("");

    if(sessionUser){
        for(let i = 0; i < votes.length; i++){
            if(sessionUser.id === votes[i].voterId) initialVote = votes[i].vote;
        }
    }

    useEffect(() => {
        setVoteCount(initialVotes)
        setVoters(initialVoters)
        setVote(initialVote)

    }, [initialVote, initialVotes])


    const handleClick = (bool) => {
        if(!sessionUser){return alert("You must be logged in to vote")}
        const has_user_voted = voters.includes(sessionUser.id)
        const user_id = sessionUser.id
        let response = null

        if(has_user_voted) {
            for (const v of Object.values(votes)) {
                if(v.voterId === sessionUser.id) {
                    response = dispatch(downVote(v.id, dispatchPost))
                }
            }
            setVote("")
            setVoters(voters.filter(v => v !== user_id))
        } else {
            response = dispatch(makeVote(sessionUser.id, post.id, bool, isAnswer, dispatchPost));
            setVote(bool)
            setVoters([...voters, user_id])
        }
        if(bool){
            setVoteCount(voteCount + 1)
        }else{
            setVoteCount(voteCount - 1)
        }
    }


        return(
            <div className="vote-container" key={isAnswer ? `answer${post.id}` : `question${post.id}`}>
                {sessionUser && votes && voters.includes(sessionUser.id) && vote ? <OrangeUpArrow/> : <GrayUpArrow onClick={() => handleClick(true)}/>}
                <h1 className="vote-count">{voteCount}</h1>
                {sessionUser && votes && voters.includes(sessionUser.id) && !vote ? <OrangeDownArrow/> : <GrayDownArrow onClick={() => handleClick(false)}/>}
            </div>
        )
    }



export default Vote;