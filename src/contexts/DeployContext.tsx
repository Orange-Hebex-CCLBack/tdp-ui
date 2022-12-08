import { toast } from 'react-toastify'
import { useTdpClient } from 'src/contexts'

import { DeployRequest, FilterTypeEnum } from '@/client-sdk'
import { useReducer } from 'react'
import { DeployMethodsEnum } from 'src/types/deployTypes'
import { deployReducer } from 'src/utils/deployReducer'

import { createContext, useContext } from 'react'
import { DeployActions } from 'src/utils/deployReducer'
import { DeployStateType } from '../types/deployTypes'

const initialState = {
  operations: [],
  filterExpression: '',
  filterType: FilterTypeEnum.Regex,
  deployMethod: DeployMethodsEnum.ALL,
  restart: false,
}

const DeployContext = createContext<{
  deploy: () => Promise<void>
  state: DeployStateType
  dispatch: React.Dispatch<DeployActions>
}>(null)

export function DeployContextProvider({ children }) {
  const { deployApi } = useTdpClient()
  const [state, dispatch] = useReducer(deployReducer, initialState)

  async function deploy() {
    const deployReq: DeployRequest = { restart: state.restart }
    if (state.filterExpression.trim()) {
      deployReq.filter_type = state.filterType
      deployReq.filter_expression = state.filterExpression
    }
    if (state.deployMethod !== 'all') {
      deployReq[state.deployMethod] = state.operations
    }
    const res = await deployApi.deployNodeApiV1DeployPost(deployReq)
    res?.data?.state && toast.info(`Deploy status: ${res.data.state}`)
  }

  return (
    <DeployContext.Provider value={{ deploy, state, dispatch }}>
      {children}
    </DeployContext.Provider>
  )
}

export function useDeployContext() {
  const deployContext = useContext(DeployContext)
  if (!deployContext)
    throw new Error(
      'useDeployContext() hook must be inside a DeployContextProvider'
    )

  return deployContext
}