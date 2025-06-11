import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-8 text-center'>
            <div className='space-y-6 mx-auto'>
                <h1 className='gradient-title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl'>
                    Unlock Your Dream Career with
                    <br />
                    Your Personal AI Mentor
                    <p>
                    Unlock your potential with tailored career advice, smart interview prep, and intelligent tools to help you land your dream job.
                    </p>    
                </h1>
            </div>

            <div>
                <Link href="/dashboard">
                    <Button size="lg" className="px-8">Get Started</Button>
                </Link>
            </div>

            <div>
                <div>
                    <Image
                        src={"/banner.png"}
                        width={1280}
                        height={720}
                        alt='Banner Image'
                        className='rounded-lg shadow-2xl border mx-auto'
                        priority
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection