import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import DashboardLayout from 'src/app/dashboard/layout'
import ComponentInfos from 'src/app/services/ComponentInfos'
import VariableList from 'src/app/services/VariableList'
import { Disclosure } from 'src/components/Disclosure'
import { useServiceInfos } from 'src/hooks'

const ServicePage = () => {
  const router = useRouter()
  const { serviceId: tempServiceId } = router.query
  const serviceId = Array.isArray(tempServiceId)
    ? tempServiceId[0]
    : tempServiceId
  const serviceInfos = useServiceInfos(serviceId)

  if (!serviceInfos) return <p>Loading...</p>

  type ReduceType = {
    singleValues: [string, string][]
    objectValues: [string, Object][]
  }

  const { singleValues, objectValues } = Object.entries(
    serviceInfos.variables
  ).reduce<ReduceType>(
    (accumulator, currentValue) => {
      if (typeof currentValue[1] === 'object') {
        accumulator.objectValues.push(currentValue)
      } else {
        accumulator.singleValues.push(currentValue)
      }
      return accumulator
    },
    { singleValues: [], objectValues: [] }
  )

  return (
    <div className="p-5">
      <div className="border-b border-gray-200 pb-5 mb-5">
        <h3 className="text-3xl font-medium leading-6 text-gray-900">
          {serviceId}
        </h3>
      </div>
      <div className="mb-3">
        <VariableList variables={singleValues} />
      </div>
      <div className="flex flex-col gap-2">
        {objectValues.map(([k, v]) => {
          return (
            <Disclosure key={k} title={k}>
              <VariableList variables={v ? Object.entries(v) : []} />
            </Disclosure>
          )
        })}
      </div>
      <div className="mt-8 border-b border-gray-200 pb-5 mb-5">
        <h3 className="text-3xl font-medium leading-6 text-gray-900">
          Components
        </h3>
      </div>
      <div className="flex flex-col gap-2">
        {serviceInfos?.components.map((component) => (
          <ComponentInfos
            key={component.id}
            serviceId={serviceInfos.id}
            componentId={component.id}
          />
        ))}
      </div>
    </div>
  )
}

ServicePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default ServicePage
