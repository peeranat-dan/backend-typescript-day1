import type { Branded, EmployeeSchema, EmployeeWithRelationsSchema } from "../../schema/index.js"

export type EmployeeService = {
  create: (data: EmployeeSchema.CreateEmployee) => Promise<EmployeeSchema.Employee>
  findMany: () => Promise<EmployeeWithRelationsSchema.EmployeeWithRelationsArray>
  findOneById: (id: Branded.EmployeeId) => Promise<EmployeeWithRelationsSchema.EmployeeWithRelations | null>
  update: (id: Branded.EmployeeId, data: EmployeeSchema.UpdateEmployee) => Promise<EmployeeSchema.Employee | null>
  removeById: (id: Branded.EmployeeId) => Promise<EmployeeSchema.Employee | null>
}
