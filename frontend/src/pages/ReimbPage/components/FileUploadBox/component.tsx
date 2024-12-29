import {gql} from '@apollo/client';
import { useAuthMutation} from "../../../../services/graphql";
import React, { Dispatch, useState} from "react";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { InboxOutlined } from "@ant-design/icons";


import { Upload, message } from 'antd';


const UPLOAD_RECEIPTS = gql`
    mutation UploadReceipts($receipts: [Upload!]!){
        uploadReceipts(receipts:$receipts){
            receiptList{
                id
                receipts{
                    id
                }
            }
        }
    }
`;

const UPDATE_RECEIPTS = gql`
    mutation UploadReceipts($receipts: [Upload!]!, $collection:ID){
        uploadReceipts(receipts:$receipts,collection:$collection){
            receiptList{
                id
                receipts{
                    id
                }
            }
        }
    }
`;



interface upload_response{
    uploadReceipts:{
        receiptList:{
            id:number
            receipts:ReceiptList
        }
    }
}

interface update_response{
    uploadReceipts:{
        receiptList:{
            id:number
            ReceiptList:ReceiptList
        }
    }
}

interface ReceiptList{
    id:number
    receipts:{id:number}[]
}

interface FileProps{
    Collection:[number,Dispatch<number>],
    setUploading: Dispatch<boolean>
}

const FileUploadBox = ({Collection:[list_id, set_list_id], setUploading}:FileProps) => {
    
    //const [collection, setCollection] = useState<number>([]);

    const [upload_mutation] = useAuthMutation(UPLOAD_RECEIPTS,
        {onCompleted: ({uploadReceipts}:upload_response)=> {
            const id = uploadReceipts.receiptList.id;
            set_list_id(id);
            setUploading(false);
        }});

    const [update_mutation] = useAuthMutation(UPDATE_RECEIPTS,
        {onCompleted: ({uploadReceipts}:update_response)=> {
            set_list_id(uploadReceipts.receiptList.id);
            setUploading(false);
        }});

    const updateUploads = (wrapped_files) => {
        const files:FileList = wrapped_files.map((obj) => (obj.originFileObj));
        setUploading(true);
        if(list_id == null){
            const vars = {variables: {receipts: files}};
            upload_mutation(vars);
        }else{
            // TODO: instead should make it figure out what to upload
            const vars = {variables: {receipts: files}, collection: list_id};
            update_mutation(vars);
        }
    };

        
    const props = {
        name: 'file',
        multiple: true,
        onChange({fileList}){
            updateUploads(fileList)
        },
        beforeUpload: (_file:RcFile, files: RcFile[]) => {
            return(false);
        }
        //action: window.location.hostname.toString(),
    };

    return(
    <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
            <InboxOutlined/>
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
    </Upload.Dragger>
    )
};

export default FileUploadBox;
