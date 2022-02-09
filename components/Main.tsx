import React from "react";
import { Avatar, Layout, Menu, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
const { Header, Footer, Content } = Layout;

const Main = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = (e) => {
    console.log("click ", e.key);
    const { key } = e;
    if (key === "signOut") {
      signOut();
    } else if (key === "login") {
      router.push("/api/auth/signin");
    }
  };
  return (
    <Layout>
      <Header className="flex justify-between">
        <Link href="/">
          <span className="text-white text-bold text-2xl leading-[inherit] cursor-pointer">
            Hospital
          </span>
        </Link>

        <div className="">
          <Dropdown
            overlay={
              <Menu onClick={handleClick}>
                {!session ? (
                  <Menu.Item key="login">login</Menu.Item>
                ) : (
                  <>
                    <Menu.Item key="username">{session?.user?.name}</Menu.Item>
                    <Menu.Item key="signOut">exit</Menu.Item>
                  </>
                )}
              </Menu>
            }
          >
            <Avatar shape="circle" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content className="min-h-screen p-4" style={{ minHeight: "80vh" }}>
        {children}
      </Content>
      <Footer className="text-center">create by victor</Footer>
    </Layout>
  );
};
export default Main;
