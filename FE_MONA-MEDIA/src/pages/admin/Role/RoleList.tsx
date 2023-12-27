import { Button, Pagination, Popconfirm, Space, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { RoleContext } from "../../../provider/RoleProvider";
import { deleteRole, getaAllRole } from "../../../api/Role";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { EditOutlined } from '@ant-design/icons';

const RoleList = () => {
    const { state: roles, dispatch } = useContext(RoleContext);
    const [currentPages, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const dataRole = roles?.roles;
    const dataRoleReq = {
        // currentPages,
        _limit: 100
    }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getaAllRole(dataRoleReq);
                if (data.success) {
                    await dispatch({ type: "role/search", payload: data.role })
                    setTotalItems(data.pagination.totalItems);
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        })()
    }, [currentPages])

    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    // Hàm xử lý xóa
    const onHandleRemove = async (_id: string) => {
        try {
            const { data } = await deleteRole(_id);
            if (data.success) {
                dispatch({ type: "role/delete", payload: data.deleteRole._id })
                toast.success(data.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message);
        }
    }

    // data table
    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (record) => {
                return record + 1
            }
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'role_name',
            key: 'name',
            render: (record) => {
                if (record?.length > 15) {
                    return record.slice(0, 15).concat("...");
                } else {
                    return record;
                }
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'role_description',
            key: 'role_description',
            render: (record) => {
                if (record?.length > 15) {
                    return record.slice(0, 15).concat("...");
                } else {
                    return record;
                }
            }
        },

        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Popconfirm
                        placement="top"
                        title={"Bạn muốn xóa?"}
                        onConfirm={() => onHandleRemove(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button><DeleteOutlined style={{ fontSize: '20px', color: '#f5222d', outline: 'none' }} /></Button>
                    </Popconfirm>
                    <Button><Link to={`/admin/roles/${record._id}/update`}><EditOutlined style={{ fontSize: '20px', color: '#08c' }} /></Link></Button>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Table columns={columns} dataSource={dataRole && dataRole?.map((item: any, index: any) => ({ ...item, STT: index }))} pagination={false} />
            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} className="mt-5" />
        </div>
    );
};

export default RoleList;
