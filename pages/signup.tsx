import { Form, Input, message, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";

const Signup = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const onFinish = (values: any) => {
    console.log("Success:", values);
    const params = {
      name: values.name,
      password: values.password,
    };
    axios
      .post("/api/signup", params)
      .then((res) => {
        router.push("/api/auth/signin");
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        message.error(err.response.data.msg);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const validatePsw = ({ getFieldValue }) => {
    return {
      validator: (_, value) => {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("please input the same password"));
      },
    };
  };

  return (
    <div>
      <Form
        name="signup"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 6 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: "Please input your password!" },
            validatePsw,
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
