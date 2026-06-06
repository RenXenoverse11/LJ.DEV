import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const position = useRef({ x: -100, y: -100 })
  const hovering = useRef(false)
  const visible = useRef(false)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const updateCursor = () => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) return

      const { x, y } = position.current
      const opacity = visible.current ? '1' : '0'
      const dotScale = hovering.current ? 0.75 : 1
      const ringScale = hovering.current ? 1.65 : 1

      dot.style.opacity = opacity
      ring.style.opacity = opacity
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${dotScale})`
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${ringScale})`
    }

    const requestUpdate = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        updateCursor()
      })
    }

    const move = (event: MouseEvent) => {
      position.current.x = event.clientX
      position.current.y = event.clientY
      visible.current = true
      requestUpdate()
    }
    const leave = () => {
      visible.current = false
      requestUpdate()
    }
    const enter = () => {
      visible.current = true
      requestUpdate()
    }
    const hoverStart = () => {
      hovering.current = true
      requestUpdate()
    }
    const hoverEnd = () => {
      hovering.current = false
      requestUpdate()
    }
    const interactive = 'a, button, input, textarea, select, [role="button"], .btn-primary, .btn-ghost'

    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    const elements = Array.from(document.querySelectorAll(interactive))
    elements.forEach((element) => {
      element.addEventListener('mouseenter', hoverStart)
      element.addEventListener('mouseleave', hoverEnd)
    })

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
      elements.forEach((element) => {
        element.removeEventListener('mouseenter', hoverStart)
        element.removeEventListener('mouseleave', hoverEnd)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}
