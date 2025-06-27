import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/accommodationApi';

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f7f7;
    padding: 20px;
`;

const SignupContainer = styled.div`
    background: white;
    border-radius: 12px;
    padding: 48px;
    width: 100%;
    max-width: 450px;
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

const SignupButton = styled.button`
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

const LoginLink = styled(Link)`
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

const SuccessMessage = styled.div`
    color: #00a699;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 8px;
`;

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        loginId: '',
        password: '',
        username: '',
        phone: '',
        profileImage: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            setFormData({
                ...formData,
                profileImage: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await signup(
                formData.email,
                formData.loginId,
                formData.password,
                formData.username,
                formData.phone,
                formData.profileImage
            );
            
            if (response.data.success) {
                setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                // 2초 후 로그인 페이지로 이동
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError('회원가입에 실패했습니다.');
            }
        } catch (err) {
            setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <SignupContainer>
                <Title>회원가입</Title>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="이메일을 입력하세요"
                        />
                    </InputGroup>
                    
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
                    
                    <InputGroup>
                        <Label htmlFor="username">이름</Label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="이름을 입력하세요"
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="전화번호를 입력하세요"
                        />
                    </InputGroup>
                    
                    <InputGroup>
                        <Label htmlFor="profileImage">프로필 이미지 (선택사항)</Label>
                        <Input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </InputGroup>
                    
                    <SignupButton type="submit" disabled={loading}>
                        {loading ? '회원가입 중...' : '회원가입'}
                    </SignupButton>
                    
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{success}</SuccessMessage>}
                </Form>
                
                <Divider>
                    <span>또는</span>
                </Divider>
                
                <LoginLink to="/login">
                    로그인
                </LoginLink>
            </SignupContainer>
        </PageContainer>
    );
};

export default SignupPage; 