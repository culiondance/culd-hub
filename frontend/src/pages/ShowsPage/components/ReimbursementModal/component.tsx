import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Upload,
  InputNumber,
  Select,
} from "antd";
import { useMutation } from "@apollo/client";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SUBMIT_REIMBURSEMENT_MUTATION } from "../../../../graphql/mutations";
import { Show, User } from "../../../../types/types";
import { handleApolloError } from "../../../../services/graphql";

const { TextArea } = Input;

interface ReimbursementModalProps {
  show: Show;
  visible: boolean;
  onClose: () => void;
  user: User;
}

export const ReimbursementModal: React.FC<ReimbursementModalProps> = ({
  show,
  visible,
  onClose,
  user,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [submitReimbursement] = useMutation(SUBMIT_REIMBURSEMENT_MUTATION, {
    onCompleted: ({ submitReimbursement }) => {
      if (submitReimbursement.success) {
        message.success("Reimbursement request submitted!");
        form.resetFields();
        onClose();
      }
    },
    onError: handleApolloError(),
  });

  const uploadFileToFirebase = async (file: File): Promise<string> => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `reimbursements/${user.id}/${Date.now()}-${file.name}`,
    );
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const onFinish = async (values: any) => {
    if (!file) {
      message.error("Please upload a receipt photo.");
      return;
    }

    setLoading(true);

    try {
      // Upload file and get the Firebase URL
      const photoUrl = await uploadFileToFirebase(file);

      await submitReimbursement({
        variables: {
          showId: show.id,
          photoUrl, // <-- send the URL, not base64
          notes: values.notes,
          paymentMethod: values.paymentMethod,
          amount: parseFloat(values.amount), // convert to number
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to submit reimbursement.");
    }

    setLoading(false);
  };

  return (
    <Modal
      title={`Reimbursement Request - ${show.name}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item label="Photo (Receipt/Proof)">
          <Upload
            accept="image/png,image/jpeg"
            maxCount={1}
            beforeUpload={() => false} // prevent auto-upload
            onChange={(info) =>
              setFile(info.fileList[0]?.originFileObj || null)
            }
          >
            <Button>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="venmo">
              Venmo (@{user.venmoUsername})
            </Select.Option>
            <Select.Option value="zelle">
              Zelle ({user.zelleUsername})
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount to Reimburse"
          rules={[{ required: true, type: "number" }]}
        >
          <InputNumber prefix="$" />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} placeholder="Any additional info..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Reimbursement
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
