
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, History, Bookmark, Menu, X, Play, Info, 
  ChevronRight, ChevronLeft, Star, Facebook, Twitter, 
  Send as SendIcon, Globe, ShieldCheck, Mail, ChevronDown, ArrowUp
} from 'lucide-react';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Watch from './pages/Watch';
import SearchResults from './pages/SearchResults';
import Library from './pages/Library';
import { searchMovies, getImageUrl } from './services/api';
import { Movie } from './types';
import Toast from './components/Toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [instantResults, setInstantResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Instant Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const data = await searchMovies(searchQuery, 1);
          setInstantResults(data.data.items.slice(0, 5));
          setIsSearching(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setInstantResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearching(false);
    }
  };

  const genres = [
    { name: 'Hành Động', slug: 'hanh-dong' },
    { name: 'Cổ Trang', slug: 'co-trang' },
    { name: 'Tình Cảm', slug: 'tinh-cam' },
    { name: 'Viễn Tưởng', slug: 'vien-tuong' },
    { name: 'Kinh Dị', slug: 'kinh-di' },
    { name: 'Hài Hước', slug: 'hai-huoc' },
    { name: 'Hoạt Hình', slug: 'hoat-hinh' },
    { name: 'Tài Liệu', slug: 'tai-lieu' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="bg-red-600 p-2 rounded-xl transform group-hover:rotate-12 transition-all shadow-lg shadow-red-600/30">
              <Play className="w-6 h-6 fill-current text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-white">
                BÌNH<span className="text-red-600">VIETSUB</span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Cinema Online</span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider">
            <Link to="/" className="hover:text-red-500 transition-colors">Trang chủ</Link>
            <Link to="/tim-kiem?type=phim-bo" className="hover:text-red-500 transition-colors">Phim bộ</Link>
            <Link to="/tim-kiem?type=phim-le" className="hover:text-red-500 transition-colors">Phim lẻ</Link>
            
            <div className="relative group" onMouseEnter={() => setShowGenreMenu(true)} onMouseLeave={() => setShowGenreMenu(false)}>
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                Thể loại <ChevronDown className="w-4 h-4" />
              </button>
              {showGenreMenu && (
                <div className="absolute top-full left-0 pt-4 w-72">
                  <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    {genres.map(g => (
                      <Link 
                        key={g.slug} 
                        to={`/tim-kiem?category=${g.slug}`} 
                        className="p-3 hover:bg-red-600/10 hover:text-red-500 rounded-xl text-xs transition-all flex items-center justify-between group/item"
                        onClick={() => setShowGenreMenu(false)}
                      >
                        {g.name}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Instant Search Form */}
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Tìm phim, diễn viên..."
                className="bg-white/5 border border-white/10 rounded-full py-2.5 px-5 pl-11 w-48 focus:w-96 transition-all focus:bg-white/10 focus:border-red-600/50 outline-none text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </form>

            {/* Instant Search Results Dropdown */}
            {isSearching && instantResults.length > 0 && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-2">
                    {instantResults.map(movie => (
                      <Link 
                        key={movie._id} 
                        to={`/phim/${movie.slug}`} 
                        onClick={() => setIsSearching(false)}
                        className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                      >
                        <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-white/5">
                          <img src={getImageUrl(movie.thumb_url)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <h4 className="text-sm font-bold truncate group-hover:text-red-500 transition-colors">{movie.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{movie.origin_name} • {movie.year}</p>
                        </div>
                      </Link>
                    ))}
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full mt-2 py-3 bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                       Xem tất cả kết quả
                    </button>
                 </div>
              </div>
            )}
          </div>

          <Link to="/thu-vien" className="p-2.5 hover:bg-white/10 rounded-full transition-colors relative group">
            <Bookmark className="w-5 h-5" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">Yêu thích</span>
          </Link>

          <button className="lg:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0F0F0F] z-[60] p-8 flex flex-col gap-10 overflow-y-auto">
          <div className="flex justify-between items-center">
             <Link to="/" className="text-2xl font-black text-white" onClick={() => setMobileMenuOpen(false)}>
              BÌNH<span className="text-red-600">VIETSUB</span>
             </Link>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X className="w-8 h-8" /></button>
          </div>
          <div className="flex flex-col gap-8 text-3xl font-black uppercase tracking-tighter">
             <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-600 transition-colors">Trang chủ</Link>
             <Link to="/tim-kiem?type=phim-bo" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-600 transition-colors">Phim bộ</Link>
             <Link to="/tim-kiem?type=phim-le" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-600 transition-colors">Phim lẻ</Link>
             <Link to="/thu-vien" onClick={() => setMobileMenuOpen(false)} className="hover:text-red-600 transition-colors">Thư viện</Link>
          </div>
          <div className="mt-auto border-t border-white/10 pt-8 grid grid-cols-2 gap-4">
             {genres.map(g => (
               <Link key={g.slug} to={`/tim-kiem?category=${g.slug}`} onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-gray-500">{g.name}</Link>
             ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#0A0A0A] border-t border-white/5 py-16 mt-20 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
    <div className="max-w-[1440px] mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Play className="w-5 h-5 fill-current text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              BÌNH<span className="text-red-600">VIETSUB</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            Phim chất lượng cao, cập nhật liên tục mỗi giờ. Kho phim Vietsub lớn nhất Việt Nam, xem mượt mà trên mọi thiết bị.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all hover:-translate-y-1"><SendIcon className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Danh mục</h4>
          <ul className="text-sm text-gray-500 space-y-4 font-bold">
            <li><Link to="/tim-kiem?type=phim-bo" className="hover:text-red-500 transition-colors">Phim bộ dài tập</Link></li>
            <li><Link to="/tim-kiem?type=phim-le" className="hover:text-red-500 transition-colors">Phim lẻ đặc sắc</Link></li>
            <li><Link to="/tim-kiem?type=hoat-hinh" className="hover:text-red-500 transition-colors">Hoạt hình - Anime</Link></li>
            <li><Link to="/tim-kiem?type=tv-shows" className="hover:text-red-500 transition-colors">TV Shows mới nhất</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-8 text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Hỗ trợ khách hàng</h4>
          <ul className="text-sm text-gray-500 space-y-4 font-bold">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-red-500" /> <a href="#" className="hover:text-white">Chính sách bảo mật</a></li>
            <li className="flex items-center gap-2"><Info className="w-4 h-4 text-red-500" /> <a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-red-500" /> <a href="#" className="hover:text-white">Hợp tác kinh doanh</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold mb-8 text-white uppercase text-[10px] tracking-[0.3em] opacity-50">Trung tâm thông báo</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">Nhận thông báo qua Email khi có tập mới của bộ phim bạn yêu thích.</p>
          <div className="flex gap-2">
            <input type="text" placeholder="Email của bạn..." className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs flex-grow focus:border-red-600 outline-none transition-all" />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-red-600/20">GỬI</button>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-700">
        <p>&copy; 2024 BÌNH VIETSUB CINEMA • POWERED BY KKPHIM</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Bản quyền</a>
          <a href="#" className="hover:text-white transition-colors">Liên hệ</a>
        </div>
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkScroll = () => setShowScroll(window.scrollY > 500);
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [pathname]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return showScroll ? (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-8 left-8 z-40 bg-red-600 text-white p-4 rounded-2xl shadow-2xl hover:-translate-y-2 transition-all active:scale-95 animate-in slide-in-from-bottom-10"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  ) : null;
};

// Global Toast Management
export const ToastContext = React.createContext({
  showToast: (message: string, type?: 'success' | 'error') => {}
});

const App: React.FC = () => {
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <HashRouter>
        <ScrollToTop />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="min-h-screen flex flex-col selection:bg-red-600 selection:text-white">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phim/:slug" element={<MovieDetails />} />
              <Route path="/xem-phim/:slug/:episodeSlug" element={<Watch />} />
              <Route path="/tim-kiem" element={<SearchResults />} />
              <Route path="/thu-vien" element={<Library />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ToastContext.Provider>
  );
};

export default App;
