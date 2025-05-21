
export function handleApiError(error, navigate,toast) {
  const status = error?.response?.status

  if (status === 401) {
    localStorage.clear()
    navigate("/login")
  } else {
    toast.error("Đã xảy ra lỗi không xác định. Mã lỗi: " + status)
  }
}
