import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";
import moment from "moment";

const EditTransactionModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  // Convert initialValues.date to a moment object (if it’s a string)
  const originalDate =
    typeof initialValues.date === "string"
      ? moment(initialValues.date, "YYYY-MM-DD")
      : initialValues.date;
  const originalDateStr = originalDate.format("YYYY-MM-DD");

  useEffect(() => {
    // Set all fields except date so the date field remains empty
    form.setFieldsValue({
      name: initialValues.name,
      amount: initialValues.amount,
      tag: initialValues.tag,
    });
  }, [initialValues, form]);

  return (
    <Modal
      title="Edit Transaction"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          // If user does not select a new date, use the original date
          values.date = values.date
            ? values.date.format("YYYY-MM-DD")
            : originalDateStr;
          values.amount = parseFloat(values.amount);
          onSubmit(values);
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date!" }]}>
          <DatePicker
            placeholder={originalDateStr}
            format="YYYY-MM-DD"
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Transaction
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransactionModal;
