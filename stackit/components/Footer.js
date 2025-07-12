export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-2xl font-bold text-blue-600">StackIt</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600 text-sm">Minimal Q&A Platform</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>© 2025 StackIt. Built with Next.js</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>A collaborative learning platform for asking and answering questions</p>
        </div>
      </div>
    </footer>
  );
}
