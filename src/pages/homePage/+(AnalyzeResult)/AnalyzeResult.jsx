import React, { useEffect, useRef } from 'react'
import { arApi } from '../../../api/arApi'
import { formatDate } from '../../../utils/globalFunction';
import { Button, Popconfirm, Select, Table, notification } from 'antd';
import './AnalyzeResult.css'
import { Helmet } from 'react-helmet';
import Search from 'antd/es/input/Search';
import { PlusCircleOutlined } from '@ant-design/icons';
import AnalyzeDocumentModal from './AnalyzeDocumentModal';
import AnalyzeResultContentModal from './AnalyzeResultContentModal';

export default function AnalyzeResult() {
    const [analyzeResults, setAnalyzeResults] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [isDataLoading, setIsDataLoading] = React.useState(true);
    const [resultData, setResultData] = React.useState({})
    const [contentModalVisible, setContentModalVisible] = React.useState(false);
    const openSuccessNotification = (description) => {
        api.success({
            message: 'Success',
            description,
            placement: 'topRight'
        })
    }
    const openErrorNotification = (description) => {
        api.error({
            message: 'Error',
            description,
            placement: 'topRight'
        })
    }
    const columns = [
        {
            title: 'File Name',
            dataIndex: 'file_name',
            key: 'file_name',
        },
        {
            title: 'Response',
            dataIndex: 'output_data',
            key: 'output_data',
            width: '50%',
            render: (text, record) => {
                const dataStr = record.output_data;
                return (
                    <JsonCell
                        dataStr={dataStr}
                        text={text}
                        handleDownload={handleDownload}
                        handleDownloadText={handleDownloadText}
                        setContentModalVisible={setContentModalVisible}
                        setResultData={setResultData}>
                    </JsonCell>
                )
            }
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model'
        },
        {
            title: 'Input token',
            dataIndex: 'input_token',
            key: 'input_token',
            render: text => text != 0 ? text : 'not using token'
        },
        {
            title: 'Output token',
            dataIndex: 'output_token',
            key: 'output_token',
            render: text => text != 0 ? text : 'not using token'
        },
        {
            title: 'Estimated cost',
            dataIndex: 'estimated_cost',
            key: 'estimated_cost',
            render: text => text + '$'
        },
        {
            title: 'Time',
            dataIndex: 'created_at',
            key: 'created_at',
            render: text => formatDate(text)
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return (
                    <Popconfirm
                        title="Delete analyze result"
                        description="Do you really want to delete this result?"
                        onConfirm={() => handleOnDelete(id)}
                        okText="Delete"
                        cancelText="Cancel"
                        >
                        <button type="button" 
                            className="rounded-xl px-4 py-2 bg-red-500 text-white hover:bg-red-700 cursor-pointer">
                        Delete
                        </button>
                    </Popconfirm>
                )
            }
        }
    ]
    useEffect(() => {
        fetchAllAnalyzeResults();
    }, [])
    const fetchAllAnalyzeResults = () => {
        arApi.getAllAnalyzeResults()
        .then((result) => {
            setAnalyzeResults(result.data.data)
            setIsDataLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    }
    const onCancel = () => {
        setModalVisible(false);
    }
    const onContentModalCancel = () => {
        setContentModalVisible(false);
    }
    const handleOnDelete = (id) => {
        setIsDataLoading(true);
        arApi.deleteAnalyzeResults(id)
        .then((result) => {
            openSuccessNotification("Delete result successfully");
            fetchAllAnalyzeResults();
        })
        .catch((err) => {
            openErrorNotification("Delete result failed")
        })
        .finally(() => {
            setIsDataLoading(false);
        })
    }
    const handleDownload = (data) => {
        var jsonPretty = JSON.stringify(JSON.parse(data), null, 2);  
        const blob = new Blob([jsonPretty], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "response.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    const handleDownloadText = (data) => {
        try {
            let text = JSON.parse(data).full_content;
            const content = text.replace(/\\n/g, '\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "response.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        catch {

        }
    }
    return (
        <>
            {contextHolder}
            <AnalyzeResultContentModal
                    visible={contentModalVisible}
                    onCancel={onContentModalCancel}
                    resultData={resultData}>

            </AnalyzeResultContentModal>
            <AnalyzeDocumentModal
                    visible={modalVisible}
                    onCancel={onCancel}
                    openSuccessNotification={openSuccessNotification}
                    openErrorNotification={openErrorNotification}
                    fetchAllAnalyzeResults={fetchAllAnalyzeResults}>
            </AnalyzeDocumentModal>
            <Helmet>
                <title>Analyze Result - AmA Data Collector</title>
            </Helmet>    
             <div className="flex">
                 <Search className="py-4 px-1" placeholder="Search by filename" size="large" allowClear style={{ width: 400 }} />
                 <div className="py-4 px-1">
                     <Select
                        size="large"
                        style={{ width: 250 }}
                        options={[{ value: 'openai/o4-mini', label: 'openai/o4-mini' }, { value: 'azure/prebuilt-read', label: 'azure/prebuilt-read' }, { value: 'ama/local-extractor', label: 'ama/local-extractor'}]}
                        placeholder="Filter by model"
                    />
                </div>
                <div className="ml-auto py-4 px-1">
                    <Button type="primary" size="large" icon={<PlusCircleOutlined />} onClick={() => setModalVisible(true)}>
                        Analyze a document
                    </Button>
                </div>
            </div>
            <Table
                loading={isDataLoading}
                dataSource={analyzeResults}
                columns={columns}
                bordered
                pagination={{pageSize: 5, hideOnSinglePage: true}}
                rowKey="id">
            </Table>
        </>
    )
}

const JsonCell = ({ dataStr, text, handleDownload, handleDownloadText, setContentModalVisible, setResultData }) => {
    const wrapperRef = useRef(null);
    useEffect(() => {
        let data;
        try {
            data = JSON.parse(dataStr);
        } catch (e) {
            console.error("Invalid JSON", e);
            return;
        }
        if (wrapperRef.current) {
            wrapperRef.current.innerHTML = "";
            jsonTree.create(data, wrapperRef.current);
        }
    }, [dataStr]);
    const handleData = () => {
        let object = JSON.parse(dataStr);
        setResultData(object);
        setContentModalVisible(true);
    }
    return (
        <>  
            <div>
                <div className="overflow-auto h-72 relative">
                    <div ref={wrapperRef} className="wrapper text-start" />
                </div>
                <div className='absolute right-[5%] bottom-[5%] flex gap-x-3'>
                    <button
                    type="button"
                    className="py-2 px-4 hover:bg-gray-300/90 bg-gray-200/80 text-black font-bold rounded-2xl cursor-pointer"
                    onClick={() => handleData()}
                    > see content
                    </button>
                    <button
                    type="button"
                    className="py-2 px-4 hover:bg-gray-300/90 bg-gray-200/80 text-black font-bold rounded-2xl cursor-pointer"
                    onClick={() => handleDownloadText(text)}
                    ><i className="fa-solid fa-download"></i> text
                    </button>
                    <button
                    type="button"
                    className="py-2 px-4 hover:bg-gray-300/90 bg-gray-200/80 text-black font-bold rounded-2xl cursor-pointer"
                    onClick={() => handleDownload(text)}
                    ><i className="fa-solid fa-download"></i> json
                    </button>
                </div>
            </div>
        </>
    );
};