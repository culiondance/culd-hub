import { Form, Input, InputNumber, Select, Upload, Button, Modal } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuthMutation, useAuthQuery } from "../../../../services/graphql";

import { Show } from "../../../../types/types";
import React, { useContext, useState } from "react";
import { gql, useMutation} from "@apollo/client";
import { Dayjs } from "dayjs";

const SUBMIT_REIMB = gql`
    mutation SubmitReimb($amount: Float!, $show:ID!){
        submitReimb(show:$show,amount:$amount, files:none){
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
  amount?: number;
  show?: number;
  description?: string;
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

  const [form] = Form.useForm();


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
    show: {id:number, name:string},
    amount: number,
    files: string[],
    description:string,
  };

  const [submitForm] = useAuthMutation(SUBMIT_REIMB, {});

  function submit_form(values:FormValues) {
      console.log(values);
      //const vars = {show:values.show.id, amount:values.amount};
      const vars = {show:values.show.id, amount:values.amount};
      submitForm({variables:vars});
      //setIsModalOpen(false);
  }

  // TODO:
  // use onRemove and beforeUpload to actually upload the file
  // (https://ant.design/components/upload?ref=AwesomeTechStack#upload-demo-upload-manually)
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
          <Form.Item<FieldType> name="show" label="Show">
            <Select placeholder="Select a show you attended">{shows}</Select>
          </Form.Item>
          <Form.Item<FieldType> name="amount" label="Amount">
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType> name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
	<Form.Item
        name="receipts"
	label = "Receipts"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload.Dragger name="files">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default ReimbForm;
