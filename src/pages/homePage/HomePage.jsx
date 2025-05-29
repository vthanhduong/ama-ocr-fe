import { Menu } from 'antd';
import React from "react";
import AnalyzeResult from "./+(AnalyzeResult)/AnalyzeResult";
import AnalyzeDocument from './+(AnalyzeDocument)/AnalyzeDocument';

export default function HomePage() {
    const [tab, setTab] = React.useState("1");
    const handleChangeMenu = (e) => {        
        setTab(e.key)
    }
    const renderTab = () => {
        switch (tab) {
            case "1":
                return <AnalyzeResult setTab={setTab} />
        }
    }
    const items = [
        {
            key: "menu1",
            label: 'Dashboard',
            children: [
                {
                    key: "1",
                    label: "Analyze Results"
                },
                // {
                //     key: "2",
                //     label: "Analyze Document"
                // },
                // {
                //     key: "3",
                //     label: "Analyze Document (FT)"
                // }
            ]
        },
    ]
    return (
            <div className="h-screen w-full">
                {/* header */}
                <div className="bg-sky-500 h-16 w-full flex items-center justify-between px-8">
                    <div className="text-3xl text-white font-medium">AmA AI</div>
                </div>
                <div className="flex">
                    <Menu
                        onClick={handleChangeMenu}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['menu1']}
                        mode="inline"
                        items={items}
                    />
                    <div className="w-full bg-white">
                        { renderTab() }
                    </div>
                </div>
            </div>
    );
}