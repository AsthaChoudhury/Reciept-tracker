"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {

  const imageRef = useRef();

  useEffect(()=>{
    const imageElement = imageRef.current;

    const handleScroll=()=>{
      if(!imageRef.current) return;
      const scrollPosition = window.scrollY;
      const scrollThresh = 100;
      if(scrollPosition>scrollThresh){
        imageElement.classList.add("scrolled");
      }else{
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll",handleScroll);
    return ()=> window.removeEventListener("scroll",handleScroll)
  },[])


  return (
    <div className="pb-20 px-4">
      <div>
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 bg-gradient-to-br from-green-600 to-green-200 font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text">
            Make Receipt tracking <br/> Easier.
        </h1>

        <p>
            Receipt Tracker is your go-to buddy for keeping tabs on your spending! Snap, store, and sort your receipts effortlessly—no more lost slips or budget headaches. Simple, smart, and stress-free! 
        </p>
        <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
            <Button size="lg" className="px-8">
                Get Started
            </Button>
            </Link>
        </div>
        <div className="hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
                <Image src="/banner.jpg" width={800} height={520} alt="Dashboard" className="rounded-lg shadow-2xl border mx-auto" priority/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
