
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types & Mock Data ---

type MainCategory = 'board' | 'pro' | 'partner';
type View = 'board_list' | 'board_detail' | 'pro_list' | 'chat' | 'myinfo' | 'profile';

interface Manager {
  id: string;
  name: string;
  experience: string;
  transactions: number;
  isVerified: boolean;
}

interface TeeTime {
  id: string;
  date: string;
  time: string;
  course: string;
  location: string;
  price: number;
  manager: Manager;
  inclusions: string[];
  notes: string;
  isPro: boolean; // Whether it's an escrow-supported "Pro" listing
}

const MOCK_MANAGERS: Manager[] = [
  { id: 'm1', name: '김프로', experience: '활동 3년', transactions: 312, isVerified: true },
  { id: 'm2', name: '이매니저', experience: '활동 1년', transactions: 85, isVerified: false },
  { id: 'm3', name: '박실장', experience: '활동 5년', transactions: 1240, isVerified: true },
];

const MOCK_DATA: TeeTime[] = [
  {
    id: '1',
    date: '8/15(목)',
    time: '07:32',
    course: '파주CC',
    location: '경기북부',
    price: 190000,
    manager: MOCK_MANAGERS[0],
    inclusions: ['카트', '캐디'],
    notes: '조인 1명 구함. 남2 여1 매너 좋으신 분 환영합니다.',
    isPro: true,
  },
  {
    id: '2',
    date: '8/15(목)',
    time: '11:45',
    course: '서서울CC',
    location: '경기북부',
    price: 210000,
    manager: MOCK_MANAGERS[1],
    inclusions: ['카트'],
    notes: '급매물입니다. 노캐디 라운딩 가능.',
    isPro: false,
  },
  {
    id: '3',
    date: '8/16(금)',
    time: '06:10',
    course: '라비에벨CC',
    location: '강원',
    price: 175000,
    manager: MOCK_MANAGERS[2],
    inclusions: ['카트', '캐디'],
    notes: '명문 골프장 티타임 어렵게 구했습니다. 선착순 1팀.',
    isPro: true,
  },
  {
    id: '4',
    date: '8/16(금)',
    time: '13:30',
    course: '해비치CC',
    location: '제주',
    price: 250000,
    manager: MOCK_MANAGERS[0],
    inclusions: ['카트', '캐디'],
    notes: '제주도 원정 라운딩 조인 구합니다. 부부 동반 환영.',
    isPro: false,
  },
];

