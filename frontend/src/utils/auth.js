// JWT 파싱 함수
export function parseJwt(token) {
    if (!token) {
        console.log('JWT 토큰이 없습니다.');
        return null;
    }
    
    // 'undefined' 문자열인 경우 제거
    if (token === 'undefined') {
        console.error('잘못된 토큰 (undefined) 제거');
        localStorage.removeItem('accessToken');
        return null;
    }
    
    console.log('파싱할 JWT 토큰:', token);
    console.log('토큰 길이:', token.length);
    
    try {
        // JWT 토큰 형식 검증 (header.payload.signature)
        const parts = token.split('.');
        console.log('JWT 파트 개수:', parts.length);
        console.log('JWT 파트들:', parts);
        
        if (parts.length !== 3) {
            console.error('JWT 토큰 형식이 올바르지 않습니다:', token);
            localStorage.removeItem('accessToken');
            return null;
        }
        
        const base64Url = parts[1];
        if (!base64Url) {
            console.error('JWT payload가 없습니다.');
            localStorage.removeItem('accessToken');
            return null;
        }
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const parsed = JSON.parse(jsonPayload);
        console.log('JWT 파싱 결과:', parsed);
        
        // userId를 id로 매핑하여 일관성 유지
        if (parsed.userId && !parsed.id) {
            parsed.id = parsed.userId;
        }
        
        return parsed;
    } catch (e) {
        console.error('JWT 파싱 오류:', e);
        console.error('토큰 값:', token);
        // 잘못된 토큰 제거
        localStorage.removeItem('accessToken');
        return null;
    }
}

// 로그인 상태 확인
export function isLoggedIn() {
    const token = localStorage.getItem('accessToken');
    console.log('현재 JWT 토큰:', token ? '존재함' : '없음');
    
    if (!token) return false;
    
    const user = parseJwt(token);
    if (!user) return false;
    
    // 토큰 만료 확인 (exp가 있는 경우)
    if (user.exp && user.exp * 1000 < Date.now()) {
        console.log('JWT 토큰 만료됨');
        localStorage.removeItem('accessToken');
        return false;
    }
    
    console.log('로그인 상태: true, 사용자 ID:', user.id);
    return true;
}

// 현재 사용자 정보 가져오기
export function getCurrentUser() {
    const token = localStorage.getItem('accessToken');

    if (!token) return null;
    
    return parseJwt(token);
}

// 로그아웃
export function logout() {
    localStorage.removeItem('accessToken');

    window.location.href = '/';
}

// localStorage 클리어 (디버깅용)
export function clearAuth() {
    localStorage.removeItem('accessToken');
    console.log('인증 정보 클리어 완료');
} 