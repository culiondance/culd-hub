import {Button, Modal, Progress, Space, Table, Tag, Tooltip} from "antd";
import dayjs, {Dayjs} from "dayjs";

import {Show} from "../../../../types/types";


import {ReimbTableContextInterface} from "../../context/ReimbsTableContext/types";
import {ReimbTableContext} from "../../context/ReimbsTableContext";

const ReimbsTable = ({user}: { user: User }) => {

    const {
        reimbs
        needsRefresh
    }: ReimbContextInterface = useContext(ReimbsTableContext)

    const columns = [
        {
            title: "completed",
            key:"",
            dataIndex: "completed"
            render: (completed:bool) => {completed? (<Icon type="check-square"/>) : <Icon type="clock-circle" />},
        },
        {
            title: "date"
            key:"date",
            dataIndex: "date"
            render: (date: Dayjs) => (date ? date.format("ddd, MMM DD") : ""),
            sorter: (a, b) => a.date?.diff(b.date),
        },
        {
            title:"show"
            key:"name",
            dataIndex: "name"
            render: (show: Show) => {return (<>
                <span style={{
                    fontSize: "1.05em",
                    marginRight: "8px"
                }}>{show.name}</span>
                <Tooltip
                    title="More Info"
                    placement="bottom"
                    style={{textAlign: "center"}}
                >
                    <InfoCircleOutlined
                        style={{color: "gray"}}
                        onClick={() => {
                            Modal.info({
                                title: show.name,
                                content: <ShowDetails show={show}/>,
                                width: "60%",
                            });
                        }}
                    />
                </Tooltip>
            }
        },
        {
            title:"amount"
            key:"amount",
            dataIndex: "amount"
            render:(amount) => {return ("$" + amount.toFixed(2))},
        },
        {
            title:"receipts"
            key:"receipts",
            dataIndex: "receipts"
            render: "todo",
        },
    ]



    return view == Views.TABLE && <Table
        columns={columns}
        dataSource={reimbs}
        size="middle"
        loading={needsRefresh}
        pagination={false}
    />;
}
