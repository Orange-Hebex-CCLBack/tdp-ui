import Link from 'next/link'
import { useRouter } from 'next/router'
import { BeakerIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'
import { useServicesList } from 'src/hooks'
import { HeroIcon } from 'src/types'
import { classNames } from 'src/utils'

const baseMenuItems = [
  {
    name: 'Services',
    href: '#',
    icon: BeakerIcon,
  },
  {
    name: 'Deployments',
    href: '/deploy',
    icon: Cog6ToothIcon,
    children: [
      {
        name: 'Deploy',
        href: '/deploy/new',
      },
      { name: 'Logs', href: '/deploy' },
    ],
  },
]

export type TNavItem = {
  name: string
  href: string
  icon?: HeroIcon
  children?: TNavItem[]
}

export function Menu() {
  const menuItems = useServicesList(baseMenuItems)

  return (
    <nav className="flex flex-col">
      {menuItems.map((v) => (
        <MenuItem key={v.name} menuItem={v} />
      ))}
    </nav>
  )
}

function MenuItem({ menuItem: item }: { menuItem: TNavItem }) {
  return (
    <div>
      <Link
        href={item.href}
        className="px-2 py-2 text-white flex items-center gap-2 hover:bg-gray-800"
      >
        {item.icon && <item.icon className="h-5 w-5" />}
        {item.name}
      </Link>
      <div className="flex flex-col">
        {item.children?.map((v) => (
          <MenuSubItem key={v.name} menuItem={v} />
        ))}
      </div>
    </div>
  )
}

function MenuSubItem({ menuItem: item }: { menuItem: TNavItem }) {
  const router = useRouter()
  const isItemSelected = item.name === router.query.serviceId
  return (
    <Link
      href={item.href}
      className={classNames(
        isItemSelected ? 'text-white bg-gray-800' : 'text-gray-400',
        'pl-6 py-[0.2rem] hover:bg-gray-800'
      )}
    >
      {item.name}
    </Link>
  )
}