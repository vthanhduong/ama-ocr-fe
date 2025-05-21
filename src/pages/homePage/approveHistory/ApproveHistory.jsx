import React, { useEffect } from 'react'
import { getToken } from '../../../utils/auth';
import { qaApi } from '../../../api/qaApi';
import { formatDate } from '../../../utils/globalFunction';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export default function ApproveHistory() {
    const [answerList, setAnswerList] = React.useState([]);
    const [expand, setExpand] = React.useState(-1);
    useEffect(() => {
        let token = getToken();
        qaApi.getApproveHistory(token).then((res) => {
            setAnswerList(res.data);
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    const renderStatus = (status) => {
        switch (status) {
            case 0:
                return <span className='text-red-500 font-medium'>Đã hủy</span>;
            case 1:
                return <span className='text-yellow-500 font-medium'>Chờ duyệt</span>;
            case 2:
                return <span className='text-green-500 font-medium'>Đã duyệt</span>;
            case 3:
                return <span className='text-red-500 font-medium'>Không duyệt</span>;
            default:
                return <span className='text-gray-500 font-medium'>Không xác định</span>;
        }
    }
    const renderKeywords = (keywords) => {
        if(!keywords || keywords.length === 0) return null;
        return keywords.map((item) => {
            return (
                <p><span className='font-medium'>{item?.keyword}</span>:{item?.value}</p>
            )
        })
    }
    const renderCompactTable = (item, index) => {
        return (
            <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">STT</th>
                        <th className="p-2 border">Câu hỏi</th>
                        <th className="p-2 border">Câu trả lời của AI</th>
                        <th className="p-2 border">Ý định người dùng GPT</th>
                        <th className="p-2 border">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{item?.question}</td>
                        <td className="p-2 border">{item?.gpt_answer}</td>
                        <td className="p-2 border">{item?.user_intention}</td>
                        <td className="p-2 border">{renderStatus(item?.status)}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
    const renderFullTable = (item, index) => {
        return(
            <>
                <table className="w-full border border-gray-300 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">STT</th>
                            <th className="p-2 border">Câu hỏi</th>
                            <th className="p-2 border">Câu trả lời của AI</th>
                            <th className="p-2 border">Câu trả lời mong muốn</th>
                            <th className="p-2 border">Ngày tạo</th>
                            <th className="p-2 border">Người tạo</th>
                            <th className="p-2 border">SUB QUESTION</th>
                            <th className="p-2 border">Ý định người dùng GPT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border">{index + 1}</td>
                            <td className="p-2 border">{item?.question}</td>
                            <td className="p-2 border">{item?.gpt_answer}</td>
                            <td className="p-2 border">{item?.wish_answer}</td>
                            <td className="p-2 border">{formatDate(item?.create_date)}</td>
                            <td className="p-2 border">{item?.users_?.email}</td>
                            <td className="p-2 border">{renderKeywords(item?.keyword)}</td>
                            <td className="p-2 border">{item?.user_intention}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border border-gray-300 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className='p-2 border'>Phân tích ý định mong muốn</th>
                            <th className='p-2 border'>Hỏi ngược để xác định</th>
                            <th className='p-2 border'>Suggestion</th>
                            <th className='p-2 border'>Loại dịch vụ</th>
                            <th className='p-2 border'>Ngữ cảnh</th>
                            <th className="p-2 border">Trạng thái</th>
                            <th className="p-2 border">Thời gian duyệt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            
                            <td className="p-2 border">{item?.user_intention_input}</td>
                            <td className="p-2 border">{item?.question_for_user}</td>
                            <td className="p-2 border">{item?.suggestion}</td>
                            <td className="p-2 border">{item?.loai_dich_vu}</td>
                            <td className="p-2 border">{item?.ngu_canh}</td>
                            <td className="p-2 border">{renderStatus(item?.status)}</td>
                            <td className="p-2 border">{formatDate(item?.approve_date)}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }
    const renderContent = () => {
        return answerList.map((item,index) => {
            return (
                <div key={index} className='w-full mb-10 px-2'>
                    {
                        expand === index ? renderFullTable(item,index) : renderCompactTable(item,index)
                    }
                    <button
                        className="px-4 py-2 text-black text-2xl cursor-pointer"
                        onClick={() => {
                            setExpand(expand === index ? -1 : index);
                        }}
                    >
                        {expand === index ? <UpOutlined /> : <DownOutlined/>}
                    </button>
                </div>
            )
        })
    }
  return (
    <div className='w-full mt-10 bg-white overflow-y-auto'>
        {renderContent()}
    </div>
  )
}
