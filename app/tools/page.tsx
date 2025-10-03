'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, Download, Trash2, FileImage } from 'lucide-react'

// 动态导入react-pdf组件，禁用SSR
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
)

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
)

type DPI = '72' | '150' | '300'
type ConvertMode = 'all' | 'single'
type ColorMode = 'color' | 'grayscale'

interface ConvertedImage {
  dataUrl: string
  filename: string
  pageNumber: number
}

export default function PDFToJPGPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [dpi, setDpi] = useState<DPI>('150')
  const [convertMode, setConvertMode] = useState<ConvertMode>('all')
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [colorMode, setColorMode] = useState<ColorMode>('color')
  const [totalPages, setTotalPages] = useState<number>(0)
  const [converting, setConverting] = useState(false)
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([])
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 配置 PDF.js worker
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      import('react-pdf').then((pdfjs) => {
        // 使用unpkg CDN，更稳定
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`
      })
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setConvertedImages([])
      setTotalPages(0)
      setPageNumber(1)
    } else {
      alert('请选择PDF文件')
    }
  }

  const convertPageToImage = async (pageNum: number, pdfFileUrl: string): Promise<ConvertedImage | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const scale = parseInt(dpi) / 72

      // 创建一个临时的容器来渲染PDF页面
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      document.body.appendChild(container)

      // 使用 react-pdf 渲染页面
      import('react-dom/client').then((ReactDOM) => {
        import('react-pdf').then((pdf) => {
          const root = ReactDOM.createRoot(container)
          const { Document, Page } = pdf
          
          let renderAttempts = 0
          const maxAttempts = 50 // 最多等待5秒
          
          const checkAndCapture = () => {
            const renderedCanvas = container.querySelector('canvas')
            
            if (renderedCanvas && renderedCanvas.width > 0 && renderedCanvas.height > 0) {
              // 确保canvas已经完全渲染，再等待一小段时间
              setTimeout(() => {
                // 复制canvas内容
                canvas.width = renderedCanvas.width
                canvas.height = renderedCanvas.height
                const context = canvas.getContext('2d')!
                
                // 使用白色背景填充，避免透明背景
                context.fillStyle = 'white'
                context.fillRect(0, 0, canvas.width, canvas.height)
                
                // 绘制PDF内容
                context.drawImage(renderedCanvas, 0, 0)

                // 如果是黑白模式，转换为灰度
                if (colorMode === 'grayscale') {
                  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                  const data = imageData.data
                  for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
                    data[i] = gray
                    data[i + 1] = gray
                    data[i + 2] = gray
                  }
                  context.putImageData(imageData, 0, 0)
                }

                // 转换为JPG
                const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
                
                // 生成时间戳文件名
                const now = new Date()
                const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
                const filename = convertMode === 'all' && totalPages > 1
                  ? `${timestamp}_page_${pageNum}.jpg`
                  : `${timestamp}.jpg`

                resolve({
                  dataUrl,
                  filename,
                  pageNumber: pageNum,
                })

                // 清理
                root.unmount()
                document.body.removeChild(container)
              }, 500) // 增加等待时间，确保完全渲染
            } else if (renderAttempts < maxAttempts) {
              // 继续等待渲染
              renderAttempts++
              setTimeout(checkAndCapture, 100)
            } else {
              // 超时
              console.error('PDF页面渲染超时')
              resolve(null)
              root.unmount()
              document.body.removeChild(container)
            }
          }
          
          const onRenderSuccess = () => {
            // 渲染完成后开始检查
            checkAndCapture()
          }

          root.render(
            <Document file={pdfFileUrl} onLoadSuccess={() => {}}>
              <Page 
                pageNumber={pageNum} 
                scale={scale}
                onRenderSuccess={onRenderSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )
        })
      })
    })
  }

  const handleConvert = async () => {
    if (!pdfFile) {
      alert('请先上传PDF文件')
      return
    }

    if (totalPages === 0) {
      alert('PDF文件还在加载中，请稍候')
      return
    }

    setConverting(true)
    setConvertedImages([])
    setProgress(0)
    setCurrentPage(0)

    try {
      const pdfFileUrl = URL.createObjectURL(pdfFile)

      // 确定要转换的页面范围
      const pagesToConvert = convertMode === 'all' 
        ? Array.from({ length: totalPages }, (_, i) => i + 1)
        : [pageNumber]

      const images: ConvertedImage[] = []
      const totalToConvert = pagesToConvert.length

      for (let i = 0; i < pagesToConvert.length; i++) {
        const pageNum = pagesToConvert[i]
        setCurrentPage(pageNum)
        setProgress(Math.round((i / totalToConvert) * 100))
        
        const image = await convertPageToImage(pageNum, pdfFileUrl)
        if (image) {
          images.push(image)
        }
        // 等待一小段时间，避免浏览器卡顿
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      setProgress(100)
      setConvertedImages(images)
      URL.revokeObjectURL(pdfFileUrl)
    } catch (error) {
      console.error('转换失败:', error)
      alert('转换失败，请重试')
    } finally {
      setConverting(false)
      setProgress(0)
      setCurrentPage(0)
    }
  }

  const handleDownload = (image: ConvertedImage) => {
    const link = document.createElement('a')
    link.href = image.dataUrl
    link.download = image.filename
    link.click()
  }

  const handleDownloadAll = async () => {
    if (convertedImages.length === 0) return

    // 如果只有一张图片，直接下载
    if (convertedImages.length === 1) {
      handleDownload(convertedImages[0])
      return
    }

    // 多张图片时，打包成zip下载
    try {
      const JSZip = (await import('jszip')).default
      
      const zip = new JSZip()
      
      // 将所有图片添加到zip
      for (const image of convertedImages) {
        // 从dataUrl中提取base64数据
        const base64Data = image.dataUrl.split(',')[1]
        zip.file(image.filename, base64Data, { base64: true })
      }
      
      // 生成zip文件
      const content = await zip.generateAsync({ type: 'blob' })
      
      // 生成zip文件名（使用时间戳）
      const now = new Date()
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
      const zipFilename = `pdf_images_${timestamp}.zip`
      
      // 使用浏览器原生方式下载zip文件
      const url = URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = zipFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('打包下载失败:', error)
      alert('打包下载失败，请重试')
    }
  }

  const handleClear = () => {
    setPdfFile(null)
    setConvertedImages([])
    setTotalPages(0)
    setPageNumber(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 等待客户端挂载
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            PDF转JPG工具
          </h1>
          <p className="text-xl text-purple-200">
            快速将PDF文件转换为高质量JPG图片
          </p>
        </div>

        {/* 隐藏的PDF加载器 */}
        <div style={{ position: 'absolute', left: '-9999px' }}>
          {pdfFile && mounted && (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error: Error) => {
                console.error('加载PDF失败:', error)
                alert('加载PDF文件失败')
              }}
            >
              <Page 
                pageNumber={1} 
                scale={0.1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          )}
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 控制面板 */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
            {/* 文件上传 */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                1. 上传PDF文件
              </label>
              <div className="flex gap-4 items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="flex-1 cursor-pointer"
                >
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/60 transition-colors bg-white/5">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-white/70" />
                    <p className="text-white/90">
                      {pdfFile ? pdfFile.name : '点击或拖拽上传PDF文件'}
                    </p>
                    {pdfFile && totalPages === 0 && (
                      <p className="text-yellow-300 mt-2">
                        正在加载PDF...
                      </p>
                    )}
                    {totalPages > 0 && (
                      <p className="text-purple-300 mt-2">
                        共 {totalPages} 页
                      </p>
                    )}
                  </div>
                </label>
                {pdfFile && (
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="bg-red-500/20 border-red-400/50 text-white hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清除
                  </Button>
                )}
              </div>
            </div>

            {/* 分辨率选择 */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                2. 选择图片分辨率
              </label>
              <Select value={dpi} onValueChange={(value: DPI) => setDpi(value)}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="72" className="text-white hover:bg-white/20 focus:bg-white/20">普通 (72 DPI)</SelectItem>
                  <SelectItem value="150" className="text-white hover:bg-white/20 focus:bg-white/20">高清 (150 DPI)</SelectItem>
                  <SelectItem value="300" className="text-white hover:bg-white/20 focus:bg-white/20">超清 (300 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 转换模式 */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                3. 选择转换模式
              </label>
              <Select
                value={convertMode}
                onValueChange={(value: ConvertMode) => setConvertMode(value)}
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/20 focus:bg-white/20">全部转换</SelectItem>
                  <SelectItem value="single" className="text-white hover:bg-white/20 focus:bg-white/20">单页转换</SelectItem>
                </SelectContent>
              </Select>

              {/* 单页选择 - 修复显示逻辑 */}
              {convertMode === 'single' && (
                <div className="mt-4">
                  <label className="block text-white/80 text-sm mb-2">
                    选择页码
                  </label>
                  {totalPages > 0 ? (
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={pageNumber}
                      onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), totalPages))}
                      className="w-full bg-white/10 border border-white/30 rounded-md px-4 py-2 text-white"
                      placeholder={`请输入 1-${totalPages} 之间的页码`}
                    />
                  ) : (
                    <div className="w-full bg-white/5 border border-white/20 rounded-md px-4 py-2 text-white/50">
                      请先上传PDF文件
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 颜色模式 */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                4. 选择颜色模式
              </label>
              <Select
                value={colorMode}
                onValueChange={(value: ColorMode) => setColorMode(value)}
              >
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="color" className="text-white hover:bg-white/20 focus:bg-white/20">彩色</SelectItem>
                  <SelectItem value="grayscale" className="text-white hover:bg-white/20 focus:bg-white/20">黑白</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 转换按钮 */}
            <Button
              onClick={handleConvert}
              disabled={!pdfFile || converting || totalPages === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  转换中...
                </>
              ) : (
                <>
                  <FileImage className="w-5 h-5 mr-2" />
                  开始转换
                </>
              )}
            </Button>

            {/* 进度条 */}
            {converting && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-white text-sm">
                  <span>正在转换第 {currentPage} 页...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 转换结果 */}
          {convertedImages.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  转换结果 ({convertedImages.length} 张图片)
                </h2>
                {convertedImages.length >= 1 && (
                  <Button
                    onClick={handleDownloadAll}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {convertedImages.length > 1 ? '打包下载 (ZIP)' : '下载'}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {convertedImages.map((image, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 border border-white/20"
                  >
                    <div className="relative mb-4 bg-white rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.dataUrl}
                        alt={`Page ${image.pageNumber}`}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-white">
                        <p className="font-semibold">第 {image.pageNumber} 页</p>
                        <p className="text-sm text-white/70">{image.filename}</p>
                      </div>
                      <Button
                        onClick={() => handleDownload(image)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="max-w-4xl mx-auto mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">使用说明</h3>
          <ul className="space-y-2 text-white/80">
            <li>• <strong>普通 (72 DPI)</strong>: 适合网页展示，文件较小</li>
            <li>• <strong>高清 (150 DPI)</strong>: 平衡质量与文件大小，推荐使用</li>
            <li>• <strong>超清 (300 DPI)</strong>: 打印级质量，文件较大</li>
            <li>• 单页转换适合只需要PDF中某一页的情况</li>
            <li>• 黑白模式可以减小文件大小，适合文档类PDF</li>
            <li>• 所有转换都在浏览器本地完成，不会上传到服务器</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
