import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/accommodationApi';

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f7f7;
    padding: 20px;
`;

const LoginContainer = styled.div`
    background: white;
    border-radius: 12px;
    padding: 48px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 32px;
    text-align: center;
    color: #222;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 1rem;
    font-weight: 600;
    color: #222;
`;

const Input = styled.input`
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    
    &:focus {
        outline: none;
        border-color: #ff385c;
    }
`;

const LoginButton = styled.button`
    background: #ff385c;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 8px;
    
    &:hover {
        background: #e31c5f;
    }
    
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: #888;
    font-size: 0.9rem;
    
    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #ddd;
    }
    
    span {
        padding: 0 16px;
    }
`;

const SignupLink = styled(Link)`
    display: block;
    text-align: center;
    color: #222;
    text-decoration: none;
    font-weight: 600;
    padding: 16px;
    border: 2px solid #222;
    border-radius: 8px;
    transition: all 0.2s;
    
    &:hover {
        background: #222;
        color: white;
    }
`;

const ErrorMessage = styled.div`
    color: #ff385c;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 8px;
`;

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData.loginId, formData.password);
            
            console.log('로그인 API 응답:', response);
            console.log('응답 데이터:', response.data);
            console.log('응답 data 객체:', response.data.data);
            console.log('응답 data 객체의 키들:', Object.keys(response.data.data || {}));
            
            if (response.data.success) {
                const token = response.data.data?.accessToken;
                console.log('저장할 토큰:', token);
                
                if (token && token !== 'undefined') {
                    // JWT 토큰을 localStorage에 저장
                    localStorage.setItem('accessToken', token);
                    console.log('토큰 저장 완료');
                    // 로그인 성공 후 메인 페이지로 이동하고 새로고침
                    navigate('/');
                    window.location.reload(); // 페이지 새로고침으로 모든 컴포넌트가 새로운 로그인 상태를 인식하도록
                } else {
                    console.error('토큰이 올바르지 않습니다:', token);
                    setError('로그인 응답에 토큰이 없습니다.');
                }
            } else {
                setError('로그인에 실패했습니다.');
            }
        } catch (err) {
            console.error('로그인 에러:', err);
            setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <LoginContainer>
                <Title>로그인</Title>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="loginId">아이디</Label>
                        <Input
                            type="text"
                            id="loginId"
                            name="loginId"
                            value={formData.loginId}
                            onChange={handleChange}
                            required
                            placeholder="아이디를 입력하세요"
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="비밀번호를 입력하세요"
                        />
                    </InputGroup>
                    
                    <LoginButton type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </LoginButton>
                    
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Form>
                
                <Divider>
                    <span>또는</span>
                </Divider>
                
                <SignupLink to="/signup">
                    회원가입
                </SignupLink>
            </LoginContainer>
        </PageContainer>
    );
};

export default LoginPage; 