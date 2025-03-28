"use client"

import { createTransaction } from '@/actions/transaction'
import { transactionSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const AddTransactionForm = ({accounts, categories}) => {
    const {register,setValue,handleSubmit,formState: {errors},watch,getValues,res} = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "EXPENSE",
            amount:"",
            description: "",
            date: new Date(),
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            isRecurring: false
            
        }
    })

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
      } = useFetch(createTransaction);

      const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  return (
    <form  className="space-y-6">
    <div>
      {/* recipt scanner */}
      <div className='space-y-2'>
      <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
  <SelectTrigger >
    <SelectValue placeholder="Select type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="EXPENSE">Expense</SelectItem>
    <SelectItem value="INCOME">Income</SelectItem>
  </SelectContent>
</Select>
{errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>
      <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

    </div>
    </form>
  )
}

export default AddTransactionForm
