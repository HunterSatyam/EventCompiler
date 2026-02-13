import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Events",
        array: ["Jobs", "Internships", "Hackathons", "Webinars", "Certification Program"]
    },
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <div className='w-full bg-white bg-opacity-90 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-100/50 sticky top-20 transition-all duration-300 hover:shadow-xl'>
            <div className='flex items-center justify-between mb-4'>
                <h1 className='text-xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600'>Filter Jobs</h1>
            </div>

            <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-6">
                {
                    fitlerData.map((data, index) => (
                        <div key={index} className='space-y-3'>
                            <h2 className='text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2'>{data.fitlerType}</h2>
                            <div className='space-y-2'>
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200'>
                                                <RadioGroupItem value={item} id={itemId} className="text-[#6A38C2] border-gray-300 group-hover:border-[#6A38C2] transition-colors" />
                                                <Label htmlFor={itemId} className="text-gray-600 group-hover:text-gray-900 cursor-pointer font-medium">{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard
