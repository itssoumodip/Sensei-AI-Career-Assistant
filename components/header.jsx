import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

const Header = () => {
    return (
        <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
            <nav className='container mx-auto -mt-1 px-4 h-19 flex items-center justify-between'>
                <Link href='/' >
                    <Image
                        src='/sensei.svg'
                        alt='Sensei Logo'
                        width={50}
                        height={50}
                        className='h-52 w-30 md:w-full py-2 mt-1 object-contain'
                    />
                </Link>

                <div className='flex items-center space-x-2 md:space-x-4 '>
                    <SignedIn>
                        <Link href={'/dashboard'}>
                            <Button variant='outline'>
                                <LayoutDashboard className='h-4 w-4' />
                                <span className='hidden sm:block'>Industry Insight</span>
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default">
                                    <StarsIcon className='h-4 w-4' />
                                    <span className='hidden sm:block'>Growth Tools</span>
                                    <ChevronDown className='ml-2 h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href={'/resume'} className='flex items-center gap-2'>
                                        <FileText className='h-4 w-4' />
                                        <span>Build Resume</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={'/ai-cover-letter'} className='flex items-center gap-2'>
                                        <PenBox className='h-4 w-4' />
                                        <span>Cover Letter</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={'/interview'} className='flex items-center gap-2'>
                                        <GraduationCap className='h-4 w-4' />
                                        <span>Interview Prepr</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <Button variant='outline'>Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        <div className="scale-150 50 mt-2">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonPopoverCard: "shadow-xl",
                                        userPreviewMainIdentifier: "font-semibold"
                                    },
                                }}
                                afterSignOutUrl='/'
                            />
                        </div>
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}

export default Header