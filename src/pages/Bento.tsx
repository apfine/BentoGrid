import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"         //using framer to smoothen the animations like glass bead effect you see on click 

const BentoGrid = () => {
    //These are important states which operate the smooth functions of my app
  const gridRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(["1fr", "1fr", "1fr"])
  const [rows, setRows] = useState(["1fr", "1fr", "1fr"])
  const [mobile, setMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768)
  const [enableHoverResize, setEnableHoverResize] = useState(true)
  const [activeZoom, setActiveZoom] = useState<number | null>(null)
  const [focusedBox, setFocusedBox] = useState<number | null>(null)

  //This is the part that checks for the screen ssize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setMobile(isMobile)
      if (isMobile) setEnableHoverResize(false)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  //This is responsible for resizing of the grid
  useEffect(() => {
    if (mobile || !enableHoverResize) return
    const handleMove = (e: MouseEvent) => {
      const rect = gridRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const colWidth = rect.width / 3
      const rowHeight = rect.height / 3

      const getFlex = (dist: number) => Math.min(1.4, Math.max(0.9, 1.6 - dist / 150))

      const newCols = [
        getFlex(Math.abs(mouseX - colWidth * 0.5)),
        getFlex(Math.abs(mouseX - colWidth * 1.5)),
        getFlex(Math.abs(mouseX - colWidth * 2.5)),
      ]
      const newRows = [
        getFlex(Math.abs(mouseY - rowHeight * 0.5)),
        getFlex(Math.abs(mouseY - rowHeight * 1.5)),
        getFlex(Math.abs(mouseY - rowHeight * 2.5)),
      ]

      setCols(newCols.map(n => `${n}fr`))
      setRows(newRows.map(n => `${n}fr`))
    }

    const grid = gridRef.current
    grid?.addEventListener("mousemove", handleMove)
    return () => grid?.removeEventListener("mousemove", handleMove)
  }, [mobile, enableHoverResize])       //dependencies

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* yaha se aap chahal pahal band kar sakte hain */}
      {!mobile && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: 0, right: window.innerWidth - 80, top: 0, bottom: window.innerHeight - 80 }}
          className="fixed top-6 left-6 z-50"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEnableHoverResize(prev => !prev)}
            className="w-20 h-10 flex items-center bg-violet-500/30 backdrop-blur-md border border-violet-300 rounded-full shadow-[0_0_25px_#c084fc80] relative cursor-pointer"
          >
            <motion.div
              layout
              className="absolute h-8 w-8 bg-violet-300 rounded-full shadow-[0_0_10px_#e879f980] top-1"
              animate={{ x: enableHoverResize ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <div className="absolute -z-10 animate-pulse w-6 h-6 bg-violet-300/50 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        </motion.div>
      )}

      {/* grid ji */}
      <div
        ref={gridRef}
        className={`w-full max-w-[95vw] transition-all duration-300 gap-4 ${
          mobile ? "flex flex-col items-center py-4 px-4" : "grid md:aspect-[3/2]"
        }`}
        style={
          !mobile
            ? {
                gridTemplateColumns: cols.join(" "),
                gridTemplateRows: rows.join(" "),
              }
            : undefined
        }
      >
        {gridData.map((box, idx) => {
          const isFocused = (mobile && activeZoom === idx) || (!mobile && focusedBox === idx)

          return (
            <div
              key={idx}
              onClick={() => mobile && setActiveZoom(prev => (prev === idx ? null : idx))}
              onMouseEnter={() => !mobile && setFocusedBox(idx)}
              onMouseLeave={() => !mobile && setFocusedBox(null)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.2)] bg-gray-950 ${
                mobile
                  ? `w-full max-w-[560px] h-[200px] mb-4 ${isFocused ? "scale-105 z-10" : ""}`
                  : ""
              }`}
              style={{
                ...(mobile ? {} : box.style ?? {}),
                zIndex: isFocused ? 10 : 0,
                transform: isFocused ? "scale(1.05)" : "scale(1)",
              }}
            >
              {/* aura pro max */}
              <div
                className="absolute -inset-1 z-[-1] blur-lg rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #00ffff, #ff00ff)",
                  opacity: 0.3,
                }}
              />

              {/* image render logic */}
              <img
                src={`/src/pages/assets/images/${box.image}`}
                alt={`Bento ${idx}`}
                className={`absolute inset-0 w-full h-full ${
                  box.contain ? "object-contain p-2" : "object-cover"
                }`}
              />

              {/* glass beads you see*/}
              <AnimatePresence>
                {isFocused &&
                  Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-violet-300/50 rounded-full backdrop-blur-md pointer-events-none"
                      initial={{
                        top: "50%",
                        left: "50%",
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                      }}
                      animate={{
                        x: Math.cos((i / 12) * 2 * Math.PI) * 100,
                        y: Math.sin((i / 12) * 2 * Math.PI) * 100,
                        opacity: 0,
                        scale: 0.3,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}


//This is the grid data below for  which all the operations are to be performed
const gridData = [
  {
    image: "stars.svg",
    contain: true,
    style: { gridColumn: "1 / 3", gridRow: "1 / 2" },
  },
  {
    image: "illustration-schedule-posts.webp",
    style: { gridColumn: "3 / 4", gridRow: "1 / 3" },
  },
  {
    image: "post.svg",
    style: { gridColumn: "1 / 2", gridRow: "2 / 3" },
  },
  {
    image: "illustration-consistent-schedule.webp",
    style: { gridColumn: "2 / 3", gridRow: "2 / 3" },
  },
  {
    image: "illustration-grow-followers.webp",
    style: { gridColumn: "1 / 2", gridRow: "3 / 4" },
  },
  {
    image: "illustration-ai-content.webp",
    style: { gridColumn: "2 / 3", gridRow: "3 / 4" },
  },
  {
    image: "audience.svg",
    style: { gridColumn: "3 / 4", gridRow: "3 / 4" },
  },
  {
    image: "illustration-multiple-platforms.webp",
    style: { gridColumn: "2 / 3", gridRow: "2 / 3" },
  },
  {
    image: "join.svg",
    style: { gridColumn: "2 / 3", gridRow: "2 / 3" },
  },
]

//chaliye shuru karte hain

export default BentoGrid
