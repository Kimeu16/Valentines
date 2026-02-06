import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart, Sparkles, Camera, Video, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

const VIVIAN_NAME = "Vivian Nyambura"

export default function App() {
  const [step, setStep] = useState(1)
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [isNoButtonEscaping, setIsNoButtonEscaping] = useState(false)
  const [showStatusVersion, setShowStatusVersion] = useState(false)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [currentReason, setCurrentReason] = useState(0)
  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  // Generate sparkles on mount
  useState(() => {
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }))
    setSparkles(newSparkles)
  })

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000
    const colors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#FFE4E1', '#FFFFFF', '#FFD700']

      ; (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }())
  }

  const handleNoButtonHover = () => {
    if (step === 5) {
      // Keep within 80% of viewport to avoid edges
      const margin = 100;
      const xRange = window.innerWidth - margin * 2;
      const yRange = window.innerHeight - margin * 2;

      const newX = (Math.random() * xRange) - (window.innerWidth / 2) + margin;
      const newY = (Math.random() * yRange) - (window.innerHeight / 2) + margin;

      setNoButtonPos({ x: newX, y: newY });
      setIsNoButtonEscaping(true);
    }
  }

  const nextStep = () => {
    if (step < 6) setStep(step + 1)
    if (step === 5) triggerConfetti()
  }

  return (
    <div className="min-h-screen bg-v-gradient overflow-hidden relative font-poppins selection:bg-pink-200">
      {/* Sparkle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => {
          const sparkleColors = ['text-white', 'text-pink-200', 'text-pink-300', 'text-yellow-200', 'text-rose-200'];
          const color = sparkleColors[sparkle.id % sparkleColors.length];

          return (
            <motion.div
              key={sparkle.id}
              className="absolute"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut"
              }}
            >
              <Sparkles className={color} size={8 + Math.random() * 8} />
            </motion.div>
          );
        })}
      </div>

      {/* Background Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const colors = [
            { fill: "#FF69B4", className: "text-pink-400" },      // Hot pink
            { fill: "#FFB6C1", className: "text-pink-300" },      // Light pink
            { fill: "#FF1493", className: "text-pink-500" },      // Deep pink
            { fill: "#FF69B4", className: "text-pink-400" },      // Hot pink
            { fill: "#FFC0CB", className: "text-pink-200" },      // Pink
            { fill: "#FFB6C1", className: "text-pink-300" },      // Light pink
          ];
          const color = colors[i % colors.length];

          return (
            <motion.div
              key={i}
              className="absolute select-none"
              style={{
                left: `${Math.random() * 100}%`,
                filter: `drop-shadow(0 0 8px ${color.fill}99)`
              }}
              initial={{ top: '100%', opacity: 0, scale: 0 }}
              animate={{
                top: '-10%',
                opacity: [0, 0.8, 0.6, 0],
                scale: [0, 1, 1.2, 0.8],
                x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
                rotate: 360
              }}
              transition={{
                duration: 8 + Math.random() * 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
            >
              <Heart
                size={12 + Math.random() * 20}
                fill={color.fill}
                className={color.className}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      {step <= 4 && (
        <motion.div
          className="fixed top-0 left-0 right-0 p-6 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-md mx-auto space-y-3 bg-white/30 backdrop-blur-md rounded-3xl p-4 border border-pink-200/50 shadow-lg">
            <div className="flex justify-between text-sm text-pink-600 font-semibold px-2">
              <span className="flex items-center gap-2">
                <Heart size={16} fill="currentColor" className="animate-pulse" />
                Love Meter
              </span>
              <span className="text-glow">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <Progress
                value={progress}
                className="h-3 bg-gradient-to-r from-pink-100/80 to-rose-100/80 shadow-inner"
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, rgba(255,105,180,0.3) 0%, rgba(255,182,193,0.3) ${progress}%, transparent ${progress}%)`,
                  filter: 'blur(8px)'
                }}
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-none rounded-[40px] overflow-hidden shadow-2xl">
                <CardContent className="pt-12 pb-12 px-6 sm:px-10 text-center space-y-10 relative">
                  {/* Decorative Corner Hearts */}
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Heart className="text-pink-300 fill-pink-300" size={24} />
                  </motion.div>
                  <motion.div
                    className="absolute top-4 left-4"
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    <Sparkles className="text-pink-300" size={24} />
                  </motion.div>

                  <div className="flex justify-center relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <Heart className="text-pink-500 fill-pink-500" size={80} />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Heart className="text-pink-400 fill-pink-400" size={80} />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-dancing text-pink-600 font-bold leading-relaxed text-glow">
                      Hey <span className="relative inline-block">
                        <span className="relative z-10 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                          {VIVIAN_NAME}
                        </span>
                        <motion.span
                          className="absolute inset-0 bg-pink-200 rounded-lg -z-10"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </span>… 💕
                    </h1>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-pink-300 to-transparent rounded-full" />
                  </div>

                  <p className="text-pink-700 text-xl font-medium leading-relaxed">
                    Remember all that fun we had in <span className="text-pink-500 font-semibold">December</span>?<br />
                    Well, I have something special to ask you... 💫
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={nextStep}
                      className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white text-xl font-bold shadow-2xl shadow-pink-300/50 border-2 border-white/30 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        I'm Ready!
                        <Sparkles size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-none rounded-[40px] shadow-2xl">
                <CardContent className="pt-12 pb-12 px-6 sm:px-10 text-center space-y-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <p className="text-3xl font-dancing text-pink-600 font-bold text-glow">
                      First things first…
                    </p>
                    <div className="h-1 w-24 mx-auto mt-3 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <div className="absolute -top-6 -right-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="text-pink-300" size={32} />
                      </motion.div>
                    </div>
                    <h2 className="text-2xl text-pink-700 font-semibold leading-relaxed px-4">
                      Are you aware that you're the <span className="text-pink-500 font-bold">prettiest person</span> I've ever seen?
                    </h2>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-5 pt-4">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={nextStep}
                        className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 text-pink-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:border-pink-400 transition-all text-xl font-bold shadow-lg hover:shadow-xl hover:shadow-pink-200/50"
                      >
                        <span className="flex items-center gap-2">
                          Yes 💖
                          <Heart size={20} fill="currentColor" className="text-pink-500" />
                        </span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={nextStep}
                        className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 text-pink-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:border-pink-400 transition-all text-xl font-bold shadow-lg hover:shadow-xl hover:shadow-pink-200/50"
                      >
                        Highly likely 😌
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-none rounded-[40px] shadow-2xl">
                <CardContent className="pt-12 pb-12 px-6 sm:px-10 text-center space-y-10">
                  <motion.div
                    className="flex justify-center"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-8xl relative">
                      👩‍🍳
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="text-yellow-400" size={24} />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <p className="text-3xl font-dancing text-pink-600 font-bold text-glow">
                      Quick question…
                    </p>
                    <div className="h-1 w-24 mx-auto mt-3 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                  </motion.div>

                  <motion.h2
                    className="text-2xl text-pink-700 font-semibold leading-relaxed px-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Will you promise to keep cooking that <span className="text-pink-500 font-bold">delicious food</span> for me?
                  </motion.h2>

                  <div className="grid grid-cols-1 gap-5 pt-4">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={nextStep}
                        className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 text-pink-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:border-pink-400 transition-all text-xl font-bold shadow-lg hover:shadow-xl hover:shadow-pink-200/50"
                      >
                        Always! 👩‍🍳💕
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={nextStep}
                        className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 text-pink-600 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:border-pink-400 transition-all text-xl font-bold shadow-lg hover:shadow-xl hover:shadow-pink-200/50"
                      >
                        Only for you 🥰
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}\n\n          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card border-none rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-rose-100/20 pointer-events-none" />

                <CardContent className="pt-12 pb-12 px-6 sm:px-10 text-center space-y-8 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex justify-center"
                  >
                    <Heart className="text-pink-400 fill-pink-400" size={60} />
                  </motion.div>

                  <div className="space-y-4">
                    <p className="text-pink-600 text-lg font-semibold">Before I ask you something important...</p>
                    <h2 className="text-3xl font-dancing text-pink-600 font-bold text-glow">
                      Here's what makes you special to me 💕
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReason}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="min-h-[200px] flex items-center justify-center"
                    >
                      <div className="space-y-6">
                        {currentReason === 0 && (
                          <>
                            <div className="text-6xl">🎄</div>
                            <p className="text-2xl text-pink-700 font-semibold leading-relaxed px-4">
                              Those <span className="text-pink-500 font-bold">December holidays</span> we spent together...
                              <br />
                              <span className="text-xl text-pink-600">All that fun we had will forever be in my heart 💫</span>
                            </p>
                          </>
                        )}
                        {currentReason === 1 && (
                          <>
                            <div className="text-6xl">👩‍🍳</div>
                            <p className="text-2xl text-pink-700 font-semibold leading-relaxed px-4">
                              The way you <span className="text-pink-500 font-bold">cook for me</span>...
                              <br />
                              <span className="text-xl text-pink-600">Your food is always delicious and made with love 🍽️💕</span>
                            </p>
                          </>
                        )}
                        {currentReason === 2 && (
                          <>
                            <div className="text-6xl">💬</div>
                            <p className="text-2xl text-pink-700 font-semibold leading-relaxed px-4">
                              Our special way of saying goodbye...
                              <br />
                              <span className="text-xl text-pink-600">"I love you" → "I love you more" → <span className="text-pink-500 font-bold">"I love you most"</span> 🥰</span>
                            </p>
                          </>
                        )}
                        {currentReason === 3 && (
                          <>
                            <div className="text-6xl">😄</div>
                            <p className="text-2xl text-pink-700 font-semibold leading-relaxed px-4">
                              That <span className="text-pink-500 font-bold">playful biting</span> when we're chilling...
                              <br />
                              <span className="text-xl text-pink-600">I think you're addicted to it! It's your cute way of showing love 😂💕</span>
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex gap-4 justify-center pt-4">
                    {[0, 1, 2, 3].map((index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentReason(index)}
                        className={cn(
                          "w-4 h-4 rounded-full transition-all",
                          currentReason === index
                            ? "bg-pink-500 w-10"
                            : "bg-pink-300 hover:bg-pink-400"
                        )}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={nextStep}
                    className="btn-romantic w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:via-rose-500 hover:to-pink-600 text-white text-xl font-bold shadow-2xl shadow-pink-300/50 border-2 border-white/30 mt-6"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continue 💖
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md relative"
            >
              <Card className="glass-card border-none rounded-[40px] shadow-2xl relative overflow-hidden">
                {/* Romantic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-transparent to-rose-100/30 pointer-events-none" />

                <CardContent className="pt-14 pb-12 px-6 sm:px-10 text-center space-y-10 relative z-10">
                  {/* Floating Hearts Around Main Heart */}
                  <div className="relative flex justify-center">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
                          y: [0, Math.sin(i * 60 * Math.PI / 180) * 60],
                          opacity: [0, 0.6, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <Heart className="text-pink-400 fill-pink-400" size={20} />
                      </motion.div>
                    ))}

                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex justify-center relative z-10"
                    >
                      <Heart className="text-pink-500 fill-pink-500 drop-shadow-2xl" size={100} />
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Heart className="text-pink-400 fill-pink-400" size={100} />
                      </motion.div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="space-y-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-pink-600 text-xl font-semibold">
                      Then there's only one thing left to ask…
                    </p>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full" />
                    <h1 className="text-5xl font-dancing text-pink-600 font-bold leading-tight text-glow px-4">
                      <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                        {VIVIAN_NAME}
                      </span>,<br />
                      will you be my<br />
                      <span className="text-6xl">Valentine? 💘</span>
                    </h1>
                  </motion.div>

                  <div className="flex flex-col items-center gap-8 relative min-h-[140px] pt-6">
                    <motion.div
                      className="w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={nextStep}
                        className="btn-romantic w-full h-20 rounded-[28px] bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white text-2xl font-extrabold shadow-2xl border-4 border-white/40 relative overflow-hidden z-20"
                        style={{
                          animation: 'glow-pulse 2s ease-in-out infinite, rainbow-glow 3s ease-in-out infinite'
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <Heart size={28} fill="currentColor" className="animate-pulse" />
                          YES 💖
                          <Heart size={28} fill="currentColor" className="animate-pulse" />
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{
                            x: ['-200%', '200%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </Button>
                    </motion.div>

                    <motion.div
                      animate={isNoButtonEscaping ? {
                        x: noButtonPos.x,
                        y: noButtonPos.y,
                        rotate: Math.random() * 360
                      } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onHoverStart={handleNoButtonHover}
                      onTouchStart={handleNoButtonHover}
                      className="absolute bottom-0"
                    >
                      <Button
                        variant="ghost"
                        className="h-12 px-8 text-pink-400/60 hover:text-pink-500/60 hover:bg-transparent text-base font-medium"
                      >
                        No
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md h-[80vh] flex flex-col justify-center"
            >
              <Card className={cn(
                "glass-card border-none rounded-[40px] flex-grow flex flex-col items-center justify-center text-center p-6 sm:p-8 space-y-8 sm:space-y-12 transition-all duration-500",
                showStatusVersion && "bg-gradient-to-br from-pink-50/80 to-rose-100/80 scale-105"
              )}>
                <motion.div
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="space-y-4"
                >
                  <Sparkles className="text-pink-500 mx-auto" size={48} />
                  <h1 className="text-5xl font-dancing text-pink-600 font-bold">
                    She said YES 💖
                  </h1>
                </motion.div>

                <div className="space-y-6">
                  <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto flex items-center justify-center">
                    <Heart className="text-pink-500 fill-pink-500" size={48} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl text-pink-600 font-bold">{VIVIAN_NAME}</p>
                    <p className="text-pink-700/70 text-lg">is officially my Valentine 💕</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-dancing text-2xl text-pink-400 leading-none">Valentine's Day 2026</p>
                  <p className="text-pink-300 text-xs tracking-widest uppercase">💐 Forever 💐</p>
                </div>

                {!showStatusVersion && (
                  <div className="w-full space-y-4 pt-10">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-2xl border-pink-200 text-pink-500 hover:bg-pink-50 group h-12"
                          onClick={() => alert("Screenshot this beautiful moment! 💕")}
                        >
                          <Camera className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                          Post
                        </Button>
                        <p className="text-[10px] text-pink-400">Screenshot & Post</p>
                      </div>
                      <div className="space-y-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-2xl border-pink-200 text-pink-500 hover:bg-pink-50 group h-12"
                          onClick={() => alert("Screen-record the magic! 💖")}
                        >
                          <Video className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                          Record
                        </Button>
                        <p className="text-[10px] text-pink-400">Record Moment</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Status Mode Toggle */}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setShowStatusVersion(!showStatusVersion)}
                  className={cn(
                    "rounded-full px-6 transition-all",
                    showStatusVersion ? "bg-pink-500 text-white" : "bg-white/50 text-pink-500"
                  )}
                  variant="ghost"
                >
                  <Heart className={cn("mr-2 h-4 w-4", showStatusVersion && "fill-current")} />
                  {showStatusVersion ? "Exit Status Mode" : "Status Version"}
                </Button>
              </div>

              {showStatusVersion && (
                <p className="text-center text-pink-400/60 text-xs mt-4 animate-pulse">
                  Perfect for your WhatsApp Status! 📸
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative items */}
      <div className="fixed bottom-4 left-4 text-pink-200 pointer-events-none opacity-20">
        <Smartphone size={100} />
      </div>
      <div className="fixed top-20 right-4 text-pink-200 pointer-events-none opacity-20 rotate-12">
        <Sparkles size={60} />
      </div>
    </div>
  )
}
