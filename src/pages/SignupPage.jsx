import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const commonStyles = {
    card: 'bg-white p-8 rounded-xl shadow-xl w-full max-w-md transition-all duration-300 shadow-gray-300',
    input: 'w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-colors duration-200',
    otpInput: 'w-full px-4 py-3 border border-gray-500 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-colors duration-200',
    buttonPrimary: 'w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] bg-gray-800 hover:bg-gray-700',
    error: 'bg-gray-200 text-gray-800 p-3 rounded-lg text-sm text-center border border-gray-400',
    success: 'bg-gray-100 text-gray-700 p-3 rounded-lg text-sm text-center border border-gray-300',
};

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all user credential fields first.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/signup`,
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess(`Verification code sent to ${formData.email}. Enter the code to complete signup.`);
                setIsCodeSent(true);
            } else {
                setError(response.data?.detail || 'Failed to send verification code.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Network error or server not reachable.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSignup = async (e) => {
        e.preventDefault();
        if (!isCodeSent) {
            setError('Please send verification code first.');
            return;
        }
        if (!code) {
            setError('Please enter the verification code.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/verify`,
                { email: formData.email, code },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 && response.data.ok) {
                setSuccess('Email verified successfully! Redirecting to dashboard...');
                setTimeout(() => navigate('/DashboardPage'), 1000); // ✅ correct redirect
            } else {
                setError(response.data?.detail || 'Verification failed.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Network error or server not reachable.');
        } finally {
            setLoading(false);
        }
    };

    const sendCodeButtonStyle =
        'w-1/2 py-3 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]';

    return (
        <div className="w-full flex justify-center items-center">
            <div className={commonStyles.card}>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">VVAIRS</h2>

                {error && <p className={`${commonStyles.error} mb-4`}>{error}</p>}
                {success && <p className={`${commonStyles.success} mb-4`}>{success}</p>}

                <form onSubmit={handleFinalSignup} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className={commonStyles.input}
                        disabled={isCodeSent}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className={commonStyles.input}
                        disabled={isCodeSent}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={commonStyles.input}
                        disabled={isCodeSent}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter Password"
                        className={commonStyles.input}
                        disabled={isCodeSent}
                        required
                    />

                    <div className="flex items-center space-x-3 pt-2">
                        <input
                            type="text"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter OTP Code"
                            className={`${commonStyles.otpInput} w-1/2 text-gray-700`}
                            maxLength="6"
                            disabled={!isCodeSent}
                            required
                        />
                        <button
                            type="button"
                            onClick={handleSendCode}
                            className={`${sendCodeButtonStyle} ${isCodeSent
                                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                            disabled={loading || isCodeSent}
                        >
                            {loading
                                ? isCodeSent
                                    ? 'Resending...'
                                    : 'Sending...'
                                : isCodeSent
                                    ? 'Code Sent'
                                    : 'Send Code'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className={`${commonStyles.buttonPrimary} mt-6`}
                        disabled={loading || !isCodeSent}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
