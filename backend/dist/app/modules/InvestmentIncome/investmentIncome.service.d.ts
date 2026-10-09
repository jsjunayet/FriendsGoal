import mongoose from "mongoose";
declare const createInvestmentIncome: (payload: any, userId?: string) => Promise<mongoose.Document<unknown, {}, import("./investmentIncome.interface").IInvestmentIncome, {}, mongoose.DefaultSchemaOptions> & import("./investmentIncome.interface").IInvestmentIncome & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
declare const getInvestmentIncomes: (query: Record<string, unknown>) => Promise<{
    incomes: (mongoose.Document<unknown, {}, import("./investmentIncome.interface").IInvestmentIncome, {}, mongoose.DefaultSchemaOptions> & import("./investmentIncome.interface").IInvestmentIncome & Required<{
        _id: string | mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    totalIncome: number;
    totalRecords: number;
}>;
export declare const InvestmentIncomeService: {
    createInvestmentIncome: typeof createInvestmentIncome;
    getInvestmentIncomes: typeof getInvestmentIncomes;
};
export {};
//# sourceMappingURL=investmentIncome.service.d.ts.map