import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LeftSidebar from "../LeftSidebarComponent";
import './index.css'
import { getTags, fetchTags } from "../../store/tags";
import TagsComponent from "./Tags"

const TagIndexComponent = () => {
    const dispatch = useDispatch();
    const tags = useSelector(getTags).slice()

    useEffect(() => {
        dispatch(fetchTags())
    }, [])
    return (
        <>
            <div className="page-content">
                <LeftSidebar/>
                <TagsComponent tags={tags} />

            </div>
        </>
    )
     
}

export default TagIndexComponent