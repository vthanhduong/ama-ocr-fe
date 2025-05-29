import { InboxOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { React, useEffect, useState } from 'react'
import { arApi } from '../../../api/arApi'

export default function AnalyzeDocumentModal({ visible, onCancel, openSuccessNotification, openErrorNotification, fetchAllAnalyzeResults }) {
    const options = [
        { value: 'ama/local-extractor', label: 'ama/local-extractor'},
        { value: 'azure/prebuilt-read', label: 'azure/prebuilt-read' },
        { value: 'google/gemini-20-flash', label: 'google/gemini-2.0-flash'},
        { value: 'openai/o4-mini', label: 'openai/o4-mini' },
    ]
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState("");
    const [submittable, setSubmittable] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const props = {
        multiple: false,
        fileList,
        showUploadList: true,
        beforeUpload: file => {
            setFileList([file]);
            setFileName(file.name);
            return false;
        },
        onRemove: file => {
            setFileList([]);
            setFileName("");
        },
        onChange: file => {
            if (fileName) {
                setSubmittable(false);
            }
        }
    }
    const onFinish = (values) => {
        setIsAnalyzing(true);
        const formData = new FormData()
        formData.append("document", fileList[0]);
        arApi.postAnalyzeResults(values.model, formData)
        .then((result) => {
            openSuccessNotification("Analyze document successfully");
            fetchAllAnalyzeResults();
        })
        .catch((err) => {
            openErrorNotification("Analyze document failed");
        })
        .finally(() => {
            setIsAnalyzing(false);
            setFileList([]);
            setFileName("");
            setSubmittable(false);
            currentOnCancel();
        })
    }
    const currentOnCancel = () => {
        setFileList([]);
        setFileName("");
        setSubmittable(false);
        form.resetFields(['model', 'file']);
        onCancel();
    }
    return (
        <Modal
            title="Analyze Document"
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            maskClosable={!isAnalyzing}
            closable={!isAnalyzing}
            width={{
                xs: '90%',
                sm: '80%',
                md: '80%',
                lg: '80%',
                xl: '70%',
                xxl: '70%',
            }}
            >
                <Form form={form} name="form" layout="vertical" autoComplete="off" onFinish={onFinish} disabled={isAnalyzing}> 
                    <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please choose a model' }]}>
                        <Select
                            name="model"
                            size="large"
                            placeholder="Choose a model"
                            options={options}
                            style={{width: 250}}>
                        </Select>
                    </Form.Item>
                    <Form.Item name="file" rules={[{ required: true, min: 1, message: 'Please upload supported file' }]}>
                        <div className="my-1">
                            <input type="text" className="invisible"></input>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag document file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single file (PDF, DOCX, PPTX, XLSX, JPG, PNG, BMP)
                                </p>
                            </Dragger>
                        </div>
                    </Form.Item>
                    <div className="flex gap-x-2 justify-end">
                        <SubmitButton form={form} submittable={submittable} setSubmittable={setSubmittable} isAnalyzing={isAnalyzing} fileName={fileName}>
                            Analyze
                        </SubmitButton>
                        <Button type="default" onClick={currentOnCancel} disabled={isAnalyzing}>
                            Cancel
                        </Button>
                    </div>
                </Form>
        </Modal>
    )
}
const SubmitButton = ({ form, children, submittable, setSubmittable, isAnalyzing }) => {
    const values = Form.useWatch([], form);
    useEffect(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => {if (values.file && values.model) setSubmittable(true)})
        .catch(() => setSubmittable(false));
    }, [form, values]);
    return (
      <Button type="primary" htmlType="submit" disabled={!submittable && !isAnalyzing} loading={isAnalyzing}>
        {children}
      </Button>
    );
  };