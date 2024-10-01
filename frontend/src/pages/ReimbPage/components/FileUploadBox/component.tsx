import { ChangeEvent} from 'react';

import { InboxOutlined, UploadOutlined } from "@ant-design/icons";


const FileUploadBox = ({setFiles}) => {
	const updateUploads = (e: ChangeEvent<HTMLInputElement>) => {
	  if (e.target.files) {
	    setFiles(e.target.files);
	  }
	};

	return(
	<input type="file" multiple = {true} onChange = {updateUploads}>
	  <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
	</input>);
}


export default FileUploadBox;
