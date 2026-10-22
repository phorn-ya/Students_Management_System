export interface Department {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;

}

export interface createDepartmentDto{
    name: string;
    description?: string;
}

export interface updateDepartmentDto{
    name?: string;
    description?: string;
}

