
import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t border-t-gray-200 py-8 mt-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Career<span className="text-[#F83002]">Compass</span></h2>
                        <p className="text-sm text-gray-500">© 2026 CareerCompass. All rights reserved.</p>
                    </div>
                    <div className="flex gap-4">
                        <h2 className="font-medium text-gray-800">Follow us</h2>
                        <i className="fa-brands fa-facebook text-xl text-gray-600 hover:text-[#21BCFF] cursor-pointer transition-colors"></i>
                        <i className="fa-brands fa-twitter text-xl text-gray-600 hover:text-[#21BCFF] cursor-pointer transition-colors"></i>
                        <i className="fa-brands fa-linkedin text-xl text-gray-600 hover:text-[#21BCFF] cursor-pointer transition-colors"></i>
                        <i className="fa-brands fa-instagram text-xl text-gray-600 hover:text-[#21BCFF] cursor-pointer transition-colors"></i>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
