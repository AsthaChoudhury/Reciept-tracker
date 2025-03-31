"use client"
import { scanReceipt } from '@/actions/transaction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/use-fetch'
import { Camera, Loader, Loader2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function ReceiptScanner ({onScanComplete}) {
    const fileInputRef = useRef()
    const{
        loading : scanReceiptLoading,
        fn : scanReceiptfn,
        data: scannedData,
    } = useFetch(scanReceipt)

    const handleReceiptScan = async(file) => { if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
  
      await scanReceiptfn(file);
    };

    useEffect(() => {
        if (scannedData && !scanReceiptLoading) {
          onScanComplete(scannedData);
          toast.success("Receipt scanned successfully");
        }
      }, [scanReceiptLoading, scannedData]);
  
  return (
    <div>
      <Input type="file" ref={fileInputRef} className='hidden' accept='image/*' capture='environment'
      onChange={(e) => {
        const file = e.target.files?.[0];
        if(file) handleReceiptScan(file);
      }}/>
      <Button
      onClick={() => fileInputRef.current.click()}
      disabled= {scanReceiptLoading} 
      type="button"
      variant="outline"
      className='bg-green'>
        {scanReceiptLoading ? (
            <>
            <Loader2 className='mr-2 animate-spin' />
            <span>Scanning...</span>
            </>
        ):(
            <>
            <Camera className='mr-2 green'/>
            <span>Scan Receipt</span>
            </>
        )
        }
      </Button>
    </div>
  )
}

