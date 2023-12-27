import { Button, Form, FormInstance, Input } from 'antd';
import { RoleContext } from '../../../provider/RoleProvider';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById, udpateRole } from '../../../api/Role';
import { toast } from 'react-toastify';


type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const RoleUpdate = () => {
    const { id } = useParams<{ id: any }>()
    const formRef = React.useRef<FormInstance>(null);
    const { dispatch } = useContext(RoleContext);
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const dataReq = {
                _id: id,
                ...values
            }

            const { data }: any = await udpateRole(dataReq);
            if (data.success) {
                toast.success(data?.message)
                await dispatch({ type: "role/update", payload: data.role })
                navigate("/admin/roles")
            } else {
                toast.error(data?.message)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await getRoleById(id);
                if (data.success) {
                    dispatch({ type: "role/getDetail", payload: data.role })
                    formRef.current?.setFieldsValue(data.role);
                } else {
                    toast.error(data.message)
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message);
            }
        }
        fetchProduct();
    }, [id, dispatch])

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return <div>
        <Form
            name="control-ref"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 1000 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={formRef}
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
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    </div>;
};

export default RoleUpdate;
