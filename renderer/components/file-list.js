import { FileDraggable } from './file-draggable'

export function FileList ({ files }) {
  return (<ul>
    {files.map((file, i) => (<li><FileDraggable filePath={file.path} key={i} /></li>))}
  </ul>)
}
