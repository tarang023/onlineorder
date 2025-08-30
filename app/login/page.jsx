"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, CheckCircle, Shield, Star, Sparkles, X } from "lucide-react"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import crypto from "crypto"
import { motion, AnimatePresence } from "framer-motion"
const SECRET_KEY = process.env.NEXT_PUBLIC_ROLE_KEY

const hashRole = (role, salt) => {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(role + salt)
    .digest("hex")
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [currentUserData, setCurrentUserData] = useState(null)
  const [currentEmail, setCurrentEmail] = useState("") // Add this to store the email for OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""])
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otpError, setOtpError] = useState("")
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [otpAttempts, setOtpAttempts] = useState(0)

  const features = [
    { icon: CheckCircle, text: "AI-Powered Interview Practice", description: "Practice with real interview questions" },
    { icon: Shield, text: "Secure & Private Platform", description: "Your data is safe and encrypted" },
    { icon: Star, text: "Personalized Feedback", description: "Get detailed insights on your performance" },
    { icon: Zap, text: "Instant Results", description: "Immediate feedback and scoring" },
  ]

  const publicDomains =[
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "mail.com",
    "gmx.com",
    "protonmail.com",
    "zoho.com",
    "msn.com"
  ]

  function isPublicEmail(email) {
    if (!email) return false
    const domain = email.split("@")[1]
    return !publicDomains.includes(domain.toLowerCase())
  }

  // Function to mask email
  const maskEmail = (email) => {
    if (!email) return ""
    const [username, domain] = email.split("@")
    if (username.length <= 2) {
      return `${username[0]}*****@${domain}`
    }
    const maskedUsername = username[0] + "*".repeat(Math.min(5, username.length - 2)) + username.slice(-1)
    return `${maskedUsername}@${domain}`
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // OTP input handling
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otpCode]
    newOtp[index] = value.slice(-1) // Only take the last character
    setOtpCode(newOtp)
    setOtpError("")

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      setTimeout(() => handleVerifyOtp(newOtp.join("")), 100)
    }
  }

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
        const newOtp = [...otpCode]
        newOtp[index - 1] = ""
        setOtpCode(newOtp)
      }
    }
  }

  // Paste handling for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtpCode(newOtp)
      setOtpError("")
      setTimeout(() => handleVerifyOtp(pastedData), 100)
    }
  }

  const storeData = async (data) => {
    localStorage.setItem("user", JSON.stringify(data))
    const salt = crypto.randomBytes(16).toString("hex")
    const hashedRole = await hashRole("user", salt)
    Cookies.remove("salt")
    Cookies.remove("role")
    Cookies.set("salt", salt, { expires: 7 }) // Set salt cookie for 7 days
    Cookies.set("role", hashedRole, { expires: 7 }) // Set role cookie for 7 days
  }

  // Verify OTP - now uses currentEmail instead of formData.email
  const handleVerifyOtp = async (code = otpCode.join("")) => {
    if (code.length !== 6) {
      setOtpError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifyingOtp(true)
    setOtpError("")

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentEmail, // Use currentEmail instead of formData.email
          otp: code,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsOtpVerified(true)
        toast.success("Email verified successfully!")
        storeData(currentUserData)
        setTimeout(() => {
          setOtpModalOpen(false)
          router.push("/")
        }, 500)
      } else {
        setOtpError("Invalid verification code. Please try again.")
        // Clear OTP inputs on error
        setOtpCode(["", "", "", "", "", ""])
        const firstInput = document.getElementById("otp-0")
        if (firstInput) firstInput.focus()
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setOtpError("Network error. Please check your connection and try again.")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Resend OTP - now uses currentEmail instead of formData.email
  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    if (otpAttempts > 2) {
      toast.error("You have exceeded the maximum number of OTP attempts. Please try again later.")
      return
    }
    setIsResendingOtp(true)
    setOtpError("")
    setOtpAttempts(otpAttempts + 1)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentEmail, // Use currentEmail instead of formData.email
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Verification code sent successfully!")
        setResendTimer(60) // Start 60-second countdown
        setOtpCode(["", "", "", "", "", ""]) // Clear previous OTP
        const firstInput = document.getElementById("otp-0")
        if (firstInput) firstInput.focus()
      } else {
        toast.error(data.error || "Failed to resend code. Please try again.")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsResendingOtp(false)
    }
  }

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Modified sendOtp to accept email parameter
  const sendOtp = async (email) => {
    setIsSendingOtp(true)
    setOtpAttempts(otpAttempts + 1)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Use the passed email parameter
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("OTP sent successfully!")
        setOtpModalOpen(true)
        setResendTimer(60) // Start initial timer
        setTimeout(() => {
          const firstInput = document.getElementById("otp-0")
          if (firstInput) firstInput.focus()
        }, 100)
      } else {
        toast.error(data.error || "Failed to send OTP. Please try again.")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    if (isSignUp) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all the fields")
        setIsLoading(false)
        return
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address")
        setIsLoading(false)
        return
      }
      if( isPublicEmail(formData.email)) {
        toast.error("Please use only common email domains like gmail, yahoo, etc.")        
        setIsLoading(false)
        return  
      }
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long")
        setIsLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          // Store the email BEFORE clearing the form
          setCurrentEmail(formData.email)
          setCurrentUserData(data)

          // Send OTP with the current email
          await sendOtp(formData.email)

          // Clear form AFTER OTP is sent
          setFormData({ name: "", email: "", password: "", confirmPassword: "" })
          setIsSignUp(false)
          toast.success("Account created successfully! Please verify your email.")
        } else {
          toast.error(data.error || "Something went wrong")
        }
      } catch (error) {
        console.error("Error during signup:", error)
        toast.error("An error occurred while creating your account. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else {
      if (!formData.email || !formData.password) {
        toast.error("Please fill all the fields")
        setIsLoading(false)
        return
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address")
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data))
          const salt = crypto.randomBytes(16).toString("hex")
          Cookies.remove("salt")
          Cookies.remove("role")
          const hashedRole = await hashRole("user", salt)
          Cookies.set("salt", salt, { expires: 7 }) // Set salt cookie for 7 days
          Cookies.set("role", hashedRole, { expires: 7 }) // Set role cookie for 7 days
          router.push("/")
          toast.success("Logged in successfully!")
        } else if (res.status === 403) {
          // Store email for OTP verification
          setCurrentEmail(formData.email)
          setOtpModalOpen(true)
          setResendTimer(60) // Start initial timer
          await sendOtp(formData.email)
        } else {
          const data = await res.json()
          toast.error(data.error || "Something went wrong")
        }
      } catch (error) {
        console.error("Error during login:", error)
        toast.error("An error occurred while logging in. Please try again.")
      }
    }

    setIsLoading(false)
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const closeOtpModal = () => {
    setOtpModalOpen(false)
    setOtpCode(["", "", "", "", "", ""])
    setOtpError("")
    setIsOtpVerified(false)
    setResendTimer(0)
    setCurrentEmail("") // Clear the stored email
  }

  return (
    <>
  <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
    {/* Animated Background */}
    <div className="absolute inset-0 z-0">
        <div
            className="absolute w-96 h-96 bg-gradient-radial from-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
            style={{ left: mousePosition.x - 192, top: mousePosition.y - 192 }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>

    <div className="relative z-10 w-full max-w-7xl mx-auto flex min-h-screen">
        {/* Left Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                >
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
                        <p className="text-gray-400">
                            {isSignUp ? "Join to master your interviews." : "Sign in to continue your journey."}
                        </p>
                    </div>

                    {/* The form tag is removed to match your original structure, assuming handleSubmit is called by the button's onClick */}
                    <div className="space-y-5">
                        <AnimatePresence>
                            {isSignUp && (
                                <motion.div
                                    key="name-field"
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                            required={isSignUp}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}
                                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        
                        <AnimatePresence>
                        {isSignUp && (
                             <motion.div
                                key="confirm-password-field"
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        required={isSignUp}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                         {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                        
                        <button
                            onClick={handleSubmit} disabled={isLoading}
                            className="w-full group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-400/30 transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                            <span className="relative flex items-center justify-center space-x-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black/50 border-t-black rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                    
                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button onClick={toggleAuthMode} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline">
                                {isSignUp ? "Sign In" : "Sign Up"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Right Side - Design & Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="w-full max-w-md space-y-10"
            >
                <div className="text-left space-y-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                        <Zap className="w-9 h-9 text-black" />
                    </div>
                    <h2 className="text-5xl font-bold text-white leading-tight">Land Your Dream Job.</h2>
                    <p className="text-xl text-gray-400">Practice, get feedback, and gain the confidence to ace any interview.</p>
                </div>

                <div className="space-y-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 mt-1">
                                <feature.icon className="w-6 h-6 text-purple-300" />
                            </div>
                            <div>
                                <h4 className="text-white font-semibold">{feature.text}</h4>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
    
    {/* Email Verification Modal */}
    <AnimatePresence>
    {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isVerifyingOtp ? closeOtpModal : undefined}
            />
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: 'easeIn' } },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-gray-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl max-w-md w-full mx-4"
            >
                 {!isVerifyingOtp && !isOtpVerified && (
                    <button onClick={closeOtpModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                 )}
                 {isOtpVerified ? (
                   <div className="text-center">
                       <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1}}
                            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30"
                        >
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-gray-400 mb-4">Your account has been successfully verified.</p>
                         <div className="flex items-center justify-center space-x-2 text-green-400">
                             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                             <span className="text-sm">Redirecting to dashboard...</span>
                         </div>
                    </div>
                 ) : (
                   <>
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                        <p className="text-gray-400">Enter the 6-digit code sent to <br/><span className="font-medium text-white">{maskEmail(currentEmail)}</span></p>
                    </div>
                    <div className="flex justify-center space-x-2 mb-4">
                        {otpCode.map((digit, index) => (
                            <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength="1" value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                disabled={isVerifyingOtp}
                                className={`w-12 h-14 text-center text-xl font-bold bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all ${otpError ? "border-red-500/50 bg-red-500/10" : "border-white/20"} ${isVerifyingOtp ? "opacity-50 cursor-not-allowed" : ""}`}
                            />
                        ))}
                    </div>
                    {otpError && <p className="text-center text-red-400 text-sm mb-4">{otpError}</p>}
                    <button onClick={() => handleVerifyOtp()} disabled={isVerifyingOtp || otpCode.some((d) => d === "")}
                        className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center space-x-2 disabled:transform-none transform hover:scale-105">
                         {isVerifyingOtp ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Verify Code</span>
                        )}
                    </button>
                    <div className="text-center mt-6">
                        {resendTimer > 0 ? (
                           <p className="text-gray-400 text-sm">Resend available in {formatTimer(resendTimer)}</p>
                        ) : (
                            <button onClick={handleResendOtp} disabled={isResendingOtp} className="text-purple-400 text-sm hover:underline disabled:opacity-50">
                                {isResendingOtp ? "Sending..." : "Didn't receive code? Resend"}
                            </button>
                        )}
                    </div>
                   </>
                 )}
            </motion.div>
        </div>
    )}
    </AnimatePresence>
  </div>
</>
  )
}