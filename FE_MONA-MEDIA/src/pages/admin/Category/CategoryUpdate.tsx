import React, { useEffect, useContext } from 'react';
import { Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ICategory } from '../../../types/Category';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryContext } from '../../../provider/CategoryProvider';
import { updateCategory } from '../../../api/Category';
import { toast } from "react-toastify";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


const CategoryUpdate = () => {
    const formRef = React.useRef<FormInstance>(null);
    const { id } = useParams<{ id: string }>();
    const { state, dispatch } = useContext(CategoryContext);

    const navigate = useNavigate();

    useEffect(() => {
        const concurren = state?.categories?.find((cate: ICategory) => cate._id === id);
        if (concurren) {
            formRef.current?.setFieldsValue(concurren);
        }
    }, [id, state?.categories])

    const onFinish = async (values: ICategory) => {
        try {
            const categoryUpdate = {
                ...values, _id: id
            }
            const { data } = await updateCategory(categoryUpdate)
            console.log(data);

            if (data) {
                dispatch({ type: "category/update", payload: data.category })
                toast.success(data.message);
                navigate("/admin/categories")
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    };
    return (
        <div>
            <Form
                {...layout}
                ref={formRef}
                name="control-ref"
                onFinish={onFinish}
                style={{ maxWidth: 900 }}
            >

                <Form.Item id="name" name="category_name" label="Tên sản phẩm" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CategoryUpdate