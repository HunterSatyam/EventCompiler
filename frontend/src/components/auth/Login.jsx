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
import { Loader2 } from 'lucide-react'

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
        <div className='flex items-center justify-center min-h-screen bg-gray-50 from-gray-50 to-gray-100'>
            <div className='w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90 transition-all duration-300 hover:shadow-3xl'>
                <div className='mb-6 text-center'>
                    <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>
                        Welcome Back
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Enter your details to access your account
                    </p>
                </div>

                <form onSubmit={submitHandler} className='space-y-4'>
                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your Email Id"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium">Password</Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="flex items-center gap-4 my-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="r1" className="text-[#6A38C2] border-[#6A38C2]" />
                                <Label htmlFor="r1" className="cursor-pointer">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recruiter" id="r2" className="text-[#6A38C2] border-[#6A38C2]" />
                                <Label htmlFor="r2" className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mt-4">
                        {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Login'}
                    </Button>

                    <div className="flex justify-center gap-6 mt-6">
                        <a href={`${USER_API_END_POINT}/auth/google`} className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-google text-2xl text-[#DB4437] hover:drop-shadow-lg"></i>
                        </a>
                        <a href={`${USER_API_END_POINT}/auth/linkedin`} className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-linkedin text-2xl text-[#0077B5] hover:drop-shadow-lg"></i>
                        </a>
                        <a href={`${USER_API_END_POINT}/auth/github`} className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-github text-2xl text-[#333] hover:drop-shadow-lg"></i>
                        </a>
                    </div>

                    <div className='text-center mt-4'>
                        <span className='text-sm text-gray-600'>
                            Don't have an account? <Link to="/signup" className='text-[#6A38C2] font-semibold hover:underline'>Signup</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
