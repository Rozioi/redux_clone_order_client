import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api.service';
import styles from '../../assets/Login.module.scss';
import axios from 'axios';
import { API_URL } from '../../config';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await ApiService.login(email, password);

            if (res.status === 'verification_required') {
                setShowVerification(true);
                setPendingEmail(res.user.email);
                setIsAdmin(res.user.role === 'admin');
            } else {
                localStorage.setItem('token', res.token);
                login(res.user, res.token);
                navigate('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        try {
            const { data } = await axios.post(`${API_URL}/admin/verify`, {
                email: pendingEmail, 
                code: verificationCode
            });
    
            localStorage.setItem('token', data.token);
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка подтверждения');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <h1>{showVerification ? 'Подтверждение входа' : 'Вход в систему'}</h1>
                {error && <div className={styles.error}>{error}</div>}

                {!showVerification ? (
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <p>Код отправлен на <strong>{pendingEmail}</strong>. Введите его ниже.</p>
                        <div className={styles.formGroup}>
                            <label htmlFor="code">Код подтверждения</label>
                            <input
                                type="text"
                                id="code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Проверка...' : 'Подтвердить'}
                        </button>
                    </form>
                )}

                {!showVerification && (
                    <div className={styles.links}>
                        <a href="/register">Зарегистрироваться</a>
                        <a href="/forgot-password">Забыли пароль?</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
