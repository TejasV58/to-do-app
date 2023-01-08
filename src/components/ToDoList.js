import React, { useRef, useState } from "react";

// ant design imports
import { PlusOutlined, CheckSquareOutlined } from "@ant-design/icons";
import { EditableProTable } from "@ant-design/pro-components";
import { Button, Space, Tag, Typography, Input, Layout, ConfigProvider, Popconfirm } from "antd";
import enUS from "antd/locale/en_US";

// importing components
import TagList from "./TagList";

//Importing Default Data
import { defaultData } from "../data"; 

const { Title } = Typography;
const { Content, Footer } = Layout;

const ToDoList = () => {

  // Column Structure Definition for ProTable 
  const columns = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ['xxl', 'xl', 'lg', 'md'],
    },
    {
      title: "Title",
      dataIndex: "title",
      search: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 100,
            whitespace: true,
            message: "The maximum character limit is 1000",
          },
        ],
      },
      sorter: (a, b) => a.title.localeCompare(b.title),
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
    },
    {
      title: "Description",
      dataIndex: "description",
      search: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 100,
            whitespace: true,
            message: "The maximum character limit is 1000",
          },
        ],
      },
      sorter: (a, b) => a.description.localeCompare(b.description),
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm'],
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: true,
      onFilter: true,
      valueType: "select",
      search: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
        ],
      },
      valueEnum: {
        open: {
          text: "Open",
          status: "Default",
        },
        overdue: {
          text: "Overdue",
          status: "Error",
        },
        done: {
          text: "Done",
          status: "Success",
        },
        working: {
          text: "Working",
          status: "Processing",
        },
      },
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
    },
    {
      title: "Tags",
      dataIndex: "tag",
      filters: true,
      filterSearch: true,
      search: true,
      width: "20%",
      renderFormItem: (_, { isEditable }) => {
        return isEditable ? <TagList /> : <Input />;
      },
      render: (_, row) =>
        row.tag &&
        row.tag.map((item) => <Tag key={item.key}>{item.label}</Tag>),
      responsive: ['xxl', 'xl', 'lg'],
    },
    {
      title: "Creation time",
      dataIndex: "timestamp",
      valueType: "date",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      editable: false,
      responsive: ['xxl', 'xl', 'lg', 'md'],
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      valueType: "date",
      search: true,
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'],
    },
    {
      title: "Operation",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <Button type="link" size="small">
            Edit
          </Button>
        </a>,
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="link" size="small">
            Delete
          </Button>
        </Popconfirm>,
      ],
      responsive: ['xxl', 'xl', 'lg', 'md', 'sm'],
    },
  ];

  // Hooks for Pro Table 
  const actionRef = useRef();
  const [dataSource, setDataSource] = useState(defaultData);
  const [editableKeys, setEditableRowKeys] = useState([]);

  // To delete a task
  const handleDelete = (id) => {
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
  };

  const waitTime = (time = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  return (

    // Used to Change Component Languag labels to English
    <ConfigProvider locale={enUS}> 
      <Layout>
        <Space
          style={{ width: "100%", justifyContent: "center" }}
        >
          <Title>
            <CheckSquareOutlined style={{ color: "#1677ff" }} /> TO DO LIST
          </Title>
        </Space>

        <Content style={{ padding: "0 2%" }}>
          <EditableProTable
            columns={columns}
            actionRef={actionRef}
            cardBordered={true}
            recordCreatorProps={false}
            request={async (params = {}, sorter, filter) => {
              const formParams = Object.entries(params).filter(
                ([key, value]) => key !== "current" && key !== "pageSize"
              );

              return Promise.resolve({

                // Code for Search function
                data: defaultData.filter((item) => {
                  if (formParams.length === 0) {
                    return true;
                  }
                  var result = true;
                  var formObj = Object.fromEntries(formParams);
                  for (const key in formObj) {
                    if (
                      key !== "tag" &&
                      key !== "dueDate" &&
                      key !== "timestamp"
                    ) {
                      result =
                        result &
                        item[key]
                          .toLowerCase()
                          .includes(formObj[key].toLowerCase());
                    } else if (key === "dueDate" || key === "timestamp") {
                      result =
                        result &
                        (new Date(item[key]).toISOString().slice(0, 10) ===
                          formObj[key]);
                    } else {
                      result =
                        result &
                        (item[key].filter(
                          (i) =>
                            i.label.toLowerCase() === formObj[key].toLowerCase()
                        ).length >
                          0);
                    }
                  }
                  return result;
                }),
                success: true,
              });
            }}
            value={dataSource}
            rowKey="id"
            search={{
              layout: "vertical",
              labelWidth: "auto",
            }}
            options={{
              setting: {
                listsHeight: 400,
              },
            }}
            pagination={{
              pageSize: 5,
            }}
            dateFormatter="string"
            headerTitle="Task List"
            onChange={setDataSource}
            // Used for Editing Row Data
            editable={{
              type: "multiple",
              editableKeys,
              onSave: async (data) => {
                await waitTime(1000);
              },
              onChange: setEditableRowKeys,
            }}
            toolBarRender={() => [
              <Space>
                <Button 
                  type="primary"
                  onClick={() => {
                    actionRef.current?.addEditRecord?.({
                      id: new Date().getTime().toString(),
                      timestamp: new Date().toDateString(),
                      status: "open",
                    });
                  }}
                  icon={<PlusOutlined />}
                >
                  Add New Task
                </Button>
              </Space>,
            ]}
          />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Made with ❤️ by <b>Tejas Vaichole</b>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default ToDoList;
