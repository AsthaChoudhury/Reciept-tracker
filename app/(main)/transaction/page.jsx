import { getUserAccount } from '@/actions/dashboard'
import { defaultCategories } from '@/data/category';
import React from 'react'
import AddTransactionForm from './_components/transaction-form';
import { getTransaction } from '@/actions/transaction';
const AddTransactionPage = async({searchParams}) => {
  
    const accounts = await getUserAccount();
    const editId = searchParams?.edit;
    console.log(editId)

    let initialData = null;
    if(editId) {
      const transaction = await getTransaction(editId);
      initialData = transaction
    }

  return (
    <div className='max-w-3xl mx-auto px-5'>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-300 bg-clip-text text-transparent mb-5">
          {editId? "Edit" : "Add" } transaction
            
        </h1>
        <AddTransactionForm accounts={accounts} categories={defaultCategories }
            editMode={!!editId} initialData={initialData}/>
      
    </div>
  )
}

export default AddTransactionPage
