import * as React from "react"
import { motion } from "framer-motion"
import { flipVariants, flipTransition } from "@/features/game/animations/cards-animations/presets"
import { mergeClassNames } from "@/shared/utils"

const FlipCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { isFlipped: boolean }
>(({ className, isFlipped, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={mergeClassNames("w-full h-full", className)}
      style={{ perspective: "1000px" }}
      {...props}
    >
      <motion.div
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={flipVariants}
        transition={flipTransition}
        className="relative w-full h-full"
        style={{
          display: "grid",
          gridTemplateAreas: "'stack'",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
})
FlipCard.displayName = "FlipCard"

const FlipCardFront = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={mergeClassNames("w-full h-full", className)}
    style={{
      gridArea: "stack",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(0deg) translateZ(1px)", 
      zIndex: 2,
    }}
    {...props}
  />
))
FlipCardFront.displayName = "FlipCardFront"

const FlipCardBack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={mergeClassNames("w-full h-full", className)}
    style={{
      gridArea: "stack",
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      zIndex: 1, 
    }}
    {...props}
  />
))
FlipCardBack.displayName = "FlipCardBack"

export { FlipCard, FlipCardFront, FlipCardBack }