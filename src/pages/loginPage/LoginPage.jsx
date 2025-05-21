import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {authApi} from '../../api/auth';
import { setToken } from "../../utils/auth";
import LoadingButton from "../../components/LoadingButton";
import useCountdown from "../../hooks/useCountDown";
import { localStorageService } from "../../services/localStorageService";

export default function LoginPage() {
    const [step, setStep] = useState("email"); // "email" | "otp"
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const { countdown, isActive: cooldown, start: startCountdown } = useCountdown(60);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Email không hợp lệ");
            return;
        }

        try {
            setLoading(true);
            await authApi.requestOTP(email);
            setStep("otp");
            setError("");
            startCountdown();
        } catch (err) {
            console.log(err);
            setError("Không gửi được OTP");
        } finally  {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const res = await authApi.verifyOTP(email, otp);
            setToken(res.data?.token);
            localStorageService.setItem("email", email);
            localStorageService.setItem("role",res.data?.role);
            navigate("/");
        } catch (err) {
            setError("Mã OTP không hợp lệ hoặc đã hết hạn");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            {step === "email" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
                    <input
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <LoadingButton
                        onClick={handleSendOtp}
                        loading={loading}
                        className="w-full bg-blue-500 mt-2 text-white cursor-pointer"
                    >
                        Gửi mã xác thực
                    </LoadingButton>
                </>
            )}

            {step === "otp" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Nhập mã OTP</h2>
                    <input
                        type="text"
                        placeholder="6 chữ số"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <LoadingButton
                        onClick={handleVerifyOtp}
                        loading={loading}
                        className="w-full bg-green-500 mt-2 text-white cursor-pointer"
                    >
                        Xác minh OTP
                    </LoadingButton>
                    <div className="mt-4 text-sm text-center">
                        {cooldown ? (
                            <span className="text-gray-500">Gửi lại sau {countdown} giây</span>
                        ) : (
                            <LoadingButton
                                onClick={handleSendOtp}
                                loading={loading}
                                className="text-blue-600 underline"
                            >
                                Gửi lại mã OTP
                            </LoadingButton>
                        )}
                        <br />
                        <button
                            onClick={() => {
                                setStep("email");
                                setError("");
                            }}
                            className="text-gray-600 mt-2 underline"
                        >
                            Thay đổi email
                        </button>
                    </div>
                </>
            )}

            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    )
}