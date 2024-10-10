import MenuOptions from './menu-options'


const Sidebar = async () => {
  
  return (
    <div className='p-4'>
    <MenuOptions
      defaultOpen={true}
    />
    <MenuOptions
      defaultOpen={false}
    />
  </div>
  )
}

export default Sidebar