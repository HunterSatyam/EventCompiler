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
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
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
        <div className='flex items-center justify-center h-screen bg-gray-50 from-gray-50 to-gray-100 overflow-hidden'>
            <div className='w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-2xl p-6 backdrop-blur-sm bg-opacity-90 transition-all duration-300 hover:shadow-3xl'>
                <div className='mb-4 text-center'>
                    <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>
                        Create Account
                    </h1>
                    <p className='text-sm text-gray-500 mt-2'>
                        Join us to find your dream job
                    </p>
                </div>

                <form onSubmit={submitHandler} className='space-y-3'>
                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium text-xs">Full Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter your Name"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            className="h-8 text-sm focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium text-xs">Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your Email Id"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            className="h-8 text-sm focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium text-xs">Phone Number</Label>
                        <Input
                            type="text"
                            placeholder="Enter your Phone Number"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            className="h-8 text-sm focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium text-xs">Password</Label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            className="h-8 text-sm focus:ring-[#6A38C2] focus:border-[#6A38C2]"
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <RadioGroup value={input.role} onValueChange={(value) => setInput({ ...input, role: value })} className="flex items-center gap-4 my-1">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="r1" className="text-[#6A38C2] border-[#6A38C2] h-3 w-3" />
                                <Label htmlFor="r1" className="cursor-pointer text-sm">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recruiter" id="r2" className="text-[#6A38C2] border-[#6A38C2] h-3 w-3" />
                                <Label htmlFor="r2" className="cursor-pointer text-sm">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className='space-y-1'>
                        <Label className="text-gray-700 font-medium text-xs">Profile</Label>
                        <Input
                            accept="image/*"
                            type="file"
                            onChange={changeFileHandler}
                            className="h-8 text-xs cursor-pointer file:text-xs file:text-[#6A38C2] file:hover:text-white file:bg-gray-50 file:hover:bg-[#6A38C2] file:border-0 file:mr-2 file:py-1 file:px-2 file:rounded-full file:transition-colors"
                        />
                    </div>

                    <Button type="submit" className="w-full h-9 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold py-1.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mt-2 text-sm">
                        {loading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : 'Signup'}
                    </Button>

                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-google text-xl text-[#DB4437] hover:drop-shadow-lg"></i>
                        </a>
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-linkedin text-xl text-[#0077B5] hover:drop-shadow-lg"></i>
                        </a>
                        <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                            <i className="fa-brands fa-github text-xl text-[#333] hover:drop-shadow-lg"></i>
                        </a>
                    </div>

                    <div className='text-center mt-2'>
                        <span className='text-xs text-gray-600'>
                            Already have an account? <Link to="/login" className='text-[#6A38C2] font-semibold hover:underline'>Login</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