// --- Components ---

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('board');
  const [currentView, setCurrentView] = useState<View>('board_list');
  const [selectedItem, setSelectedItem] = useState<TeeTime | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [filterLocation, setFilterLocation] = useState<string>('전체');

  const filteredData = useMemo(() => {
    let data = MOCK_DATA;
    if (activeCategory === 'pro') data = data.filter(d => d.isPro);
    if (filterLocation !== '전체') data = data.filter(d => d.location === filterLocation);
    return data;
  }, [activeCategory, filterLocation]);

  const navigateToDetail = (item: TeeTime) => {
    setSelectedItem(item);
    setCurrentView('board_detail');
  };

  const navigateToProfile = (manager: Manager) => {
    setSelectedManager(manager);
    setCurrentView('profile');
  };

  const renderHeader = () => {
    // Detailed Views Header
    if (currentView === 'board_detail' || currentView === 'profile') {
      return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
          <button onClick={() => setCurrentView(activeCategory === 'board' ? 'board_list' : 'pro_list')} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">{currentView === 'profile' ? '매니저 정보' : '티타임 상세'}</h1>
        </header>
      );
    }

    // Main GNB
    return (
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="h-14 flex items-center px-4 border-b border-gray-100">
          <h1 className="text-xl font-black italic tracking-tight text-[#1a73e8]" onClick={() => { setActiveCategory('board'); setCurrentView('board_list'); }}>ANSIM GOLF</h1>
          <div className="ml-auto flex items-center gap-3">
             <button className="text-xs font-bold text-gray-500">로그인</button>
          </div>
        </div>
        <div className="h-12 flex border-b border-gray-100 bg-white">
          <button 
            onClick={() => { setActiveCategory('board'); setCurrentView('board_list'); }}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeCategory === 'board' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            실시간 티타임
          </button>
          <button 
            onClick={() => { setActiveCategory('pro'); setCurrentView('pro_list'); }}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeCategory === 'pro' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            안심 예약 (Pro)
          </button>
          <button 
            onClick={() => { setActiveCategory('partner'); setCurrentView('board_list'); }}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeCategory === 'partner' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            파트너
          </button>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'board_list':
      case 'pro_list':
        return (
          <div className="pt-28 pb-20">
            {/* Filter Bar */}
            <div className="sticky top-[104px] bg-white border-b border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar z-40">
              <select 
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
              >
                <option>전체</option>
                <option>경기북부</option>
                <option>경기남부</option>
                <option>강원</option>
                <option>충청</option>
                <option>제주</option>
              </select>
              <button className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-xs whitespace-nowrap">오늘</button>
              <button className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-xs whitespace-nowrap">내일</button>
              <button className="bg-gray-50 border border-gray-300 rounded px-3 py-1 text-xs whitespace-nowrap">주말</button>
              {activeCategory === 'pro' && (
                <div className="ml-auto flex items-center bg-blue-50 px-2 rounded border border-blue-100">
                  <span className="text-[10px] text-blue-600 font-bold whitespace-nowrap">에스크로 지원</span>
                </div>
              )}
            </div>

            {/* List - High Density "Board" Style */}
            <div className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 active:bg-gray-50 cursor-pointer"
                  onClick={() => navigateToDetail(item)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600">{item.date} {item.time}</span>
                      <span className="text-sm font-bold text-gray-800">{item.course}</span>
                    </div>
                    {item.isPro && activeCategory === 'board' && (
                      <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-1.5 py-0.5 rounded italic">AN-SIM</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      1인 <span className="text-red-500 font-bold">{item.price.toLocaleString()}원</span> | {item.manager.name} ({item.manager.transactions})
                    </div>
                    <button 
                      className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded"
                      onClick={(e) => { e.stopPropagation(); setCurrentView('chat'); }}
                    >
                      문의
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'board_detail':
        if (!selectedItem) return null;
        return (
          <div className="pt-14 pb-20">
            <div className="p-5 border-b border-gray-100 bg-white">
              <div className="text-xs text-gray-400 mb-1">{selectedItem.location}</div>
              <div className="text-3xl font-black text-[#1a73e8] leading-none mb-2">{selectedItem.date} {selectedItem.time}</div>
              <h2 className="text-xl font-bold text-gray-900">{selectedItem.course}</h2>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">라운딩 가격</span>
                <span className="text-lg font-bold text-red-500">1인 {selectedItem.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">포함 내역</span>
                <span className="text-sm font-medium">{selectedItem.inclusions.join(', ')}</span>
              </div>
            </div>

            <div className="px-5 py-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">상세 안내</div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedItem.notes}</p>
              </div>
            </div>

            <div 
              className="mt-4 px-5 py-4 flex items-center border-t border-gray-100 active:bg-gray-50 cursor-pointer"
              onClick={() => navigateToProfile(selectedItem.manager)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-gray-500 font-bold">
                {selectedItem.manager.name[0]}
              </div>
              <div>
                <div className="font-bold text-sm">{selectedItem.manager.name} 매니저</div>
                <div className="text-[10px] text-gray-400">{selectedItem.manager.experience} · 거래 {selectedItem.manager.transactions}건</div>
              </div>
              <svg className="ml-auto w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-2">
              <button className="flex-1 h-12 bg-gray-100 text-gray-700 font-bold rounded-lg">전화</button>
              {selectedItem.isPro ? (
                 <button 
                 className="flex-1 h-12 bg-[#1a73e8] text-white font-bold rounded-lg shadow-lg shadow-blue-100"
                 onClick={() => setCurrentView('chat')}
               >
                 안심 예약 문의
               </button>
              ) : (
                <button 
                className="flex-1 h-12 bg-gray-800 text-white font-bold rounded-lg"
                onClick={() => setCurrentView('chat')}
              >
                문의하기
              </button>
              )}
            </div>
          </div>
        );

      case 'profile':
        if (!selectedManager) return null;
        return (
          <div className="pt-14 pb-20">
            <div className="p-8 text-center bg-white border-b border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400 text-2xl font-bold">
                {selectedManager.name[0]}
              </div>
              <h2 className="text-xl font-bold">{selectedManager.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                 <span className="text-xs text-gray-500">{selectedManager.experience}</span>
                 <span className="text-xs text-blue-600 font-bold">거래 {selectedManager.transactions}건</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">현재 진행 중인 티타임</h3>
              <div className="space-y-2">
                {MOCK_DATA.filter(t => t.manager.id === selectedManager.id).map(item => (
                  <div 
                    key={item.id} 
                    className="p-3 border border-gray-100 rounded-lg flex justify-between items-center"
                    onClick={() => navigateToDetail(item)}
                  >
                    <div>
                      <div className="text-xs font-bold text-blue-600">{item.date} {item.time}</div>
                      <div className="text-sm font-medium">{item.course}</div>
                    </div>
                    <div className="text-sm font-bold text-red-500">{item.price.toLocaleString()}원</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="pt-14 pb-20 flex flex-col h-screen">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <p className="text-[10px] text-blue-600 font-bold mb-1">💡 안심 예약 팁</p>
                <p className="text-[10px] text-blue-500 leading-tight">매니저가 안심결제를 제안하면 에스크로를 통해 안전하게 결제할 수 있습니다.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="bg-gray-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm max-w-[80%]">
                  반갑습니다. 문의하신 시간대 아직 예약 가능합니다.
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <input 
                type="text" 
                placeholder="메시지 입력..." 
                className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none border border-gray-200"
              />
              <button className="text-[#1a73e8] font-bold px-2">전송</button>
            </div>
          </div>
        );

      case 'myinfo':
        return (
          <div className="pt-24 text-center px-10">
             <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-300">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <h2 className="text-lg font-bold">내 정보</h2>
             <p className="text-xs text-gray-400 mt-2">로그인 후 이용 가능한 서비스입니다.</p>
             <button className="mt-6 w-full py-3 bg-[#1a73e8] text-white font-bold rounded-lg">로그인 / 회원가입</button>
          </div>
        );

      default:
        return null;
    }
  };

  const NavItem = ({ view, label, icon }: { view: View, label: string, icon: React.ReactNode }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`flex-1 flex flex-col items-center justify-center gap-1 ${isActive ? 'text-[#1a73e8]' : 'text-gray-400'}`}
      >
        {icon}
        <span className="text-[9px] font-bold">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 select-none max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-gray-50">
      {renderHeader()}
      
      <main className="min-h-screen bg-white">
        {renderContent()}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-gray-100 flex items-center z-50">
        <NavItem 
          view="board_list" 
          label="홈" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
        />
        <NavItem 
          view="chat" 
          label="채팅" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} 
        />
        <NavItem 
          view="myinfo" 
          label="내정보" 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        body { font-family: 'Pretendard', sans-serif; background: #fafafa; margin: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; outline: none; }
        button:active { opacity: 0.7; }
      ` }} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
