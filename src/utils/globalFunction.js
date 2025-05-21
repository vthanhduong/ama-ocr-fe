import moment from "moment/moment";

export const formatDate = (date) => {
        if (!date) return "";
        const utcTime = moment.utc(date);
        const localTime = utcTime.local(); // Chuyển đổi sang giờ địa phương
        return localTime.format("HH:mm:ss DD/MM/YYYY"); // Định dạng theo yêu cầu
    }