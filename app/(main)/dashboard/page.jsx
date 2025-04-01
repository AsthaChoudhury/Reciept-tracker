import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CreateAccountDrawer from "@/components/create-account-drawer.jsx"
import { Plus } from "lucide-react";
import { getUserAccount } from "@/actions/dashboard";
import {AccountCard} from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import Budgetprogress from "./_components/budget-progress.js";
import { DashboardOverview } from "./_components/transactions-overview";
import { getUserTransactions } from "@/actions/transaction";
async function DashboardPage(){


    const accounts= await getUserAccount();
    console.log(accounts)

    const defaultAccount = accounts?.find((account) => account.isDefault)

    let budgetdata = null;
    let transactions = [];
    if(defaultAccount){
        budgetdata = await getCurrentBudget(defaultAccount.id);
        transactions = await getUserTransactions(defaultAccount.id)
    }

    console.log(transactions)
    return <div className="space-y-8">
        {/* Budget Process */}

        {defaultAccount && (
            <Budgetprogress initialBudget = {budgetdata?.budget}
            currentExpenses = {budgetdata.currentExpenses || 0}/>
        )}
        {/* Overview */}
        <DashboardOverview accounts={accounts} transactions={transactions || [] } />
        {/* Account Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CreateAccountDrawer>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                    <Plus className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">Add New Account</p>
                    </CardContent>
                </Card>
            </CreateAccountDrawer>
            {accounts.length>0 && accounts?.map((account)=>{
                return <AccountCard key={account.id} account={account}/>
            })}
        </div>
    </div>
}

export default DashboardPage