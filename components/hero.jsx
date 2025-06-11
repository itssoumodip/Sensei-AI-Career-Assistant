"use client"
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {

    const imageRef = useRef(null); useEffect(() => {
        const imageElement = imageRef.current;
        if (!imageElement) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 250;
            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        };
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='space-y-8 text-center'>
                <div className='space-y-6 mx-auto'>
                    <h1 className='bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text pb-2 pr-2 md:text-6xl lg:text-7xl xl:text-8xl'>
                        Unlock Your Dream Career
                        <br />
                        with
                        <br />
                        Your Personal AI Mentor
                    </h1>
                    <p>
                        Unlock your potential with tailored career advice, smart interview prep, and intelligent tools to help you land your dream job.
                    </p>
                </div>

                <div className='flex justify-center space-x-4'>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper mt-5 md:-mt-10">
                    <div ref={imageRef} className="hero-image">
                        <Image
                            src="/banner.png"
                            width={1280}
                            height={720}
                            alt="Dashboard Preview"
                            className="rounded-lg border mx-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection