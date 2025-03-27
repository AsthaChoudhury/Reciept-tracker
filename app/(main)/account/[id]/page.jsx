import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import TransactionTable from "../_components/transaction-table";
import { BarLoader } from "react-spinners";

const AccountPage = async ({ params }) => {
  const accountData = await getAccountWithTransactions(params.id)

  if(!accountData){
    notFound()
  }

  const {transactions, ...account} = accountData

  return (
    <div className="space-y-8 px-5">
      {/* Header Section */}
      <div className="flex gap-4 items-end justify-between">
        <div className="flex flex-col">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-300 text-transparent bg-clip-text">
            {account.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count?.transactions || 0} Transactions
          </p>
        </div>
      </div>

      <div className="w-full h-60 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Chart Section (Coming Soon)</p>
      </div>

      {/* Transaction Table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountPage;
