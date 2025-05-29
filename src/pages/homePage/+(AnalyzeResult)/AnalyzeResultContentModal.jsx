import { Modal } from 'antd'
import React from 'react'

export default function AnalyzeResultContentModal({visible, onCancel, resultData}) {
  return (
    <Modal
    title="Analyze Document"
    open={visible}
    onCancel={onCancel}
    footer={null}
    centered
    width={{
        xs: '90%',
        sm: '90%',
        md: '90%',
        lg: '70%',
        xl: '60%',
        xxl: '50%',
    }}
    >
        <div>
            <h3 className='w-full border-b border-gray-400 font-bold my-3'>Full content</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{resultData.full_content}</p>
            <h3 className='w-full border-b border-t border-gray-400 font-bold my-3'>Paragraphs</h3>
            {
                Array.isArray(resultData.paragraphs) &&
                resultData.paragraphs.map((paragraph, index) => (
                    <p>{index}: {paragraph}</p>
                ))
            }
            <h3 className='w-full border-b border-t border-gray-400 font-bold my-3'>Tables</h3>
            {
                Array.isArray(resultData.tables) &&
                resultData.tables.map((table, tbIndex) => (
                    <>
                        <p>Table {tbIndex}</p>
                        <table key={tbIndex} 
                        style={{
                            borderCollapse: 'collapse',
                            border: '1px solid black',
                            marginTop: '3px',
                            margonBottom: '3px'
                        }}>
                            <tbody>
                                {
                                    table.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {
                                                row.map((cell, cellIndex) => (
                                                    <td key={cellIndex}  style={{
                                                        border: '1px solid black',
                                                        padding: '8px'
                                                    }}>{cell}</td>
                                                ))
                                            }
                                        </tr>
                                        
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                ))   
            }
        </div>
</Modal>
  )
}
