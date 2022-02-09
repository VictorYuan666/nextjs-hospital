import { GetServerSideProps, NextPage } from "next/types";
import React, { useEffect } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import axios from "axios";
import { useRequest } from "ahooks";
import { Table } from "antd";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (!session) {
    return { redirect: { permanent: false, destination: "/api/auth/signin" } };
  }
  return { props: {} };
};

interface IRegistration {
  id: string;
  name: string;
  driverLicense: string;
}

interface IListData {
  list: IRegistration[];
  current: number;
  pageSize: number;
}

async function service(data) {
  return axios.get("/api/registration", {
    params: { current: 1, pageSize: 10 },
  });
}

const View: NextPage = () => {
  const { data, loading } = useRequest(service);
  const listData: IListData = data?.data;

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      // fixed: "left",
    },
    {
      title: "birthday",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    { title: "email", dataIndex: "email" },
    { title: "address", dataIndex: "address" },
    {
      title: "driver license",
      key: "driverLicense",
      dataIndex: "driverLicense",
      render: (driverLicense) => (
        <Image src={driverLicense} alt="img" width={100} height={100} />
      ),
    },
    { title: "appointmentTime", dataIndex: "appointmentTime" },
    {
      title: "author",
      dataIndex: "author",
      render: (author) => <div>{author.name}</div>,
    },
  ];
  console.log(listData);
  return (
    <div style={{ padding: 8 }}>
      <Table
        scroll={{ x: 1000 }}
        dataSource={listData?.list}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default View;
