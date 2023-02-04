import React from "react";
import LeftSidebar from "../LeftSidebarComponent";
import './index.css'
import TagComponent from "./Tag";


const TagsComponent = ({tags}) => {


    return (
        <div className="tags-list">
          {tags ? tags.map(tag => (
            <div key={tag.id} className="tags-item">
              <TagComponent tag={tag}/>
            </div>
          )) : <div></div>}
        </div>
    )
}

export default TagsComponent