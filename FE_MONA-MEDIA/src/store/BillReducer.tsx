
const BillReducer = (state: any, action: { payload: any, type: string }) => {
    switch (action.type) {
        case "bill/getBillByUser":
            state.bills = action.payload;
            break;
        case "bill/getBillById":
            state.bills = action.payload;
            break;
        case "bill/getAllBill":
            state.bills = action.payload;
            break;
        case "bill/getBIllByUserReview":
            state.bills = action.payload;
            break;
        case "bill/checkout":
            state.bills.push(action.payload);
            break;
        case "bill/updateBillById":
            const bill = action.payload;
            state.bills = state?.bills?.map((item: any) => item._id === bill._id ? bill : item)
            break;
        case "bill/deleteBill":
            const _id = action.payload;
            state.bills = state?.bills?.filter((item: any) => item._id !== _id)
            break;
        case "bill/deleteProductBill":
            const id = action.payload;
            state.bills = state?.bills?.filter((item: any) => item._id !== id)
            break;
        default:
            return state;
    }
}

export default BillReducer