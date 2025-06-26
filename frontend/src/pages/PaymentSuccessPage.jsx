import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { approvePayment } from '../api/accommodationApi';

const PageWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    padding: 20px;
`;

const SuccessCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
`;

const SuccessIcon = styled.div`
    font-size: 64px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    color: #28a745;
    margin-bottom: 16px;
    font-size: 2rem;
`;

const Message = styled.p`
    color: #666;
    margin-bottom: 24px;
    font-size: 1.1rem;
    line-height: 1.5;
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

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        // URL 파라미터에서 결제 정보 추출
        const orderId = searchParams.get('orderId');
        const paymentKey = searchParams.get('paymentKey');
        const amount = searchParams.get('amount');

        if (orderId && paymentKey && amount) {
            setPaymentInfo({
                orderId,
                paymentKey,
                amount: parseInt(amount)
            });

            // approvePayment API 호출
            approvePayment(paymentKey, orderId, parseInt(amount))
                .then(res => {
                    console.log('결제 승인 성공:', res.data);
                })
                .catch(err => {
                    console.error('결제 승인 실패:', err);
                });
        }
    }, [searchParams]);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoTrips = () => {
        navigate('/trips'); // 여행 페이지로 이동 (필요시 구현)
    };

    return (
        <PageWrapper>
            <SuccessCard>
                <SuccessIcon>✅</SuccessIcon>
                <Title>결제가 완료되었습니다!</Title>
                <Message>
                    예약이 성공적으로 확정되었습니다.<br/>
                    결제 내역은 이메일로 발송됩니다.
                </Message>
                
                {paymentInfo && (
                    <div style={{marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px'}}>
                        <p style={{margin: '4px 0', fontSize: '0.9rem', color: '#666'}}>
                            주문번호: {paymentInfo.orderId}
                        </p>
                        <p style={{margin: '4px 0', fontSize: '0.9rem', color: '#666'}}>
                            결제금액: ₩{paymentInfo.amount.toLocaleString()}
                        </p>
                    </div>
                )}
                
                <div>
                    <Button onClick={handleGoHome}>홈으로 돌아가기</Button>
                    <Button onClick={handleGoTrips}>내 여행 보기</Button>
                </div>
            </SuccessCard>
        </PageWrapper>
    );
};

export default PaymentSuccessPage; 