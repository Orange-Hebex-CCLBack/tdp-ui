import { useState } from 'react'
import { classNames } from 'src/utils'
import { useVariablesContext } from '../../VariablesContext'

interface VariableFieldType {
  prop: string
  value: string | number | boolean | any[]
  parent?: string
}

//TODO: Impose value as array
export function ArrayList({ prop, value, parent }: VariableFieldType) {
  const { setNewVariables } = useVariablesContext()
  const [error, setError] = useState(false)
  const inputName = parent ? [parent, prop].join('.') : prop

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      const newVariable = JSON.parse(event.target.value)
      setError(false)
      if (!parent) {
        setNewVariables((prev: any) => ({ ...prev, [prop]: newVariable }))
      } else {
        setNewVariables((prev: any) => {
          const data = { ...prev }
          data[parent] = prev[parent] || {}
          data[parent][prop] = newVariable
          return data
        })
      }
    } catch (err) {
      setError(true)
    }
  }

  if (Array.isArray(value)) {
    return (
      <ol className="flex flex-grow flex-col gap-2">
        {value.map((v) => (
          <li key={inputName} className="flex grow">
            <input
              name={inputName}
              className={classNames(
                'grow',
                error && 'bg-red-200',
                typeof value === 'number' ? 'text-teal-600' : 'text-slate-700',
                'hover:opacity-100 hover:bg-slate-200 transition duration-75 ease-in-out'
              )}
              defaultValue={JSON.stringify(v)}
              onChange={handleChange}
            />
          </li>
        ))}
      </ol>
    )
  } else {
    return <></>
  }
}
