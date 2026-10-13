import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register once so every importer shares the same plugin instances.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { useGSAP } from '@gsap/react';
export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
export { SplitText } from 'gsap/SplitText';
