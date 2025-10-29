"use client";

import { Expense, NewExpense } from "@/types/expense";
import { ChevronsRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { DatePicker } from "./ui/date-picker";
import { Button } from "./ui/button";
import { updateExpense } from "@/actions/actions";

interface ExpensesFormProps {
  expense: Expense | null;
  onClose: () => void;
}

export default function ExpensesForm({ expense, onClose }: ExpensesFormProps) {
  const [formExpense, setFormExpense] = useState<NewExpense | null>(expense);
  const [isClosing, setIsClosing] = useState(false);

  function parseFieldValue(field: keyof NewExpense, value: string) {
    if (field === "amount") return Number(value);
    if (field === "paidOnBehalf") return value === "true";
    return value;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewExpense
  ) => {
    const { value } = e.target;
    setFormExpense((prev) =>
      prev ? { ...prev, [field]: parseFieldValue(field, value) } : null
    );
  };

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
  };

  // After animation, call onClose
  useEffect(() => {
    if (isClosing) {
      const timeout = setTimeout(() => {
        onClose();
      }, 300); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [isClosing, onClose]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formExpense) {
      await updateExpense(formExpense, expense!!.id);
      handleClose();
    }
  };

  return (
    <div
      className={`h-full w-full md:w-1/3 fixed top-0 right-0 bg-surface-light p-4 flex flex-col border-l border-white/30 ${
        isClosing ? "slide-out-left-animation" : "slide-in-left-animation"
      }`}
    >
      <button
        className="text-xl cursor-pointer mb-10"
        aria-label="close expenses form"
        title="Close expenses form"
        onClick={handleClose}
      >
        <ChevronsRight size={32} className="hover:scale-110 transition-all" />
      </button>
      <form className="mt-4 flex-1" onSubmit={handleFormSubmit}>
        <h2 className="text-2xl font-semibold mb-6">
          {expense ? "Edit Expense" : "New Expense"}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 text-lg ">
              Title
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              defaultValue={expense ? expense.title : ""}
              className="p-2 rounded bg-surface border border-white/20"
              onChange={(e) => handleChange(e, "title")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-2 text-lg">
              Description
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              defaultValue={expense!!.description ? expense!!.description : ""}
              className="p-2 rounded bg-surface border border-white/20"
              onChange={(e) => handleChange(e, "description")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-2 text-lg">
              Amount
            </label>
            <Input
              type="number"
              id="amount"
              name="amount"
              defaultValue={expense ? expense.amount : ""}
              className="p-2 rounded bg-surface border border-white/20"
              onChange={(e) => handleChange(e, "amount")}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="paidOnBehalf" className="mb-2 text-lg">
              Paid on behalf
            </label>
            <Select
              value={
                formExpense?.paidOnBehalf !== undefined
                  ? String(formExpense.paidOnBehalf)
                  : undefined
              }
              onValueChange={(value) =>
                handleChange(
                  {
                    target: { value },
                  } as React.ChangeEvent<HTMLInputElement>,
                  "paidOnBehalf"
                )
              }
            >
              <SelectTrigger className="w-full bg-surface">
                <SelectValue placeholder="Paid on behalf" />
              </SelectTrigger>
              <SelectContent className=" bg-surface">
                <SelectItem
                  className="hover:bg-surface-alt bg-surface"
                  value="true"
                >
                  Yes
                </SelectItem>
                <SelectItem
                  className="hover:bg-surface-alt bg-surface"
                  value="false"
                >
                  No
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="paidBackOn" className="mb-2 text-lg">
              Paid Back On
            </label>
            <DatePicker
              value={expense ? expense.paidBackOn : null}
              onSetDate={(date) =>
                setFormExpense((prev) =>
                  prev ? { ...prev, paidBackOn: date } : null
                )
              }
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 w-full mt-8"
        >
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </form>
    </div>
  );
}
