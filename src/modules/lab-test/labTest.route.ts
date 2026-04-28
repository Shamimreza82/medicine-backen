import { Router } from 'express'


import { LabTestController } from './labTest.controller'


const router = Router()

router.get('/', LabTestController.serchTest)

export const labTestRoutes = router