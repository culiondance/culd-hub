import { Form, Input, InputNumber, Select, Upload, Button, Modal, FormInstance } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuthMutation, useAuthQuery } from "../../../../services/graphql";
import FileUploadBox from "../FileUploadBox";
import { Show } from "../../../../types/types";
import React, { useContext, useState } from "react";
import { gql, useMutation} from "@apollo/client";
import { Dayjs } from "dayjs";

const SUBMIT_REIMB = gql`
    mutation SubmitReimb($amount: Float!, $show:ID!, $receipts:[Upload!]!, $description:String){
        submitReimb(show:$show,amount:$amount, receipts:$receipts, description:$description){
            reimb{
                id
            }
        }
    }
`;

const MY_SHOWS = gql`
  {
    myShows{
	    id
	    name
	    date
    }
  }
`;



const SubmitButton = ({form}:{form:FormInstance}) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}> Submit </Button>
  );
};

function get_shows(SetOptions){
    useAuthQuery(MY_SHOWS, {
        onCompleted: (query) => {
            const options = query.myShows.map(
              show => <Select.Option value={show.id} key={show.id}>{show.name}</Select.Option>
            );
          SetOptions(options);
        }
    })
}


type FieldType = {
  Amount: number;
  Show: number;
  Description: string;
  Receipt: FileList;
};

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};



const ReimbForm = () => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [form]:[FormInstance] = Form.useForm();


  const [shows, SetShows] = useState([]);
  get_shows(SetShows)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  type FormValues = {
    Show: number,
    Amount: number,
    Description:string,
  };



  const [files, setFiles] = useState<FileList>(null);

  const [submit_mutation] = useAuthMutation(SUBMIT_REIMB,{onCompleted: ()=> {console.log("mutation completed")}});


  async function submit_form({Show, Amount, Description}:FormValues) {
        const vars = {show:Show, amount:Amount, receipts:files, description:Description};
        console.log("mutating with vars",vars);
        submit_mutation({variables:vars});
      setIsModalOpen(false);
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Submit Reimbursement
      </Button>
      <Modal
        title="Submit Reimbursement"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
	centered={true}
      >
        <Form
          form={form}
          name="SubmitReimb"
          onFinish={submit_form}
          {...formItemLayout}
        >
          <Form.Item<FieldType> name="Show" label="Show" rules={[{required: true}]}>
            <Select placeholder="Select a show">{shows}</Select>
          </Form.Item>
          <Form.Item<FieldType> name="Amount" label="Amount" rules={[{required: true, type: "number"}]}>
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType> name="Description" label="Description" rules={[{required: true}]}>
            <Input.TextArea />
          </Form.Item>
	<Form.Item
        name="Receipts"
	label = "Receipts"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <FileUploadBox setFiles = {setFiles}></FileUploadBox>
      </Form.Item>
          <Form.Item >
            <SubmitButton form={form}/>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ReimbForm;
