import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'

// Registro único dos plugins (evita registros duplicados em re-renders / StrictMode)
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrollToPlugin)
// Mobile address-bar resizing must not refresh pins in the middle of a swipe.
// Real orientation/width changes still refresh the layout normally.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, useGSAP }
