import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const PageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    padding: 20px;
`;

const FailCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
`;

const FailIcon = styled.div`
    font-size: 64px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    color: #dc3545;
    margin-bottom: 16px;
    font-size: 2rem;
`;

const Message = styled.p`
    color: #666;
    margin-bottom: 24px;
    font-size: 1.1rem;
    line-height: 1.5;
`;

const ErrorInfo = styled.div`
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: left;
`;

const Button = styled.button`
    background: #FF385C;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    margin: 8px;
    
    &:hover {
        background: #e0314a;
    }
`;

const SecondaryButton = styled.button`
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    margin: 8px;
    
    &:hover {
        background: #5a6268;
    }
`;

const PaymentFailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorInfo, setErrorInfo] = useState(null);

    useEffect(() => {
        // URL 파라미터에서 에러 정보 추출
        const code = searchParams.get('code');
        const message = searchParams.get('message');
        const orderId = searchParams.get('orderId');

        if (code || message || orderId) {
            setErrorInfo({
                code,
                message,
                orderId
            });
        }
    }, [searchParams]);

    const handleRetry = () => {
        // 이전 페이지로 돌아가기
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <PageWrapper>
            <FailCard>
                <FailIcon>❌</FailIcon>
                <Title>결제에 실패했습니다</Title>
                <Message>
                    결제 처리 중 문제가 발생했습니다.<br/>
                    다시 시도해주세요.
                </Message>
                
                {errorInfo && (
                    <ErrorInfo>
                        {errorInfo.orderId && (
                            <p style={{margin: '4px 0', fontSize: '0.9rem'}}>
                                주문번호: {errorInfo.orderId}
                            </p>
                        )}
                        {errorInfo.code && (
                            <p style={{margin: '4px 0', fontSize: '0.9rem'}}>
                                에러 코드: {errorInfo.code}
                            </p>
                        )}
                        {errorInfo.message && (
                            <p style={{margin: '4px 0', fontSize: '0.9rem'}}>
                                에러 메시지: {errorInfo.message}
                            </p>
                        )}
                    </ErrorInfo>
                )}
                
                <div>
                    <Button onClick={handleRetry}>다시 시도하기</Button>
                    <SecondaryButton onClick={handleGoHome}>홈으로 돌아가기</SecondaryButton>
                </div>
            </FailCard>
        </PageWrapper>
    );
};

export default PaymentFailPage; 