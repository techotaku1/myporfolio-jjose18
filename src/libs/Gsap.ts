import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once so every importer shares the same plugin instances.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { useGSAP } from '@gsap/react';
export { gsap } from 'gsap';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
