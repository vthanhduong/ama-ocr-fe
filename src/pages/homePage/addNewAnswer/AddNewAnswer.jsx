import React, { useState } from 'react'
import LoadingButton from '../../../components/LoadingButton';
import { qaApi } from '../../../api/qaApi';
import { getToken } from '../../../utils/auth';
import { handleApiError } from '../../../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddNewAnswer({setTab}) {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [gptAnswer, setGptAnswer] = useState("");
    const [intention, setIntention] = useState("");
    const [userIntention, setUserIntention] = useState("");
    const [textFile, setTextFile] = useState('')
    const [keywords, setKeywords] = useState([])
    const [questionForUser, setQuestionForUser] = useState('')
    const [suggestion, setSuggestion] = useState('')
    const [loaiDichVu, setLoaiDichVu] = useState('')
    const [nguCanh,setNguCanh] = useState('')
    const token = getToken();
    const handleSubmit = async () => {
        setLoading(true);
        if (question.trim() === '') return;
        try {
            const res = await qaApi.ask(question, token);
            setIntention(res.data?.intention ?? "");
            setGptAnswer(res.data?.answer ?? "");
            setShowTable(true);
        } catch (error) {
            handleApiError(error,navigate,toast);
        } finally{
            setLoading(false);
        }
    }
    const handleSubmitAnswer = async () => {
        setLoading(true);
        if (!question || !gptAnswer || !textFile || !intention || !userIntention) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.")
            return
        }
        // if (!keywords || Object.keys(keywords).length === 0) {
        //     message.error("Thiếu thông tin từ khóa.")
        //     return
        // }

        // Kiểm tra từng keyword value
        for (const [key, value] of Object.entries(keywords)) {
            if (!value || value.trim() === '') {
                toast.error(`Từ khóa "${key}" không có giá trị.`)
                return
            }
        }
        try {
            await qaApi.createAnswer(
                {
                    question,
                    gpt_answer: gptAnswer,
                    wish_answer: textFile,
                    user_intention: intention,
                    keywords,
                    user_intention_input: userIntention,
                    question_for_user: questionForUser,
                    suggestion,
                    loai_dich_vu: loaiDichVu,
                    ngu_canh: nguCanh
                },
                token
            )
            setTab("2")
            toast.success("Thêm câu trả lời thành công!")
        } catch (err) {
            handleApiError(err,navigate,toast);
            console.log(err);
            
        } finally{
            setLoading(false);
        }
    }
    const handleTextFileChange = (value) => {
        setTextFile(value)

        const matches = [...value.matchAll(/\[\.\.\.(.*?)\.\.\.\]/g)]
        const newKeywords = {}

        matches.forEach((match) => {
            const key = match[1].trim()
            if (key) newKeywords[key] = keywords[key] || ""
        })

        setKeywords(newKeywords)
    }
  return (
    <div className="w-full mt-10 bg-white">
          <div className='mx-auto px-2 max-w-xl flex gap-4'>
              <textarea
                  rows={1}
                  type="text"
                  placeholder="Nhập câu hỏi..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="p-2 w-3/4 border rounded"
              />
              <LoadingButton
                  onClick={handleSubmit}
                  loading={loading}
                  className="bg-blue-500 text-white cursor-pointer"
              >
                  Gửi câu hỏi
              </LoadingButton>
          </div>
          {showTable && (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border w-1/2">Câu trả lời của AI</th>
                        <th className="p-2 border">Câu trả lời mong muốn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border">{gptAnswer}</td>
                        <td className="p-2 border">
                            <textarea
                                rows={5}
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={textFile}
                                onChange={(e) => handleTextFileChange(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">SUB QUESTION</th>
                        <th className="p-2 border">Ý định người dùng GPT</th>
                        <th className="p-2 border"> Phân tích ý định mong muốn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border space-y-1">
                            {Object.entries(keywords).map(([key, value]) => (
                                <div key={key}>
                                <label className="block text-sm text-gray-500 mb-1">{key}:</label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                    setKeywords((prev) => ({ ...prev, [key]: e.target.value }))
                                    }
                                    className="w-full border p-1 rounded"
                                />
                                </div>
                            ))}
                        </td>
                        <td className="p-2 border">{intention}</td>
                        <td className="p-2 border">
                            <textarea
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={userIntention}
                                onChange={(e) => setUserIntention(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Hỏi ngược để xác định</th>
                        <th className="p-2 border">Suggestion</th>
                        <th className="p-2 border">Loại dịch vụ</th>
                        <th className="p-2 border">Ngữ cảnh</th>
                        <th className="p-2 border">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 border space-y-1">
                            <textarea
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={questionForUser}
                                onChange={(e) => setQuestionForUser(e.target.value)}
                            />
                        </td>
                        <td className="p-2 border">
                            <textarea
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                            />
                        </td>
                        <td className="p-2 border">
                            <textarea
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={loaiDichVu}
                                onChange={(e) => setLoaiDichVu(e.target.value)}
                            />
                        </td>
                        <td className="p-2 border">
                            <textarea
                                type="text"
                                className="w-full border p-1 rounded h-full"
                                value={nguCanh}
                                onChange={(e) => setNguCanh(e.target.value)}
                            />
                        </td>
                        <td className="p-2 border">
                            <LoadingButton
                                onClick={handleSubmitAnswer}
                                loading={loading}
                                className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                            >
                                Thêm câu trả lời
                            </LoadingButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        )}
    </div>
  )
}
