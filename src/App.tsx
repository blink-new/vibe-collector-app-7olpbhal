import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Button } from './components/ui/button'
import { Card, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Plus, Search, Upload, Heart, Tag, Palette, Grid, List } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Vibe {
  id: string
  title: string
  imageUrl: string
  description: string
  tags: string[]
  colors: string[]
  boardId: string
  createdAt: string
}

interface Board {
  id: string
  title: string
  description: string
  createdAt: string
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [boards, setBoards] = useState<Board[]>([])
  const [vibes, setVibes] = useState<Vibe[]>([])
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [isCreateVibeOpen, setIsCreateVibeOpen] = useState(false)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Sample data for demo
  useEffect(() => {
    if (user) {
      const sampleBoards: Board[] = [
        {
          id: '1',
          title: 'Minimalist Vibes',
          description: 'Clean, simple, and elegant inspiration',
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'Nature & Earth',
          description: 'Natural textures, organic shapes, earthy tones',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Retro Futurism',
          description: 'Vintage sci-fi aesthetics and neon dreams',
          createdAt: new Date().toISOString()
        }
      ]

      const sampleVibes: Vibe[] = [
        {
          id: '1',
          title: 'Scandinavian Interior',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop',
          description: 'Clean lines, natural wood, cozy textures',
          tags: ['minimalist', 'cozy', 'nordic'],
          colors: ['#F5F5F5', '#D4B896', '#8B7355'],
          boardId: '1',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Forest Path',
          imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
          description: 'Misty morning light through ancient trees',
          tags: ['nature', 'peaceful', 'green'],
          colors: ['#2D5016', '#4A7C59', '#8FBC8F'],
          boardId: '2',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Neon Cityscape',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
          description: 'Cyberpunk aesthetics with vibrant neon lights',
          tags: ['cyberpunk', 'neon', 'urban'],
          colors: ['#FF0080', '#00FFFF', '#8A2BE2'],
          boardId: '3',
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Zen Garden',
          imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
          description: 'Peaceful stones and raked sand patterns',
          tags: ['zen', 'meditation', 'balance'],
          colors: ['#F5F5DC', '#D2B48C', '#8B7D6B'],
          boardId: '2',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          title: 'Modern Typography',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop',
          description: 'Bold, clean typefaces with perfect spacing',
          tags: ['typography', 'design', 'modern'],
          colors: ['#000000', '#FFFFFF', '#FF6B6B'],
          boardId: '1',
          createdAt: new Date().toISOString()
        },
        {
          id: '6',
          title: 'Retro Computer',
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
          description: 'Vintage computing aesthetics and CRT monitors',
          tags: ['retro', 'technology', 'vintage'],
          colors: ['#00FF00', '#000000', '#FFFF00'],
          boardId: '3',
          createdAt: new Date().toISOString()
        }
      ]

      setBoards(sampleBoards)
      setVibes(sampleVibes)
      setSelectedBoard('1')
    }
  }, [user])

  const filteredVibes = vibes.filter(vibe => {
    const matchesBoard = !selectedBoard || vibe.boardId === selectedBoard
    const matchesSearch = !searchQuery || 
      vibe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vibe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vibe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesBoard && matchesSearch
  })

  const handleCreateBoard = (title: string, description: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      description,
      createdAt: new Date().toISOString()
    }
    setBoards(prev => [...prev, newBoard])
    setIsCreateBoardOpen(false)
    toast.success('Board created!')
  }

  const handleCreateVibe = async (title: string, description: string, tags: string[], file?: File) => {
    let imageUrl = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop'
    
    if (file) {
      try {
        const { publicUrl } = await blink.storage.upload(file, `vibes/${Date.now()}-${file.name}`)
        imageUrl = publicUrl
      } catch (error) {
        console.error('Upload failed:', error)
        toast.error('Failed to upload image')
        return
      }
    }

    const newVibe: Vibe = {
      id: Date.now().toString(),
      title,
      imageUrl,
      description,
      tags,
      colors: ['#6366F1', '#F59E0B', '#EF4444'], // Default colors
      boardId: selectedBoard || boards[0]?.id || '1',
      createdAt: new Date().toISOString()
    }
    
    setVibes(prev => [...prev, newVibe])
    setIsCreateVibeOpen(false)
    toast.success('Vibe added!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your vibes...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vibe Collector</h1>
          <p className="text-gray-600 mb-8">Collect and organize your creative inspiration in beautiful mood boards</p>
          <Button onClick={() => blink.auth.login()} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Sign In to Start Collecting
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vibe Collector</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search vibes, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Button onClick={() => blink.auth.logout()} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
                <Dialog open={isCreateBoardOpen} onOpenChange={setIsCreateBoardOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Board
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Board</DialogTitle>
                    </DialogHeader>
                    <CreateBoardForm onSubmit={handleCreateBoard} />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                {boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => setSelectedBoard(board.id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors ${
                      selectedBoard === board.id
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{board.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{board.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {vibes.filter(v => v.boardId === board.id).length} vibes
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {boards.find(b => b.id === selectedBoard)?.title || 'All Vibes'}
                </h2>
                <p className="text-gray-600">
                  {filteredVibes.length} vibes collected
                </p>
              </div>
              
              <Dialog open={isCreateVibeOpen} onOpenChange={setIsCreateVibeOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vibe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vibe</DialogTitle>
                  </DialogHeader>
                  <CreateVibeForm onSubmit={handleCreateVibe} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Vibes Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVibes.map((vibe) => (
                  <VibeCard key={vibe.id} vibe={vibe} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVibes.map((vibe) => (
                  <VibeListItem key={vibe.id} vibe={vibe} />
                ))}
              </div>
            )}

            {filteredVibes.length === 0 && (
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vibes found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try adjusting your search' : 'Start collecting inspiration by adding your first vibe'}
                </p>
                <Button onClick={() => setIsCreateVibeOpen(true)} className="bg-amber-500 hover:bg-amber-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Vibe
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VibeCard({ vibe }: { vibe: Vibe }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={vibe.imageUrl}
          alt={vibe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
          <div className="flex space-x-1">
            {vibe.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{vibe.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vibe.description}</p>
        <div className="flex flex-wrap gap-1">
          {vibe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {vibe.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{vibe.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function VibeListItem({ vibe }: { vibe: Vibe }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={vibe.imageUrl}
              alt={vibe.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{vibe.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{vibe.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-1">
                {vibe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-1 ml-auto">
                {vibe.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateBoardForm({ onSubmit }: { onSubmit: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Board Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Minimalist Vibes"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the mood or theme of this board..."
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full">
        Create Board
      </Button>
    </form>
  )
}

function CreateVibeForm({ onSubmit }: { onSubmit: (title: string, description: string, tags: string[], file?: File) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
      onSubmit(title.trim(), description.trim(), tagArray, file || undefined)
      setTitle('')
      setDescription('')
      setTags('')
      setFile(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vibe-title">Title</Label>
        <Input
          id="vibe-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Scandinavian Interior"
          required
        />
      </div>
      <div>
        <Label htmlFor="vibe-description">Description</Label>
        <Textarea
          id="vibe-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what makes this inspiring..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="vibe-tags">Tags</Label>
        <Input
          id="vibe-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="minimalist, cozy, nordic (comma separated)"
        />
      </div>
      <div>
        <Label htmlFor="vibe-image">Image (optional)</Label>
        <Input
          id="vibe-image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit" className="w-full">
        Add Vibe
      </Button>
    </form>
  )
}

export default App