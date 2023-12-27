
import { Button, Form, Input, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const { Option } = Select;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Space } from 'antd';
import { getaAllRole } from '../../../api/Role';
import { AddUser } from '../../../api/User';
import { UserContext } from '../../../provider/UserProvider';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY/MM/DD';


type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const UserAdd = () => {
    const { dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const [roles, setRole] = useState([]);
    const [form] = Form.useForm();

    const dataRoleReq = {
        // currentPages,
        _limit: 100
    }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getaAllRole(dataRoleReq);
                if (data.success) {
                    setRole(data.role);
                }
                else {
                    toast.error(data)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        })()
    }, [])


    const onFinish = async (values: any) => {
        try {
            const { data }: any = await AddUser(values);
            if (data.success) {
                toast.success(data.message)
                await dispatch({ type: "user/register", payload: data.user })
                navigate("/admin/users")
            } else {
                toast.error(data?.message)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return <div>
        <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            scrollToFirstError
        >
            <Form.Item<FieldType>
                label="Họ và tên"
                id='user_fullname'
                name="user_fullname"
                rules={[{ required: true, message: 'Please input your role_name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Tên đăng nhập"
                name="user_username"
                rules={[{ required: true, message: 'Please input your role_description!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                name="user_email"
                label="E-mail"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Số điện thoại"
                name="user_phone"
                rules={[{ required: true, message: 'Please input your role_description!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="Địa chỉ"
                name="user_address"
                rules={[{ required: true, message: 'Please input your role_description!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="user_password"
                label="Mật khẩu"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="user_confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('user_password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="user_gender" label="Giới tính" rules={[{ required: true }]}>
                <Select
                    placeholder="Select a option and change input text above"
                    allowClear
                >
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                    <Option value="Khác">Khác</Option>
                </Select>
            </Form.Item>
            <Form.Item name="role_id" label="Vai trò" rules={[{ required: true }]}>
                <Select
                    placeholder="Select a option and change input text above"
                    allowClear
                >
                    {roles.map((cate: any, index) => {
                        return (
                            <Option key={index} value={cate._id}>{cate.role_name}</Option>
                        )
                    })}
                </Select>
            </Form.Item>

            <Form.Item<FieldType>
                label="Sinh nhật"
                name="user_date_of_birth"
            >
                <Space direction="vertical" size={12}>
                    <DatePicker value={dayjs('2015/01/01', dateFormat)} format={dateFormat} />
                </Space>
            </Form.Item>

            {/* <Form.Item id="images" name="product_images" label="Ảnh" rules={[{ required: true, message: 'Trường ảnh không được để trống' }]}>
                <Upload action="" listType="picture" name='images' multiple>
                    <Button icon={<UploadOutlined />}>Choose images</Button>
                </Upload>
            </Form.Item> */}



            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Thêm
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default UserAdd;
