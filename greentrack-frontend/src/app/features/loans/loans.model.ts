export interface Loan {
  id?: number;
  employee: string;
  equipmentName: string; 
  equipmentId: number;
  dateLoan: string;   
  dateReturn: string | null; 
  state: string;
}