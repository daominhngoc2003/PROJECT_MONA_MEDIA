import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { ICategory } from '../../../types/Category';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { addCategory } from '../../../api/Category';
import { CategoryContext } from '../../../provider/CategoryProvider';

/////////////////
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

/////////////////========================
const CategoryAdd = () => {
    const formRef = React.useRef<FormInstance>(null);
    const { dispatch } = useContext(CategoryContext);
    const navigate = useNavigate();

    const onFinish = async (values: ICategory) => {
        try {
            const { data } = await addCategory(values);
            if (data) {
                dispatch({ type: "category/add", payload: data.category })
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

                <Form.Item id="name" name="category_name" label="Tên danh mục" rules={[{ required: true, message: 'Trường tên danh mục không được để trống' }, { whitespace: true, message: 'Không được nhập space đầu tiên' }, { min: 3, message: 'Trường tên danh mục phải lớn hơn 3 ký tự' }, { max: 50, message: 'Trường tên sản phẩm không được vượt quá 50 ký tự' }]}>
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

export default CategoryAdd