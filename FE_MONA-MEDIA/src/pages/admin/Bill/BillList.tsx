// import { Space } from 'antd';
// import type { ColumnsType } from 'antd/es/table';
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
// import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { BillContext } from '../../../provider/BillReducer';
// import { GetAllBill } from '../../../api/Bill';
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Pagination, Popconfirm, Table } from "antd";
import { getDecodedAccessToken } from "../../../decoder";
import { GetAllDStatus } from "../../../api/DStatus";
import { AbortBill, GetAllBillAdmin } from "../../../api/Bill";
import { ColumnsType } from "antd/es/table";

const BillList = () => {
    const { state: bills, dispatch } = useContext(BillContext);
    const token: any = getDecodedAccessToken();
    const [DStatus, setDStatus] = useState([]);
    const BillData = useMemo(() => bills.bills, [bills]);
    const DStatusData: any = useMemo(() => DStatus, [DStatus]);
    const roleId = token?.role_name;
    const [currentStatus, setCurrentStatus] = useState('all');
    const [filterBill, setFilterBill] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    console.log(filterBill);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await GetAllBillAdmin({ _limit: 100 });
                if (data.success) {
                    dispatch({ type: "bill/getAllBill", payload: data.bills })
                }
                else {
                    toast.error(data.message)
                }

            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        })()
    }, [])

    const fetDStatus = async () => {
        try {
            const { data } = await GetAllDStatus();
            if (data.success) {
                setDStatus(data.dstatus);
            }
            else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        fetDStatus()
    }, [])


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const onHandleChangeStatus = (status: string) => {
        setCurrentStatus(status);
        if (status === 'all') {
            setFilterBill(BillData);
        } else {
            const filtered = BillData && BillData?.filter((item: any) => item.payment_status?._id === status);
            setFilterBill(filtered)
        }
    }

    let displayedOrders: any = filterBill?.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentStatus === 'all') {
            setFilterBill(BillData);
        } else {
            const filtered = BillData?.filter((item: any) => item?.payment_status?._id === currentStatus);
            setFilterBill(filtered);
        }
        if (searchValue) {
            filterData(searchValue);
        }
    }, [currentStatus, BillData, searchValue])

    const onHandleSearch = (event: any) => {
        const value = event.target.value;
        setSearchValue(value);
        filterData(value);
    };

    const filterData = (value: any) => {
        if (value === '' || !value) {
            setFilterBill(BillData);
        } else {
            const filtered = BillData?.filter((item: any) =>
                item.bill_code.toLowerCase().includes(value)
            );
            setFilterBill(filtered);
        }
    };

    const handleDelete = async (_id: string) => {
        try {
            const { data }: any = await AbortBill(_id);
            if (data) {
                dispatch({ type: "bill/getAllBill", payload: data.bills })
                toast.success(`${data.message}`)
            }
        } catch (error: any) {
            toast.error(error?.response.data.message)
        }
    };

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            dataIndex: "STT",
            render: (index: any) => <div>{index}</div>,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "bill_code",
            render: (text: string) => <div>{text}</div>,
        },
        {
            title: "Khách hàng",
            dataIndex: "bill_fullName",
            render: (text: string) => text,
        },
        {
            title: "Số điện thoại",
            dataIndex: "bill_phone",
            render: (text: string) => text,
        },

        // {
        //     title: "Số lượng sản phẩm",
        //     dataIndex: "products",
        //     render: (record: string) => <p>{record.length}</p>,
        // },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (record: any) => <div>{new Date(record).toLocaleString()}</div>,
        },
        {
            title: "Trạng thái đơn hàng",
            dataIndex: "payment_status",
            render: (text: any) => (
                <div
                    className={` py-2 border  border-gray-300 text-center rounded-md font-medium shadow`}
                >
                    <div>{text?.pStatus_description}</div>
                </div>
            ),
        },
        {
            title: "Chức năng",
            dataIndex: "bill",
            render: (record: any) => (
                <div className="flex items-center gap-4">
                    <Link
                        to={
                            roleId == "Admin"
                                ? `/admin/bills/${record?._id}/update`
                                : `/member/bills/${record?._id}/update`
                        }
                        className="border hover:border-yellow-500 transition-all rounded-full text-[18px] px-[11px] hover:text-yellow-500"
                    >
                        <i className="fa-solid fa-info"></i>
                    </Link>
                    {record?.payment_status?.pStatus_name === "Pending" && (
                        <Popconfirm
                            title="Hủy đơn hàng"
                            description="Bạn có chắc chắn muốn hủy?"
                            className="text-black"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() => handleDelete(record?._id)}
                        >
                            <Button danger>Hủy</Button>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    return (

        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Danh sách đơn hàng</h1>
            </div>

            <div className="text-sm font-medium text-center bg-white mb-5 text-gray-500 shadow-sm border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex justify-between">
                    <li className="w-full">
                        <Link to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onHandleChangeStatus('all');
                                setCurrentStatus('all');
                            }}
                            className={` block p-4 hover:bg-gray-50 border-b-2  ${currentStatus === 'all' && "border-red-300 text-red-400 "} border-transparent rounded-t-lg hover:text-gray-600  dark:hover:text-gray-300`}>
                            Tất cả</Link>
                    </li>
                    {DStatusData && DStatusData?.map((item: any, index: string) => {

                        return (
                            <li className="w-full" key={index}>
                                <Link
                                    to={`/account/bills`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onHandleChangeStatus(item?._id);
                                    }}
                                    className={`block   ${currentStatus === item?._id && "border-red-300 text-red-400 "} p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:text-gray-300`}>
                                    {item.pStatus_description}</Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <form
                className="box-search flex items-center space-x-2 mb-3 bg-[#eaeaea] w-full py-3 ">
                <i className="fa-solid fa-magnifying-glass  pl-4"></i>
                <input type="text"
                    onChange={() => onHandleSearch(event)}
                    className="border-none outline-none w-full  bg-[#eaeaea]" placeholder="Tìm kiếm theo mã đơn hàng" />
            </form>
            <Table columns={columns} dataSource={(displayedOrders?.length > 1 || displayedOrders !== undefined) && displayedOrders?.map((bill: any, index: string) => ({
                ...bill,
                _id: bill?._id,
                bill,
                STT: (currentPage - 1) * 5 + index + 1,
            }))} pagination={false} />
            {(displayedOrders?.length > 1 || displayedOrders !== undefined) && (
                <div className="text-center">
                    <Pagination
                        current={currentPage}
                        total={filterBill?.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                    />
                </div>
            )}

        </div>
    )
}

export default BillList