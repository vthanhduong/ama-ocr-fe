import React from "react";

export default function LoadingButton({
  onClick,
  loading,
  disabled,
  children,
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={
        `p-2 rounded font-semibold disabled:opacity-50 ${className} transition duration-200`
      }
      {...props}
    >
      {loading ? (
        <span className="flex justify-center items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Đang xử lý...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
