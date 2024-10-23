import {gql} from '@apollo/client';
import { useAuthMutation} from "../../../../services/graphql";
import React, { Dispatch } from "react";

import { InboxOutlined } from "@ant-design/icons";


import { Upload } from 'antd';


const UPLOAD_RECEIPTS = gql`
    mutation UploadReceipts($receipts: [Upload!]!){
        uploadReceipts(receipts:$receipts){
            id
            receiptList{
                id
            }
        }
    }
`;

const UPDATE_RECEIPTS = gql`
    mutation UploadReceipts($receipts: [Upload!]!, $collection:ID){
        uploadReceipts(receipts:$receipts,collection:$collection){
            id
            receiptList{
                id
            }
        }
    }
`;



interface FileProps{
    Collection:[number,Dispatch<number>],
    setUploading: Dispatch<boolean>
}

const FileUploadBox = ({Collection:[collection, setCollection], setUploading}:FileProps) => {


    const [upload_mutation] = useAuthMutation(UPLOAD_RECEIPTS,
        {onCompleted: ({id})=> {
            console.log("mutation completed");
            setCollection(id);
            setUploading(false);
        }});

    const [update_mutation] = useAuthMutation(UPDATE_RECEIPTS,
        {onCompleted: ({id})=> {
            console.log("mutation completed");
            setCollection(id);
            setUploading(false);
        }});

        const updateUploads = (wrapped_files) => {
            const files:FileList = wrapped_files.map((obj) => (obj.originFileObj));
            setUploading(true);
            if(collection == null){
                console.log("uploading")
                const vars = {variables: {receipts: files}};
                upload_mutation(vars);
            }else{
                console.log("updating")
                const vars = {variables: {receipts: files}, collection: collection};
                update_mutation(vars);

            }
        };

        
        const props = {
            name: 'file',
            multiple: true,
            onChange({fileList}){
                updateUploads(fileList)
            },
            //action: window.location.hostname.toString(),
        }

        return(
        <Upload.Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
        )
};

/*
 *        <input type="file" multiple onChange = {updateUploads}>
        </input>);

 */


export default FileUploadBox;
