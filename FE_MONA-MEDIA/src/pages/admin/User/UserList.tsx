import { Space, Table, Popconfirm, Button, Pagination, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IUser } from '../../../types/User';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useContext, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserContext } from '../../../provider/UserProvider';
import { BanUser, DeleteUser, SearchUser } from '../../../api/User';
import { toast } from 'react-toastify';
import { getaAllRole } from '../../../api/Role';
const UserList = () => {
    const { state: users, dispatch } = useContext(UserContext);
    const [currentPages, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [_keywords] = useState('');

    const [roles, setRole] = useState([]);

    const dataRoleReq = {
        // currentPages,
        _limit: 100
    }
    console.log(users);


    // XỬ LÝ KHI CHUYỂN TRANG
    const onHandlePageChange = (page: number) => {
        setCurrentPage(page);
    }
    const dataUser = users?.users;

    const dataUserReq = {
        _limit: 100
    }

    const onChange = async (value: any) => {
        const newStatus = !value?.user_status; // Đảo ngược trạng thái
        console.log(value);

        const formData = {
            _id: value?._id,
            ...value,
            status: newStatus, // Gán giá trị mới cho product_status
        };

        try {
            const { data } = await BanUser(formData);
            if (data.data?.user_status) {
                toast.success(`Mở `)
            } else {
                toast.success(`Khóa`)
            }
        } catch (error: any) {
            console.log(error);

            toast.error(`${error.data.message}`)
        }
    };


    useEffect(() => {
        (async () => {
            try {
                const { data } = await getaAllRole(dataRoleReq);
                if (data.success) {
                    setRole(data.role);
                    setTotalItems(data.pagination.totalItems);
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const { data } = await SearchUser(dataUserReq);
                if (data.success) {
                    dispatch({ type: "user/getall", payload: data.users })
                    setTotalItems(data.pagination.totalItems);
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        })()
    }, [currentPages, _keywords])

    const onHandleRemove = async (_id: string) => {
        try {
            const { data } = await DeleteUser(_id);

            if (data.success) {
                dispatch({ type: "user/delete", payload: data.deleteUser._id })
                toast.success(data.message);
            }
        } catch (error: any) {
            toast.error(error)
        }
    }
    const columns: ColumnsType<IUser> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (record) => {
                return record + 1
            }
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'user_fullname',
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
            title: 'Ảnh',
            dataIndex: 'user_avatar',
            key: 'avatar',
            render: (record) => <Image width={100} src={record} />
        },
        {
            title: 'Email',
            dataIndex: 'user_email',
            key: 'email',
            // render: (record) => {
            //     if (record.length > 15) {
            //         return record.slice(0, 15).concat("...");
            //     } else {
            //         return record;
            //     }
            // }
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'user_phone',
            key: 'user_phone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'user_address',
            key: 'address',
            render: (record) => {
                if (record?.length > 20) {
                    return record.slice(0, 20).concat("...");
                } else {
                    return record;
                }
            }
        },
        {
            title: 'Chức vụ',
            dataIndex: 'role_id',
            key: 'role',
            render: (record) => {
                const roleName: any = roles?.find((item: any) => item._id === record)
                return roleName?.role_name;
            }
        },
        {
            title: 'Giới tính',
            dataIndex: 'user_gender',
            key: 'user_gender',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'user',
            key: 'user',
            render: (record) => {
                return <Switch defaultChecked={record?.user_status} onClick={() => onChange(record)} />
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
                    <Button><Link to={`/admin/users/${record._id}/update`}><EditOutlined style={{ fontSize: '20px', color: '#08c' }} /></Link></Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={dataUser.map((item: any, index: any) => ({ ...item, user: item, STT: index }))} pagination={false} />
            <Pagination current={currentPages} total={totalItems} onChange={onHandlePageChange} />
        </div>
    )
}

export default UserList