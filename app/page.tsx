'use client';

import { CompanyLogo } from '@/components/companies-logo';
import { Button } from '@/components/ui/button';
import { ArrowDown, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { annotate } from 'rough-notation';

function Navbar() {
    return (
        <div className='border-b border-custom-gray px-24 flex justify-between items-center py-4 bg-custom-light-gray'>
            <Image src="/logo.svg" alt="logo" width={148} height={100} />
            <div className='flex items-center gap-12'>
                <Link href='/'>Companies</Link>
                <Link href='/' className='flex items-center gap-1'>
                    Latest hires
                </Link>
                <Link href='/dashboard'>
                <Button variant={'outline'} className='bg-blue-600 group text-white flex items-center'>Connect LinkedIn <Linkedin className='ml-2 h-4 w-4 stroke-none fill-white group-hover:fill-blue-600' /></Button>
                </Link>
            </div>
        </div>
    )
}

export default function Home() {
    const opportunityRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (opportunityRef.current) {
            const annotation = annotate(opportunityRef.current, { type: 'highlight', color: 'lightgray' });
            annotation.show();
        }
    }, []);

    return (
        <div className='min-h-screen flex flex-col bg-custom-light-gray'>
            <Navbar />
            <main className='flex px-24'>
                <div className='flex flex-1 flex-col justify-center gap-4'>
                    <h1 className='text-8xl font-medium leading-normal'>
                        Find Your
                        <br />
                        Next <span ref={opportunityRef}>Opportunity</span>
                    </h1>
                    <p className='text-xl italic text-muted-foreground'>
                        Find your dream job with our job board. <br />
                        We have the best offers for you.
                        Easy match with your skills and interests.
                        <br />
                        <br />
                        <Link href='/dashboard'>
                            <Button>
                                Find a job
                            </Button>
                        </Link>
                    </p>
                </div>
                <div className='relative'>
                    <Image src="/hero.png" alt="hero" width={700} height={500} className='blur-lg' />
                    <Image src="/hero.png" alt="hero" width={700} height={500} className='rounded-b-lg absolute top-0 left-0' />
                </div>
            </main>
            <div id='companies-featured'>
                <section className=" mt-8 py-8 bg-custom-ice">
                    <div className="container mx-auto">
                        <div className="flex justify-center items-center space-x-24">
                            <CompanyLogo name="amazon" />
                            <CompanyLogo name="microsoft" />
                            <CompanyLogo name="google" />
                            <CompanyLogo name="linkedin" />
                            <CompanyLogo name="apple" />
                        </div>
                    </div>
                </section>


            </div>
        </div>
    )
}


