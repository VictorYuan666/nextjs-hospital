import {
  Form,
  Input,
  Button,
  Checkbox,
  DatePicker,
  Upload,
  message,
} from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useSetState } from "ahooks";
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    return { redirect: { permanent: false, destination: "/api/auth/signin" } };
  }
  return { props: {} };
};

export default function Registration() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [state, setState] = useSetState({ loading: false });
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const {
      name,
      birthday,
      phone,
      email,
      address,
      driverLicense,
      appointmentTime,
    } = values;

    const params = {
      name,
      birthday: birthday.format("YYYY-MM-DD"),
      phone,
      email,
      address,
      driverLicense: driverLicense[0].url,
      appointmentTime: appointmentTime.format("YYYY-MM-DD"),
    };

    console.log(params);
    setState({ loading: true });
    axios.post("/api/registration", params).then((res) => {
      router.push("/view");
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  function customRequest(option) {
    const formData = new FormData();
    formData.append("files[]", option.file);
    const reader = new FileReader();
    reader.readAsDataURL(option.file);
    reader.onloadend = function (e) {
      const base64Img = e.target.result;
      form.setFieldsValue({
        driverLicense: [{ url: base64Img, name: option.file.name }],
      });
      console.log("@@@@", e.target);
      if (e && e.target && e.target.result) {
        option.onSuccess();
      }
    };
  }

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("not jpg or png file");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error("file must smaller than 1MB!");
      setTimeout(() => {
        form.setFieldsValue({
          driverLicense: null,
        });
      }, 0);

      return false;
    }
    return isJpgOrPng && isLt2M;
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
  };
  return (
    <div>
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        {...formItemLayout}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="date of birth"
          name="birthday"
          rules={[
            { required: true, message: "Please select your date of birth!" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="phone number"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              required: false,
              pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
              message: "Please input right phone number",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            { required: true, message: "Please input your email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="driverLicense"
          label="driver license"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Please upload your driver license!" },
          ]}
        >
          <Upload
            listType="picture"
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            maxCount={1}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="appointment time"
          name="appointmentTime"
          rules={[
            { required: true, message: "Please select your appointment time!" },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={state.loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
