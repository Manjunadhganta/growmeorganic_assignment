import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { fetchArtworks } from '../api/artworks'
import { ChevronDown } from 'lucide-react'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

interface Artwork {
  id: number
  title: string
  place_of_origin: string
  artist_display: string
  inscriptions: string
  date_start: number
  date_end: number
}

export default function ArtworksTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const selectedIdsRef = useRef<Set<number>>(new Set())
  const overlayRef = useRef<OverlayPanel>(null)

  const rowsPerPage = 12

  
  const loadArtworks = async (page: number) => {
    setLoading(true)
    try {
      const data = await fetchArtworks(page, rowsPerPage)
      setArtworks(data.data)
      setTotalRecords(data.pagination.total)
      setCurrentPage(page)

     
     const visibleSelected = data.data.filter((a: Artwork) =>
      selectedIdsRef.current.has(a.id)
     )
     setSelectedArtworks(visibleSelected)

    } catch (err) {
      console.error('Failed to load artworks:', err)
    } finally {
      setLoading(false)
    }
  }

  
  useEffect(() => {
    loadArtworks(1)
  }, [])

  
  const handlePageChange = (event: { first: number; rows: number }) => {
    const nextPage = event.first / event.rows + 1
    loadArtworks(nextPage)
  }

  
  const handleSelectionChange = (e: { value: Artwork[] }) => {
    const selectedOnPage = e.value ?? []
    const selectedOnPageIds = new Set(selectedOnPage.map(a => a.id))
    const currentPageIds = artworks.map(a => a.id)

    selectedOnPage.forEach(a => selectedIdsRef.current.add(a.id))

    
    currentPageIds.forEach(id => {
      if (!selectedOnPageIds.has(id)) selectedIdsRef.current.delete(id)
    })

    setSelectedArtworks(selectedOnPage)
  }

  
  const selectTopN = async (count: number) => {
    if (!Number.isFinite(count) || count <= 0) return

    const selectedIds = new Set(selectedIdsRef.current)
    const totalPages = Math.ceil(totalRecords / rowsPerPage)

   
    for (let page = 1; page <= totalPages && selectedIds.size < count; page++) {
      const data =
        page === currentPage
          ? { data: artworks }
          : await fetchArtworks(page, rowsPerPage)

      data.data.forEach((a: Artwork) => selectedIds.add(a.id))
    }

    
    const finalIds: number[] = []
    for (let page = 1; page <= totalPages && finalIds.length < count; page++) {
      const data =
        page === currentPage
          ? { data: artworks }
          : await fetchArtworks(page, rowsPerPage)

      for (const a of data.data) {
        if (!finalIds.includes(a.id)) {
          finalIds.push(a.id)
          if (finalIds.length >= count) break
        }
      }
    }

    selectedIdsRef.current = new Set(finalIds.slice(0, count))

    
    const visibleSelected = artworks.filter(a => selectedIdsRef.current.has(a.id))
    setSelectedArtworks(visibleSelected)

    overlayRef.current?.hide()
    setInputValue('')
  }

 
  const handleOverlaySubmit = async () => {
    const n = parseInt(inputValue, 10)
    if (isNaN(n) || n <= 0) return

    
    if (n <= artworks.length && currentPage === 1) {
      const firstN = artworks.slice(0, n)
      firstN.forEach(a => selectedIdsRef.current.add(a.id))
      setSelectedArtworks(artworks.filter(a => selectedIdsRef.current.has(a.id)))
      overlayRef.current?.hide()
      setInputValue('')
      return
    }

    await selectTopN(n)
  }

  return (
    <div className="card bg-white shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Artworks Table</h2>

      <div className="overflow-x-auto">
        <DataTable
          value={artworks}
          paginator
          lazy
          first={(currentPage - 1) * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={totalRecords}
          onPage={handlePageChange}
          selectionMode="multiple"
          selection={selectedArtworks}
          onSelectionChange={handleSelectionChange}
          dataKey="id"
          loading={loading}
          tableStyle={{ minWidth: '50rem' }}
          className="border border-gray-200 rounded-lg"
        >
          
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
            header={
              <div className="flex items-center justify-center">
                <ChevronDown
                  className="w-4 h-4 text-gray-700 hover:cursor-pointer"
                  onClick={(e) => overlayRef.current?.toggle(e)}
                />
                <OverlayPanel
                  ref={overlayRef}
                  appendTo="self"
                  style={{ width: '14rem', backgroundColor: 'white', padding: '0.5rem' }}
                >
                  <div>
                    <input
                      type="number"
                      placeholder="Enter rows"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 mb-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        label="Select"
                        className="p-button-sm p-button-primary"
                        onClick={handleOverlaySubmit}
                      />
                    </div>
                  </div>
                </OverlayPanel>
              </div>
            }
          />

          
          <Column field="title" header="Title" className="px-4 py-2 text-sm text-gray-700" />
          <Column field="place_of_origin" header="Origin" className="px-4 py-2 text-sm text-gray-700" />
          <Column field="artist_display" header="Artist" className="px-4 py-2 text-sm text-gray-700" />
          <Column field="inscriptions" header="Inscriptions" className="px-4 py-2 text-sm text-gray-700" />
          <Column field="date_start" header="Start" className="px-4 py-2 text-sm text-gray-700" />
          <Column field="date_end" header="End" className="px-4 py-2 text-sm text-gray-700" />
        </DataTable>
      </div>
    </div>
  )
}
