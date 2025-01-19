import { Layer, ManagedRuntime } from "effect"
import { EmployeeRepositoryContext } from "../repositories/employees/index.js"
import PrismaClientContext from "../repositories/prisma.js"
import { EmployeeServiceContext } from "../services/employees/index.js"

const PrismaClientLive = PrismaClientContext.Live
const EmployeeServiceLive = EmployeeServiceContext.Live.pipe(
  Layer.provide(EmployeeRepositoryContext.Live),
  Layer.provide(PrismaClientLive),
)

export const ServicesLive = Layer.mergeAll(
  EmployeeServiceLive,
)

export const ServicesRuntime = ManagedRuntime.make(ServicesLive)
