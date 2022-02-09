import { Button, Card, Spin } from "antd";
import type { GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import { EditOutlined, SolutionOutlined } from "@ant-design/icons";

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const user = await prisma.user.findFirst({
//     where: {
//       name: "admin",
//       password: "admin",
//     },
//   });
//   console.log("~~~~", JSON.stringify(user));
//   return {
//     props: user,
//   };
// };
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("status", status);

  console.log("session", session);
  const onPatientClick = () => {
    router.push("/add");
  };
  const onDoctorClick = () => {
    router.push("/view");
  };

  const goSignIn = () => {
    router.push("/api/auth/signin");
  };

  const goSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Head>
        <title>hospital</title>
        <meta name="description" content="hospital" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Spin spinning={status === "loading"}>
        <main className="">
          {!session ? (
            <div className="flex flex-col">
              <Button type="primary" onClick={goSignIn}>
                login
              </Button>
              <Button className="mt-4" onClick={goSignUp}>
                signup
              </Button>
            </div>
          ) : (
            <Card
              style={{ width: 240 }}
              actions={[
                <EditOutlined
                  key="add"
                  onClick={onPatientClick}
                  className="add"
                />,
                <SolutionOutlined
                  key="view"
                  onClick={onDoctorClick}
                  className="viewAction"
                />,
              ]}
              cover={
                <img
                  alt="example"
                  src="https://img1.baidu.com/it/u=4171233716,2174339849&fm=253&fmt=auto&app=138&f=JPG?w=448&h=280"
                />
              }
            >
              <Card.Meta title="patient registration" />
            </Card>
          )}
        </main>
      </Spin>
    </div>
  );
}
