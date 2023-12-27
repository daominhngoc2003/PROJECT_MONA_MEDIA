import { Button, Form, Input } from 'antd';
import { RoleContext } from '../../../provider/RoleProvider';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRole } from '../../../api/Role';
import { toast } from 'react-toastify';


type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const RoleAdd = () => {
    const { dispatch } = useContext(RoleContext);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const { data }: any = await addRole(values);
            if (data.success) {
                toast.success(data?.message)
                await dispatch({ type: "role/add", payload: data.role })
                navigate("/admin/roles")
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
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Tên vai trò"
                name="role_name"
                rules={[{ required: true, message: 'Please input your role_name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Mô tả"
                name="role_description"
                rules={[{ required: true, message: 'Please input your role_description!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Thêm
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default RoleAdd;
