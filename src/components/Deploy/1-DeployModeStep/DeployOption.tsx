import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { classNames } from 'src/utils'
import { useDeployContext } from 'src/contexts'
import { DeployActionEnum } from 'src/types/deployTypes'
import type { DeployModes } from './DeployModeStep'

export function DeployOption({
  method: { title, description, name },
}: {
  method: DeployModes
}) {
  const {
    state: { selectedDeployMode },
    dispatch,
  } = useDeployContext()
  const isSelected = name === selectedDeployMode

  function handleOnClick() {
    dispatch({
      type: DeployActionEnum.SET_DEPLOY_METHOD,
      payload: { newSelectedDeployMode: name },
    })
  }

  return (
    <label
      htmlFor={name}
      onClick={handleOnClick}
      className={classNames(
        'cursor-pointer text-gray-500 border border-gray-200 rounded-lg p-5',
        isSelected
          ? 'border-blue-600 text-blue-600'
          : 'hover:text-gray-600 hover:bg-gray-100'
      )}
    >
      <input
        type="radio"
        id={name}
        value={name}
        name="deploy-type"
        className="hidden"
        required
      />
      <div className="flex justify-between">
        <div className="text-lg font-semibold">{title}</div>
        {isSelected && (
          <CheckCircleIcon className="ml-3 w-6 h-6" aria-hidden="true" />
        )}
      </div>
      <p>{description}</p>
    </label>
  )
}