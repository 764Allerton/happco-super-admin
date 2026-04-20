import { MediaEndpoints } from 'Utils/MediaEndpoints';
import { Button, Watermark } from 'antd';
import React, { useEffect, useState } from 'react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const errorHandler = (error, info) => {
            console.error('Error:', error, info);
            setHasError(true);
        };
        window.addEventListener('error', errorHandler);
        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []);

    return hasError ? (
        <Watermark className="grid place-items-center min-h-screen" width={270} image={MediaEndpoints.logo}>
            <div className='text-center rounded bg-danger p-5 shadow-custom' style={{ opacity: 0.8, zIndex: 99 }}>
                <h2 className='text-black'>Something went wrong.</h2>
                <Button className='authButton' type='ghost' onClick={() => window.location.reload()}>Reload</Button>
            </div>
        </Watermark>
    ) : (
        children
    );
};

export default ErrorBoundary;
