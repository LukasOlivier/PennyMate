"use client";

import { SerializedExpense } from "@/types/expense";
import { ChevronsRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
import {
  addExpense,
  addIncome,
  updateExpense,
  updateIncome,
} from "@/actions/actions";
import { Prisma } from "@prisma/client";
import { SerializedIncome } from "@/types/income";

interface FormProps {
  data: SerializedExpense | SerializedIncome | null;
  onClose: () => void;
}

export default function FormComponent({ data, onClose }: FormProps) {
  const [formData, setFormData] = useState<
    Prisma.ExpenseCreateInput | Prisma.IncomeCreateInput | null
  >(data);
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    amount?: string;
    paidBackOn?: string;
  }>({});

  function parseFieldValue(
    field: keyof Prisma.ExpenseCreateInput,
    value: string
  ) {
    if (field === "amount") return Number(value);
    if (field === "paidOnBehalf") return value === "true";
    return value;
  }

  const isExpense = (
    obj: Prisma.ExpenseCreateInput | Prisma.IncomeCreateInput | null | undefined
  ): obj is Prisma.ExpenseCreateInput => {
    return !!obj && "paidBackOn" in obj;
  };

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // DISCLAIMER: AI GENERATED CODE
  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside the form
      if (ref.current?.contains(target)) return;

      // Check if click is inside a portal element (Select, DatePicker, etc.)
      const isPortalClick =
        (target as Element).closest?.('[role="dialog"]') ||
        (target as Element).closest?.('[role="listbox"]') ||
        (target as Element).closest?.(".radix-portal") ||
        (target as Element).closest?.("[data-radix-popper-content-wrapper]");

      if (isPortalClick) return;

      // If we get here, it's a genuine outside click
      handleClose();
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [ref]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Prisma.ExpenseCreateInput
  ) => {
    const { value } = e.target;
    // clear error for this field as the user types
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));

    setFormData((prev) => {
      // start from existing prev or fall back to data or empty object
      const base = (prev ?? data ?? {}) as Record<string, any>;
      const updated = {
        ...base,
        [field]: parseFieldValue(field, value),
      } as Prisma.ExpenseCreateInput;
      return updated;
    });
  };

  const validateField = (
    field: "title" | "amount" | "paidBackOn" | "paidOnBehalf",
    value: string
  ) => {
    let message: string | undefined;
    if (field === "title") {
      if (!value.trim()) message = "Title is required";
    }
    if (field === "amount") {
      if (value === "" || value === null) {
        message = "Amount is required";
      } else {
        const n = Number(value);
        if (Number.isNaN(n)) message = "Amount must be a number";
        else if (n <= 0) message = "Amount must be greater than 0";
      }
    }
    setFormErrors((prev) => ({ ...prev, [field]: message }));
    return !message;
  };

  const validatePaidBackOn = () => {
    // Skip validation for non-expense entries (e.g. Income)
    if (!isExpense(formData)) {
      // clear any previous error
      setFormErrors((prev) => ({ ...prev, paidBackOn: undefined }));
      return true;
    }

    // Now safe to access paidBackOn on an Expense
    if (formData.paidBackOn && !formData.paidOnBehalf) {
      const message = "Cannot set Paid Back On if not Paid on behalf";
      setFormErrors((prev) => ({ ...prev, paidBackOn: message }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, paidBackOn: undefined }));
    return true;
  };

  const validateAll = () => {
    const titleVal = formData?.title ?? "";
    const amountVal =
      formData && formData.amount !== undefined
        ? String(formData.amount)
        : data
        ? String(data.amount ?? "")
        : "";
    const validTitle = validateField("title", String(titleVal));
    const validAmount = validateField("amount", String(amountVal));
    const validPaidBackOn = validatePaidBackOn();
    return validTitle && validAmount && validPaidBackOn;
  };

  const handleClose = () => {
    setIsClosing(true);
  };

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
    // validate before submitting
    if (!validateAll()) return;
    if (isExpense(formData)) {
      if (data && formData) {
        await updateExpense(formData, data!!.id);
      } else {
        await addExpense(formData as Prisma.ExpenseCreateInput);
      }
    } else {
      if (data && formData) {
        await updateIncome(formData, data!!.id);
      } else {
        await addIncome(formData as Prisma.IncomeCreateInput);
      }
    }

    handleClose();
  };

  return (
    <div
      className={`h-full w-full md:w-1/3 fixed top-0 right-0 bg-surface-light p-4 flex flex-col border-l border-white/30 ${
        isClosing ? "slide-out-left-animation" : "slide-in-left-animation"
      }`}
      ref={ref}
    >
      <button
        className="text-xl cursor-pointer mb-10"
        aria-label="close datas form"
        title="Close datas form"
        onClick={handleClose}
      >
        <ChevronsRight size={32} className="hover:scale-110 transition-all" />
      </button>
      <form className="mt-4 flex-1" onSubmit={handleFormSubmit}>
        <h2 className="text-2xl font-semibold mb-6">
          {data ? "Edit Expense" : "New Expense"}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-2 text-lg ">
              Title*
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData?.title ?? ""}
              className={`p-2 rounded bg-surface ${
                formErrors.title
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border border-white/20"
              }`}
              onChange={(e) => handleChange(e, "title")}
              onBlur={(e) => validateField("title", e.target.value)}
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="mb-2 text-lg">
              Description
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData?.description ?? ""}
              className="p-2 rounded bg-surface border border-white/20"
              onChange={(e) => handleChange(e, "description")}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="amount" className="mb-2 text-lg">
              Amount*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                €
              </span>
              <Input
                type="number"
                id="amount"
                step="0.01"
                name="amount"
                value={
                  formData?.amount !== undefined ? String(formData.amount) : ""
                }
                className={`p-2 pl-8 rounded bg-surface ${
                  formErrors.amount
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border border-white/20"
                }`}
                onChange={(e) => handleChange(e, "amount")}
                onBlur={(e) => validateField("amount", e.target.value)}
              />
            </div>
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="paidBackOn" className="mb-2 text-lg">
              Date
            </label>
            <DatePicker
              value={formData?.createdAt ?? new Date()}
              onSetDate={(date) =>
                setFormData((prev) =>
                  prev
                    ? { ...prev, createdAt: date }
                    : ({ createdAt: date } as Prisma.ExpenseCreateInput)
                )
              }
            />
          </div>
          {/* Paid on behalf & Paid Back On are only for expenses */}
          {isExpense(formData) && (
            <>
              <div className="flex flex-col">
                <label htmlFor="paidOnBehalf" className="mb-2 text-lg">
                  Paid on behalf
                </label>
                <Select
                  value={
                    formData?.paidOnBehalf !== undefined
                      ? String(formData.paidOnBehalf)
                      : "false"
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
                  value={formData?.paidBackOn ?? null}
                  onSetDate={(date) =>
                    setFormData((prev) =>
                      prev
                        ? { ...prev, paidBackOn: date }
                        : ({ paidBackOn: date } as Prisma.ExpenseCreateInput)
                    )
                  }
                />
              </div>
            </>
          )}

          {formErrors.paidBackOn && (
            <p className="text-red-500 text-sm mt-1">{formErrors.paidBackOn}</p>
          )}
        </div>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 w-full mt-8"
        >
          {data ? "Update Expense" : "Add Expense"}
        </Button>
      </form>
    </div>
  );
}
