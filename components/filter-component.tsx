import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Minus, X } from "lucide-react";
import { ExpenseFilters, IncomeFilters } from "@/types/filters";
import { useParams } from "next/navigation";

interface FilterComponentProps {
  defaultFilters: ExpenseFilters | IncomeFilters;
  onFilterChanged: (
    filters: ExpenseFilters | IncomeFilters
  ) => void | Promise<void>;
}

const FilterComponent = ({
  defaultFilters,
  onFilterChanged,
}: FilterComponentProps) => {
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const isExpenseFilter = (obj: ExpenseFilters | IncomeFilters) => {
    return "isPaidOnBehalf" in obj;
  };

  const [currentFilters, setCurrentFilters] = useState<
    ExpenseFilters | IncomeFilters
  >(defaultFilters);

  const switchPaidOnBehalfState = () => {
    if (isExpenseFilter(currentFilters)) {
      const next =
        currentFilters.isPaidOnBehalf === null
          ? true
          : currentFilters.isPaidOnBehalf === true
          ? false
          : null;

      const newFilters: ExpenseFilters = {
        ...currentFilters,
        isPaidOnBehalf: next,
      };
      setCurrentFilters(newFilters);
      onFilterChanged(newFilters);
    }
  };

  const HandleFilterChange = (selectedDateFilter?: string | null) => {
    const df = selectedDateFilter ?? dateFilter;
    const newFilters: ExpenseFilters | IncomeFilters = { ...currentFilters };

    if (df === "month") {
      newFilters.startDate = new Date(new Date().setDate(1));
      newFilters.endDate = new Date(
        new Date(newFilters.startDate).setMonth(new Date().getMonth() + 1)
      );
    } else if (df === "year") {
      newFilters.startDate = new Date(new Date().getFullYear(), 0, 1);
      newFilters.endDate = new Date(new Date().getFullYear() + 1, 0, 1);
    } else {
      // "all" or null -> clear range
      newFilters.startDate = null;
      newFilters.endDate = null;
    }

    setCurrentFilters(newFilters);
    onFilterChanged(newFilters);
  };

  return (
    <div className="flex gap-4 mb-4">
      <ul className="flex gap-2">
        {/* Time Filter */}
        <li>
          <Button
            className={`hover:text-black ${
              dateFilter === "all" || dateFilter === null
                ? "bg-zinc-100 text-black"
                : "bg-surface"
            }`}
            onClick={() => {
              setDateFilter("all");
              HandleFilterChange("all");
            }}
          >
            All Time
          </Button>
        </li>
        <li>
          <Button
            className={`hover:text-black ${
              dateFilter === "month" ? "bg-zinc-100 text-black" : "bg-surface"
            }`}
            onClick={() => {
              setDateFilter("month");
              HandleFilterChange("month");
            }}
          >
            This Month
          </Button>
        </li>
        <li>
          <Button
            className={`hover:text-black ${
              dateFilter === "year" ? "bg-zinc-100 text-black" : "bg-surface"
            }`}
            onClick={() => {
              setDateFilter("year");
              HandleFilterChange("year");
            }}
          >
            This Year
          </Button>
        </li>
      </ul>
      {isExpenseFilter(currentFilters) && (
        <>
          <div className="border  border-surface-alt"></div>
          <Button
            className={`hover:text-black ${
              currentFilters.isPaidOnBehalf === null
                ? "bg-surface"
                : "bg-zinc-100 text-black"
            }`}
            onClick={() => switchPaidOnBehalfState()}
          >
            Is Paid On Behalf
            {currentFilters.isPaidOnBehalf === null ? (
              <Minus className="ml-2" />
            ) : currentFilters.isPaidOnBehalf ? (
              <Check className="ml-2" />
            ) : (
              <X className="ml-2" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default FilterComponent;
