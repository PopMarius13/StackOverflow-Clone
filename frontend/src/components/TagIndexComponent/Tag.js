import React from "react";
import './index.css'


const TagComponent = ({tag}) => {

    return (
        <a href="#" className="tag-item">
          {tag.name}
        </a>
    )
     
}

export default TagComponent