
export default interface todoType {
    id: number;
    title: string;
    status: TodoStatus;
}

export enum TodoStatus {
    Pending = "pending",
    InProgress = "inProgress",
    Completed = "completed"
}