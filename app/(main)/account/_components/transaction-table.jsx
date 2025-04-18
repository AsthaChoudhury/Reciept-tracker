"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/category";
import { Badge, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};


const STATUS_COLORS = {
  PENDING: "bg-yellow-500",
  COMPLETED: "bg-green-500",
  FAILED: "bg-red-500",
  FLAGGED: "bg-orange-500",
};

const ITEMS_PER_PAGE = 10;


const TransactionTable = ({ transactions }) => {

  const [selectedids,setselectedids] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig,setSortConfig] = useState({
    field: "date",
    direction: "desc"
  })
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  


  const pathname = usePathname();
const searchParams = useSearchParams();

const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
  setselectedids([]); 
};
const filteredAndSortedTransactions = useMemo(() => {
  let result = [...transactions];

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    result = result.filter((transaction) =>
      transaction.description?.toLowerCase().includes(searchLower)
    );
  }

  // type filter
  if (typeFilter) {
    result = result.filter((transaction) => transaction.type === typeFilter);
  }

  // recurring filter
  if (recurringFilter) {
    result = result.filter((transaction) => {
      if (recurringFilter === "recurring") return transaction.isRecurring;
      return !transaction.isRecurring;
    });
  }

  // sorting
  result.sort((a, b) => {
    let comparison = 0;

    switch (sortConfig.field) {
      case "date":
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  return result;
}, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);


const handleEditClick = (id) => {
  window.location.href = `/transaction?edit=${id}`;
};
  // const router = useRouter();


  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field  && current.direction ==="asc"?  "desc" : "asc",
    }))
  };

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSelect = (id) => {
    setselectedids((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setselectedids((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = async() => {
    if(
      !window.confirm(
        `Are you sure you want to delete ${selectedids.length} transactions?`
      )
    )
    return
    deleteFn(selectedids)
  };

  useEffect(()=> {
    if(deleted && !deleteLoading){
      toast.error("TRansactions deleted successfully")

    }
  },[deleted,deleteLoading])

  const handleClearFilter = () => {
    console.log(typeof searchTerm); 
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setselectedids([]);
  };

  return (
    <div className="space-y-4">
      {
        deleteLoading && (
          <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
        )
      }
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input placeholder="Search" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="pl-8"/>
        </div>

        <div className="flex gap-2">
        <Select value={typeFilter}  onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>
  <SelectTrigger >
    <SelectValue placeholder="All Types" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="INCOME">Income</SelectItem>
    <SelectItem value="EXPENSE">Expense</SelectItem>
  </SelectContent>
</Select>

<Select value={recurringFilter} onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}>
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="All Transactions" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recurring">Recurring Only</SelectItem>
    <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
  </SelectContent>
</Select>

{selectedids.length >0 && (
  <div className="flex items-center gap-2">
    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
     <Trash className="h-4 w-4 mr-2" />
      Delete Selected ({selectedids.length})</Button>
    </div>
)}

{( searchTerm || typeFilter || recurringFilter) && (
  <Button variant="outline" size="icon" onClick={handleClearFilter}>
    <X className="h-4 w-5" />
  </Button>
)}

        </div>
      </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox onCheckedChange={handleSelectAll}
              checked={selectedids.length === paginatedTransactions.length && paginatedTransactions.length>0} />
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">Date{sortConfig.field === "date" &&
                (sortConfig.direction === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />))}</div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div
              className="cursor-pointer"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center">Category{sortConfig.field === "category" &&
                (sortConfig.direction === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />))}</div>
            </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center justify-end">Amount{sortConfig.field === "amount" &&
                (sortConfig.direction === "asc" ? (<ChevronUp className="ml-1 h-4 w-4" />) : (<ChevronDown className="ml-1 h-4 w-4" />))}
            </div>
            </TableHead>
            <TableHead>Receipt</TableHead>
            <TableHead>Status</TableHead>

            <TableHead>Recurring</TableHead>
            <TableHead>Last Processed</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox onCheckedChange={()=> handleSelect(transaction.id)}
                    checked={selectedids.includes(transaction.id)}/>
                </TableCell>
                <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize"><span style={{
                  background: categoryColors[transaction.category],
                }} className="px-2 py-1 rounded text-white text-sm">{transaction.category}</span></TableCell>
                <TableCell className="text-right" style={{
                  color:transaction.type ==="EXPENSE" ? "red":"green",
                }}>
                  {transaction.type === "EXPENSE"?"-":"+"}
                  Rs. {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {transaction.receiptUrl ? (
                    <a href={transaction.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400">No Receipt</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={`${STATUS_COLORS[transaction.status]} text-white px-2 py-1 rounded-md`}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
  {transaction.isRecurring ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="secondary"
            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center"
          >
            <RefreshCw className="h-3 w-3" />
            {
              RECURRING_INTERVALS[
                transaction.recurringInterval
              ]
            }
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium">Next Date:</div>
            <div>
              {format(
                new Date(transaction.nextRecurringDate),
                "PPP"
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Badge variant="outline" className="gap-1 flex items-center text-black">
      <Clock className="h-3 w-3" />
      One-time
    </Badge>
  )}
</TableCell>
<TableCell>
                  {transaction.lastProcessed ? (
                    format(new Date(transaction.lastProcessed), "dd MMM yyyy")
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(transaction.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
    {totalPages > 1 &&
    (
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage-1)} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage+1)} disabled={currentPage === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        
      </div>
    )}
    </div>
  );
};

export default TransactionTable;
