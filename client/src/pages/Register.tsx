import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";
import { register } from "../api/api";
 
export default function Register(){
    const [errorText, setErrorText] = useState<string>("");

    const validateForm = (username:string, email:string, password:string, confirmPassword:string) => {
        if (!username || !email || !password || !confirmPassword) {
            setErrorText("All fields are required");
            return false;
        }
        if (password !== confirmPassword) {
            setErrorText("Passwords do not match");
            return false;
        }
        if (password.length < 4 ) {
            setErrorText("Password must be at least 6 characters long");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorText("Email is not valid");
            return false;
        }
        return true;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = (e.target as HTMLFormElement).email.value;
        const username = (e.target as HTMLFormElement).username.value;
        const password = (e.target as HTMLFormElement).password.value;
        const confirmPassword = (e.target as HTMLFormElement).confirmPassword.value
        setErrorText("");
        // Validate the form data
        const isValid = validateForm(username, email, password, confirmPassword);
        if (isValid) {
            try {
                const response = await register(username, email, password);
                const token = response.data.token;
                localStorage.setItem("token", token);
            } catch (error: any) {
                if (error.response) {
                    setErrorText(error.response.data.error || 'Registration failed');
                } else if (error.request) {
                    setErrorText('Network error - please try again later');
                } else {
                    setErrorText('An unexpected error occurred');
                }
                console.error('Registration error:', error);
            }
        }
    }
    return(
        <>
            <AnimatePresence>
                <motion.div className="flex flex-col items-center justify-center min-h-screen bg-background">
                    <motion.div className="bg-secondary-bg p-6 rounded shadow-md sm:w-96 w-11/12">
                        <motion.form className="" onSubmit={handleSubmit}>
                            <motion.h2 
                                className="text-3xl font-bold mb-4 text-center cursor-default"
                                whileHover={{ scale: 1.1 , color: "#3b82f6" }}
                                initial = {{opacity:0,y:-20}}
                                animate = {{opacity:1,y:0}}
                                transition={{duration:0.3}}
                            >Register</motion.h2>
                            <motion.div className="mb-4" 
                                initial = {{opacity:0,x:-20}}
                                animate = {{opacity:1,x:0}}
                                transition={{duration:0.5}}
                            >
                                <motion.label htmlFor="email" whileHover={{color:"#3b82f6"}} className="block text-sm font-medium">Email</motion.label>
                                <motion.input whileFocus={{scale:1.01}} autoComplete="off" type="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"/>
                            </motion.div>
                            <motion.div className="mb-4"
                                initial = {{opacity:0,x:20}}
                                animate = {{opacity:1,x:0}}
                                transition={{duration:0.5}}
                            >
                                <motion.label htmlFor="username" whileHover={{color:"#3b82f6"}} className="block text-sm font-medium">Username</motion.label>
                                <motion.input whileFocus={{scale:1.01}} autoComplete="off" type="text" id="username" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"/>
                            </motion.div>
                            <motion.div className="mb-4"
                                initial = {{opacity:0,x:-20}}
                                animate = {{opacity:1,x:0}}
                                transition={{duration:0.5}}
                            >
                                <motion.label htmlFor="password" whileHover={{color:"#3b82f6"}} className="block text-sm font-medium">Password</motion.label>
                                <motion.input whileFocus={{scale:1.01}} autoComplete="off" type="password" id="password"  className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"/>
                            </motion.div>
                            <motion.div className="mb-4"
                                initial = {{opacity:0,x:20}}
                                animate = {{opacity:1,x:0}}
                                transition={{duration:0.5}}
                            >
                                <motion.label htmlFor="confirmPassword" whileHover={{color:"#3b82f6"}} className="block text-sm font-medium">Confirm Password</motion.label>
                                <motion.input whileFocus={{scale:1.01}} autoComplete="off" type="password" id="confirmPassword" className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-secondary focus:ring-2 focus:border-0 cursor-pointer"/>
                            </motion.div>
                            <div className="mb-4">
                                <p className="text-red-600 font-bold text-center">{errorText}</p>
                            </div>
                            <motion.button 
                                key="register-button"
                                type="submit" 
                                className="w-full bg-secondary text-white p-2 rounded outline-none cursor-pointer"
                                initial={{opacity:0,y:20}}
                                animate={{opacity:1,y:0}}
                                transition={{duration:0.5,type:"spring" ,stiffness:150}}
                                whileTap={{scale:0.95,}}
                                whileHover={{scale:1.01}}
                            >Register</motion.button>
                        </motion.form>
                    </motion.div>  
                    <p className="mt-4 text-sm ">Already have an account? <a href="/login" className="text-secondary hover:underline">Login</a></p>
                </motion.div>
            </AnimatePresence>
        </>
    )
}