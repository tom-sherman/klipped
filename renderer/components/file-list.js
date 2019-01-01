import { FileDraggable } from './file-draggable'

export function FileList ({ files }) {
  return (<ul>
    {files.map((file, i) => (<li key={i}><FileDraggable filePath={file.path} /></li>))}
  </ul>)
}
