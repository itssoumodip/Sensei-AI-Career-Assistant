import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  return (
    <section>
        <div>
            <div>
                <h1>
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