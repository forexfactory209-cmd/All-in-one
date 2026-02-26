import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import './ImageUploader.css';

const API_BASE = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5000';

const ImageUploader = ({ value, onChange, label = 'Upload Image', multiple = false }) => {
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setError('');

        const uploadedUrls = [];
        const filesArray = Array.from(files);

        for (const file of filesArray) {
            if (!file.type.startsWith('image/')) {
                console.warn(`Skipping non-image file: ${file.name}`);
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                console.warn(`File too large: ${file.name}`);
                continue;
            }

            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch(`${API_BASE}/api/v1/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await res.json();
                if (data.success && data.data?.url) {
                    uploadedUrls.push(data.data.url);
                }
            } catch (err) {
                console.error('Upload error:', err);
            }
        }

        if (uploadedUrls.length > 0) {
            if (multiple) {
                const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
                onChange([...currentValues, ...uploadedUrls]);
            } else {
                onChange(uploadedUrls[0]);
            }
        } else {
            setError('Upload failed or no valid images selected.');
        }

        setUploading(false);
    };

    const handleFileChange = (e) => {
        uploadFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        uploadFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleRemove = (urlToRemove) => {
        if (multiple) {
            onChange(value.filter(url => url !== urlToRemove));
        } else {
            onChange('');
        }
        setError('');
    };

    const renderPreview = () => {
        if (!value || (multiple && value.length === 0)) return null;

        const images = multiple ? value : [value];

        return (
            <div className="uploaded-images-container">
                {images.map((url, index) => (
                    <div key={index} className="uploaded-image-preview">
                        <img src={url} alt={`Upload ${index}`} />
                        <button
                            type="button"
                            className="remove-img-btn"
                            onClick={() => handleRemove(url)}
                            title="Remove image"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`image-uploader ${multiple ? 'multiple' : ''}`}>
            {label && <label className="uploader-label">{label}</label>}

            {renderPreview()}

            <label
                className={`upload-dropzone ${dragging ? 'dragging' : ''} ${value && !multiple ? 'hidden' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <div className="dz-icon-wrap">
                    {uploading ? <div className="upload-spinner"></div> : <Upload size={24} className="dz-icon" />}
                </div>
                <div className="dz-text">
                    <strong>{uploading ? 'Uploading...' : 'Click or Drag Images'}</strong>
                    <span>JPG, PNG, WebP up to 10MB</span>
                </div>
            </label>
            {error && <p className="upload-error">{error}</p>}
        </div>
    );
};

export default ImageUploader;
