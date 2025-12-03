import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { ArrowRight, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to send reset email');
            }

            setEmailSent(true);
            toast.success('Password reset link sent to your email!');
        } catch (err) {
            console.error('Forgot password error:', err);
            const errorMessage = err.message || 'Failed to send reset link. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-900/40 to-purple-900/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2080&auto=format&fit=crop"
                    alt="Abstract security"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 m-auto text-center px-12">
                    <h2 className="text-4xl font-bold text-white mb-6">Password Reset</h2>
                    <p className="text-gray-300 text-lg max-w-md mx-auto">
                        Don't worry! It happens. Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <p onClick={() => navigate('/')} className="cursor-pointer inline-block text-4xl font-bold text-gray-900 mb-2">MindTrace</p>

                        {!emailSent ? (
                            <>
                                <h1 className="text-3xl font-bold text-gray-900 mt-4">Forgot Password?</h1>
                                <p className="text-gray-600 mt-2">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center lg:justify-start mt-4">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mt-4">Check Your Email</h1>
                                <p className="text-gray-600 mt-2">
                                    We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>. Click the link in the email to reset your password.
                                </p>
                            </>
                        )}
                    </div>

                    {!emailSent ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 hover:shadow-xl relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <div className="flex items-center justify-center">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-8 space-y-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <p className="text-sm text-gray-600">
                                    <strong>Didn't receive the email?</strong> Check your spam folder or{' '}
                                    <button
                                        onClick={() => setEmailSent(false)}
                                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                                    >
                                        try another email address
                                    </button>
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
