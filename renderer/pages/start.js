import { FileCreator } from '../components/file-creator'
import Link from 'next/link'

export default () => {
  return (<>
    <div>
      <FileCreator />
    </div>
    <div>
      <Link href='/list'>
        <a>List</a>
      </Link>
    </div>
  </>)
}
