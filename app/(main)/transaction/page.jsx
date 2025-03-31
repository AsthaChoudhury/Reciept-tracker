import { getUserAccount } from '@/actions/dashboard'
import { defaultCategories } from '@/data/category';
import React from 'react'
import AddTransactionForm from './_components/transaction-form';
const AddTransactionPage = async() => {
  
    const accounts = await getUserAccount();

  return (
    <div className='max-w-3xl mx-auto px-5'>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-300 bg-clip-text text-transparent mb-5">
            <AddTransactionForm accounts={accounts} categories={defaultCategories }/>
        </h1>
      
    </div>
  )
}

export default AddTransactionPage
