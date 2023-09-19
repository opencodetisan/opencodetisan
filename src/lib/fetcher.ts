const fetcher = async (url: string) => {
  const result = await fetch(url)
  const json = await result.json()
  return json
}

export {fetcher}
