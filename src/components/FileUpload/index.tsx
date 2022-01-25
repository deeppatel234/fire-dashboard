import React from "react";

import "./index.scss";

const FileUpload = ({ onChange }) => {
  const onFileUpload = (event) => {
    const target = event.target;
    const files = [...target.files];

    onChange(files);
  };

  return (
    <div className="file-upload-block-wrapper">
      <div className="file-upload-block">
        <div className="title">Click or Drag a file to this area to upload</div>
        <input type="file" onChange={onFileUpload} />
      </div>
    </div>
  );
};

export default FileUpload;
