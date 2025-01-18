import type { EmployeeRepository } from "../../types/repositories/employee.js"
import type { EmployeeService } from "../../types/services/employee.js"

import * as Creates from "./creates.js"
import * as Finds from "./finds.js"
import * as Removes from "./removes.js"
import * as Updates from "./updates.js"

export function initEmployeeService(employeeRepository: EmployeeRepository): EmployeeService {
  return {
    create: Creates.create(employeeRepository),
    findMany: Finds.findMany(employeeRepository),
    findOneById: Finds.findOneById(employeeRepository),
    removeById: Removes.removeById(employeeRepository),
    update: Updates.update(employeeRepository),
  }
}
