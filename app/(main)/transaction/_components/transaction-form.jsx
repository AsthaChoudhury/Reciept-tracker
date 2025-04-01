"use client";

import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetch from "@/hooks/use-fetch";
import { Input } from "@/components/ui/input";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar1Icon, CalendarIcon, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ReceiptScanner } from "./receipt-scanner";
import { Calendar } from "@/components/ui/calendar";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";


const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData
      ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description || "",
          accountId: initialData.accountId,
          category: initialData.category,
          date: new Date(initialData.date),
          status: initialData.status || "COMPLETED",
          isRecurring: initialData.isRecurring,
          nextRecurringDate: initialData.nextRecurringDate
            ? new Date(initialData.nextRecurringDate)
            : null,
          recurringInterval: initialData.recurringInterval || null,
        }
      : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((ac) => ac.isDefault)?.id || "",
          date: new Date(),
          status: "COMPLETED",
          isRecurring: false,
          nextRecurringDate: null,
          recurringInterval: null,
        },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = async (data) => {
    console.log("Raw Form Data:", data); // Debug raw data
    const formData = {
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      accountId: data.accountId,
      category: data.category,
      status: data.status || "COMPLETED",
      isRecurring: data.isRecurring,
      nextRecurringDate:
        data.isRecurring && data.nextRecurringDate instanceof Date
          ? data.nextRecurringDate.toISOString()
          : null,
      recurringInterval: data.isRecurring ? data.recurringInterval : null,
    };

    console.log("Submitting Form Data:", formData);

    try {
      let response;
      if (editMode) {
        response = await transactionFn(initialData.id, formData);
      } else {
        response = await transactionFn(formData);
      }
      console.log("Transaction Response:", response);
    } catch (error) {
      console.error("Error processing transaction:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast({
        title: "Success",
        description: editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      });
      // Use window.location.href instead of router.push
      window.location.href = `/account/${transactionResult.data.accountId}`;
    }
  }, [transactionResult, transactionLoading, editMode]);

  const handleScanComplete = (scannedData) => {
    console.log("Scanned Data:", scannedData);
    if (scannedData) {
      setValue("amount", scannedData.amount ? scannedData.amount.toString() : "");
      setValue("date", scannedData.date ? new Date(scannedData.date) : new Date()); // Fallback to now
      setValue("description", scannedData.description || "No description");
      setValue("category", scannedData.category || "other-expense");
      setValue("isRecurring", scannedData.isRecurring || false);
    }
  };

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const filteredCategories = categories.filter((category) => category.type === type);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className="space-y-2"> 
        <label className="text-sm font-medium">Type</label>
        <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button variant="ghost" className="w-full py-1.5 text-sm">
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Transaction Status</label>
        <Select onValueChange={(value) => setValue("status", value)} defaultValue={getValues("status")}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="FLAGGED">Flagged</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full pl-3 text-left font-normal", watch("date") && "text-muted-foreground")}
            >
              {watch("date") ? format(watch("date"), "PPP") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={watch("date")}
              onSelect={(selectedDate) => setValue("date", selectedDate, { shouldValidate: true })}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked, { shouldValidate: true })}
        />
      </div>

      {isRecurring && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Next Recurring Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full pl-3 text-left font-normal", watch("nextRecurringDate") && "text-muted-foreground")}
                >
                  {watch("nextRecurringDate") ? format(watch("nextRecurringDate"), "PPP") : "Pick a date"}
                  <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watch("nextRecurringDate") || undefined}
                  onSelect={(date) => setValue("nextRecurringDate", date, { shouldValidate: true })}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.nextRecurringDate && (
              <p className="text-sm text-red-500">{errors.nextRecurringDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Recurring Interval</label>
            <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval") || "MONTHLY"}>
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" className="w-half" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" className="w-50" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-2 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;