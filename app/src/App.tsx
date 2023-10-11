import { ChangeEvent, useRef, useState } from 'react'

type JSONContentType = {
  key: string
  type: 'array' | 'object' | 'primitive'
  value: unknown
}

type JSONContent = {
  title: string
  content: JSONContentType[]
}

function handleJSONStructure(value: unknown): JSONContentType {
  if (Array.isArray(value)) {
    return {
      key: '',
      type: 'array',
      value: value.map((item) => handleJSONStructure(item))
    }
  } else if (typeof value === 'object' && value !== null) {
    const jsonArr: JSONContentType[] = []
    for (const [key, val] of Object.entries(value)) {
      jsonArr.push({
        key,
        type: 'object',
        value: handleJSONStructure(val)
      })
    }
    return {
      key: '',
      type: 'array',
      value: jsonArr
    }
  } else {
    return {
      key: '',
      type: 'primitive',
      value
    }
  }
}

// TODO handle large files
function factory(data: object) {
  const jsonArr = [] as JSONContentType[]

  for (const [key, value] of Object.entries(data)) {
      jsonArr.push({
        key,
        type: 'object',
        value: handleJSONStructure(value)
      })
  }

  return jsonArr
}

function App() {
  const [error, setError] = useState()
  const [json, setJson] = useState<JSONContent | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleOpenJSONFile() {
    if (inputRef && inputRef.current) {
      inputRef.current.click()
    }
  }

  function handleJSONUpload(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files && ev.target.files[0]

    if (file) {
      const tmppath = URL.createObjectURL(file);
      fetch(tmppath)
        .then(res => {
          if (res.status === 200) {
            res.json().then(content => {
              setJson({
                title: file.name,
                content: factory(content)
              })
            })
          } else {
            throw new Error('Not good')
          }
        })
        .catch(err => setError(err))
    }

  }

  // TODO add accessibilty to content on screen
  if (json) {
    return (
      <main className="h-full text-body flex flex-col items-center">
        <h1 className="text-subtitle">{json.title}</h1>
        <div>
          {json.content.map(c => (c.key))}
        </div>
  
      </main>
    )
  }

  return (
    <main className="h-full text-body flex flex-col items-center justify-center">
      <h1 className="text-title">JSON Tree Viewer</h1>
      <p className="my-4">Simple JSON Viewer that runs completely on-client. No data exchange</p>

      <div>
        <input className="hidden" type="file" accept="application/JSON" ref={inputRef} onChange={handleJSONUpload} />
        <button className="rounded-md border border-black hover:opacity-70 bg-btn py-1 px-3" onClick={handleOpenJSONFile}>Load JSON</button>
      </div>
      

      {error && (
        <p className="text-invalid mt-2">Invalid file. Please load a valid JSON file.</p>
      )}
    </main>
  )
}

export default App
