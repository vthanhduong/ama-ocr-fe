import { srcImg } from "../../assets/srcImg";
import { Menu, Tooltip } from 'antd';
import { clearToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { localStorageService } from "../../services/localStorageService";
import { QuestionCircleOutlined,CheckCircleOutlined,BarChartOutlined } from '@ant-design/icons';
import React from "react";
import AddNewAnswer from "./addNewAnswer/AddNewAnswer";
import QuestionHistory from "./questionHistory/QuestionHistory";
import ApproveAnswer from "./approveAnswer/ApproveAnswer";
import ApproveHistory from "./approveHistory/approveHistory";
import AllAnswers from "./allAnswers/AllAnswers";

export default function HomePage() {
    const navigate = useNavigate();
    const [tab, setTab] = React.useState("1");
    const handleLogout = () => {
        clearToken();
        localStorageService.removeItem("email");
        navigate("/login")
    }
    const handleChangeMenu = (e) => {        
        setTab(e.key)
    }
    const renderTab = () => {
        switch (tab) {
            case "1":
                return <AddNewAnswer setTab={setTab} />
            case "2":
                return <QuestionHistory/>
            case "3":
                return <ApproveAnswer/>
            case "4":
                return <ApproveHistory/>
            case "5":
                return <AllAnswers/>
            default:
                return null;
        }
    }
    const items = [
        {
            key: "menu1",
            label: 'Tạo câu trả lời',
            icon: <QuestionCircleOutlined />,
            children: [
                {
                    key: "1",
                    label: "Tạo câu trả lời mới"
                },
                {
                    key: "2",
                    label: "Lịch sử tạo câu trả lời"
                }
            ]
        },
        {
            key: "menu2",
            label: 'Duyệt câu trả lời',
            icon: <CheckCircleOutlined />,
            children: [
                {
                    key: "3",
                    label: "Lấy câu trả lời chưa duyệt"
                },
                {
                    key: "4",
                    label: "Lịch sử duyệt câu trả lời"
                }
            ]
        },
        {
            key: "menu3",
            label: 'Thống kê',
            icon: <BarChartOutlined />,
            children: [
                {
                    key: "5",
                    label: "Lấy tất cả câu trả lời"
                }
            ]
        }
    ]
    const renderLogoutButton = () => {
        return <div onClick={handleLogout} className="w-full text-red-500 text-lg font-medium px-2 cursor-pointer">
            <p>Đăng xuất</p>
        </div>
    }
    return (
        <div className="container">
            <div className="w-screen h-screen">
                {/* header */}
                <div className="bg-sky-500 h-16 w-full flex items-center justify-between px-8">
                    <div className="text-3xl text-white font-medium">AmA AI</div>
                    <Tooltip trigger={"click"} color="white" title={renderLogoutButton()}>
                        <div className="w-12 p-1 bg-white rounded-full cursor-pointer">
                            <img className="w-full" src={srcImg.adminIcon} />
                        </div>
                    </Tooltip>
                </div>
                <div className="w-full flex">
                    <Menu
                        onClick={handleChangeMenu}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['menu1']}
                        mode="inline"
                        items={items}
                    />
                    <div className="w-full">
                        {renderTab()}
                    </div>
                </div>
            </div>
        </div>
    );
}