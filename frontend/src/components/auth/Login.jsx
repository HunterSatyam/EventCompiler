import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className='min-h-screen bg-white flex'>
            {/* Left Side - Hero Section */}
            <div className='hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] -ml-20 -mb-20'></div>

                <div className='relative z-10'>
                    <div className='flex items-center gap-2 text-2xl font-bold tracking-tighter'>
                        <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center'>
                            <span className='text-black text-xl font-black'>C</span>
                        </div>
                        CareerCompass
                    </div>
                </div>

                <div className='relative z-10'>
                    <h1 className='text-6xl font-black tracking-tight mb-6 leading-tight'>
                        Welcome back to the <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'>future</span> of hiring.
                    </h1>
                    <p className='text-gray-400 text-lg max-w-md'>
                        Connect with top talent and discover opportunities that shape your career journey.
                    </p>
                </div>

                <div className='relative z-10 text-sm text-gray-500 font-medium'>
                    © 2026 CareerCompass Inc.
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFCFE]'>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='w-full max-w-md space-y-8'
                >
                    <div className='text-center lg:text-left'>
                        <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Sign in to account</h2>
                        <p className='text-gray-500 mt-2 font-medium'>Please enter your details to continue</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-5'>
                            <div className='space-y-2'>
                                <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</Label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-300' />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="Enter your Valid Email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        className="pl-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</Label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-300' />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        className="pl-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div
                                    className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${input.role === 'student' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    onClick={() => setInput({ ...input, role: 'student' })}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${input.role === 'student' ? 'border-purple-600' : 'border-gray-300'}`}>
                                        {input.role === 'student' && <div className='w-2.5 h-2.5 rounded-full bg-purple-600' />}
                                    </div>
                                    <span className={`font-bold ${input.role === 'student' ? 'text-purple-700' : 'text-gray-600'}`}>Student</span>
                                </div>
                                <div
                                    className={`cursor-pointer border p-4 rounded-xl flex items-center gap-3 transition-all ${input.role === 'recruiter' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    onClick={() => setInput({ ...input, role: 'recruiter' })}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${input.role === 'recruiter' ? 'border-purple-600' : 'border-gray-300'}`}>
                                        {input.role === 'recruiter' && <div className='w-2.5 h-2.5 rounded-full bg-purple-600' />}
                                    </div>
                                    <span className={`font-bold ${input.role === 'recruiter' ? 'text-purple-700' : 'text-gray-600'}`}>Recruiter</span>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-900 text-white font-black rounded-xl text-md transition-all transform active:scale-95 shadow-xl hover:shadow-2xl">
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                    <span>Authenticating...</span>
                                </div>
                            ) : 'Sign In'}
                        </Button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#FDFCFE] px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href={`${USER_API_END_POINT}/auth/google`} className="flex-1 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all">
                                <i className="fa-brands fa-google text-xl text-[#DB4437]"></i>
                            </a>
                            <a href={`${USER_API_END_POINT}/auth/linkedin`} className="flex-1 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all">
                                <i className="fa-brands fa-linkedin text-xl text-[#0077B5]"></i>
                            </a>
                            <a href={`${USER_API_END_POINT}/auth/github`} className="flex-1 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-200 transition-all">
                                <i className="fa-brands fa-github text-xl text-[#333]"></i>
                            </a>
                        </div>

                        <p className='text-center text-sm font-medium text-gray-500'>
                            Don't have an account? <Link to="/signup" className='text-purple-600 hover:text-purple-700 font-black hover:underline'>Create Account</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
