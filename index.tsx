
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types & Mock Data ---

type MainCategory = 'board' | 'pro' | 'partner';
type View = 'list' | 'detail' | 'chat' | 'myinfo' | 'profile';

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
  day: string;
  time: string;
  course: string;
  location: string;
  price: number;
  manager: Manager;
  inclusions: string[];
  notes: string;
  isPro: boolean;
  type: 'join' | 'team';
}

const MOCK_MANAGERS: Manager[] = [
  { id: 'm1', name: '김프로', experience: '활동 3년', transactions: 312, isVerified: true },
  { id: 'm2', name: '이매니저', experience: '활동 1년', transactions: 85, isVerified: false },
  { id: 'm3', name: '박실장', experience: '활동 5년', transactions: 1240, isVerified: true },
];

const MOCK_DATA: TeeTime[] = [
  { id: '1', date: '08.15', day: '목', time: '07:32', course: '파주CC', location: '경기북부', price: 190000, manager: MOCK_MANAGERS[0], inclusions: ['카트', '캐디'], notes: '조인 1명 구함. 남2 여1 매너 좋으신 분 환영합니다.', isPro: true, type: 'join' },
  { id: '2', date: '08.15', day: '목', time: '11:45', course: '서서울CC', location: '경기북부', price: 210000, manager: MOCK_MANAGERS[1], inclusions: ['카트'], notes: '급매물입니다. 노캐디 라운딩 가능.', isPro: false, type: 'team' },
  { id: '3', date: '08.16', day: '금', time: '06:10', course: '라비에벨CC', location: '강원', price: 175000, manager: MOCK_MANAGERS[2], inclusions: ['카트', '캐디'], notes: '명문 골프장 티타임 어렵게 구했습니다. 선착순 1팀.', isPro: true, type: 'team' },
  { id: '4', date: '08.16', day: '금', time: '13:30', course: '해비치CC', location: '제주', price: 250000, manager: MOCK_MANAGERS[0], inclusions: ['카트', '캐디'], notes: '제주도 원정 라운딩 조인 구합니다. 부부 동반 환영.', isPro: false, type: 'join' },
  { id: '5', date: '08.17', day: '토', time: '08:20', course: '스마트KU', location: '경기북부', price: 230000, manager: MOCK_MANAGERS[2], inclusions: ['카트', '캐디'], notes: '주말 황금 시간대입니다. 매너 플레이 필수.', isPro: true, type: 'team' },
  { id: '6', date: '08.17', day: '토', time: '12:00', course: '뉴코리아CC', location: '경기북부', price: 210000, manager: MOCK_MANAGERS[1], inclusions: ['카트'], notes: '급벙개! 2분 모십니다.', isPro: false, type: 'join' },
  { id: '7', date: '08.15', day: '목', time: '14:20', course: '베어크리크', location: '경기북부', price: 220000, manager: MOCK_MANAGERS[0], inclusions: ['카트', '캐디'], notes: '안심예약 가능 상품입니다.', isPro: true, type: 'team' },
];

const DATES = [
  { date: '08.15', day: '목' },
  { date: '08.16', day: '금' },
  { date: '08.17', day: '토' },
  { date: '08.18', day: '일' },
  { date: '08.19', day: '월' },
  { date: '08.20', day: '화' },
  { date: '08.21', day: '수' },
];

const REGIONS = ['전체', '경기북부', '경기남부', '강원', '충청', '제주'];

// --- Components ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainCategory>('board');
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedDate, setSelectedDate] = useState<string>('08.15');
  const [selectedItem, setSelectedItem] = useState<TeeTime | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('전체');

  const filteredData = useMemo(() => {
    let data = MOCK_DATA.filter(d => d.date === selectedDate);
    if (activeTab === 'pro') data = data.filter(d => d.isPro);
    if (filterRegion !== '전체') data = data.filter(d => d.location === filterRegion);
    return data;
  }, [activeTab, selectedDate, filterRegion]);

  const navigateToDetail = (item: TeeTime) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  const renderHeader = () => {
    if (currentView === 'detail' || currentView === 'profile') {
      return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
          <button onClick={() => setCurrentView('list')} className="mr-4">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">{currentView === 'profile' ? '매니저 정보' : '티타임 정보'}</h1>
        </header>
      );
    }

    return (
      <header className="fixed top-0 left-0 right-0 bg-white z-50">
        {/* Top Logo Bar */}
        <div className="h-12 flex items-center px-4 border-b border-gray-100">
          <h1 className="text-xl font-black italic tracking-tight text-[#1a73e8] cursor-pointer" onClick={() => { setActiveTab('board'); setCurrentView('list'); }}>ANSIM GOLF</h1>
          <div className="ml-auto flex gap-4 text-xs font-bold text-gray-500">
            <button>로그인</button>
            <button>무료 시작하기</button>
          </div>
        </div>
        {/* GNB (Board / Pro / Partner) */}
        <div className="h-12 flex border-b border-gray-200 bg-white">
          <button 
            onClick={() => { setActiveTab('board'); setCurrentView('list'); }}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'board' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            실시간 티타임
          </button>
          <button 
            onClick={() => { setActiveTab('pro'); setCurrentView('list'); }}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pro' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            안심 예약 (Pro)
          </button>
          <button 
            onClick={() => setActiveTab('partner')}
            className={`flex-1 text-sm font-bold border-b-2 transition-colors ${activeTab === 'partner' ? 'border-[#1a73e8] text-[#1a73e8]' : 'border-transparent text-gray-400'}`}
          >
            파트너
          </button>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <div className="pt-24 pb-20">
            {/* Date Selection Bar */}
            <div className="bg-white border-b border-gray-100 flex overflow-x-auto no-scrollbar py-2 px-1 gap-1">
              {DATES.map((d) => (
                <button 
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex flex-col items-center min-w-[50px] py-1 rounded-md transition-all ${selectedDate === d.date ? 'bg-[#1a73e8] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="text-[10px] font-bold uppercase">{d.day}</span>
                  <span className="text-xs font-black">{d.date.split('.')[1]}</span>
                </button>
              ))}
            </div>

            {/* Region/Filter Bar */}
            <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
              <div className="flex gap-2">
                <select 
                  value={filterRegion} 
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none font-bold text-gray-700"
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-700">전체</button>
                <button className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-700">조인</button>
              </div>
              <div className="text-[10px] text-gray-400 font-bold">
                총 {filteredData.length}건
              </div>
            </div>

            {/* List - Golfmon Style (High Density) */}
            <div className="divide-y divide-gray-100 bg-white">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 active:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors"
                  onClick={() => navigateToDetail(item)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-black text-[#1a73e8] tabular-nums">{item.time}</span>
                      <span className="text-sm font-black text-gray-800 truncate">{item.course}</span>
                      {item.isPro && (
                        <span className="bg-blue-50 text-[#1a73e8] text-[9px] font-black px-1 py-0.5 rounded border border-blue-100">PRO</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-red-500 font-bold">1인 {item.price.toLocaleString()}원</span>
                      <span className="text-gray-300">|</span>
                      <span>{item.type === 'join' ? '조인가능' : '팀예약'}</span>
                      <span className="text-gray-300">|</span>
                      <span>{item.manager.name}({item.manager.transactions})</span>
                    </div>
                  </div>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-black px-4 py-2 rounded-md transition-colors"
                    onClick={(e) => { e.stopPropagation(); setCurrentView('chat'); }}
                  >
                    문의
                  </button>
                </div>
              )) : (
                <div className="py-20 text-center text-gray-400 font-bold text-sm">
                  등록된 티타임이 없습니다.
                </div>
              )}
            </div>
          </div>
        );

      case 'detail':
        if (!selectedItem) return null;
        return (
          <div className="pt-14 pb-20">
            <div className="p-5 bg-white border-b border-gray-100">
              <div className="text-xs font-bold text-blue-600 mb-1">{selectedItem.location} • {selectedItem.type === 'join' ? '조인 전용' : '팀 전체'}</div>
              <div className="text-3xl font-black text-gray-900 leading-none mb-2">{selectedItem.date}({selectedItem.day}) {selectedItem.time}</div>
              <h2 className="text-xl font-bold text-gray-700">{selectedItem.course}</h2>
            </div>

            <div className="px-5 py-4 bg-white space-y-4">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm font-bold">라운딩 비용</span>
                <span className="text-xl font-black text-red-500">1인 {selectedItem.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-500 text-sm font-bold">포함사항</span>
                <span className="text-sm font-bold text-gray-700">{selectedItem.inclusions.join(', ')}</span>
              </div>
            </div>

            <div className="px-5 py-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">MANAGER'S NOTE</div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{selectedItem.notes}</p>
              </div>
            </div>

            <div 
              className="mt-2 px-5 py-4 flex items-center border-t border-gray-100 bg-white active:bg-gray-50 cursor-pointer"
              onClick={() => { setSelectedManager(selectedItem.manager); setCurrentView('profile'); }}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full mr-4 flex items-center justify-center text-gray-400 text-lg font-bold border border-gray-200">
                {selectedItem.manager.name[0]}
              </div>
              <div>
                <div className="font-black text-sm text-gray-800">{selectedItem.manager.name} 매니저</div>
                <div className="text-xs text-gray-400 font-bold">{selectedItem.manager.experience} • 누적 {selectedItem.manager.transactions}건</div>
              </div>
              <svg className="ml-auto w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-gray-100 flex gap-3">
              <button className="flex-1 h-12 bg-gray-100 text-gray-700 font-black rounded-xl text-sm border border-gray-200">전화 연결</button>
              {selectedItem.isPro ? (
                <button 
                  className="flex-[1.5] h-12 bg-[#1a73e8] text-white font-black rounded-xl text-sm shadow-lg shadow-blue-100"
                  onClick={() => setCurrentView('chat')}
                >
                  에스크로 안심예약
                </button>
              ) : (
                <button 
                  className="flex-[1.5] h-12 bg-gray-800 text-white font-black rounded-xl text-sm"
                  onClick={() => setCurrentView('chat')}
                >
                  실시간 문의하기
                </button>
              )}
            </div>
          </div>
        );

      case 'profile':
        if (!selectedManager) return null;
        return (
          <div className="pt-14 pb-20">
            <div className="p-10 text-center bg-white border-b border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-300 text-3xl font-bold border border-gray-100 shadow-sm">
                {selectedManager.name[0]}
              </div>
              <h2 className="text-2xl font-black text-gray-800">{selectedManager.name}</h2>
              <div className="flex items-center justify-center gap-3 mt-2">
                 <span className="text-xs text-gray-400 font-bold">{selectedManager.experience}</span>
                 <span className="text-xs text-[#1a73e8] font-black">거래 {selectedManager.transactions}건 성공</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 min-h-screen">
              <h3 className="text-xs font-black text-gray-400 mb-4 px-2 tracking-widest uppercase">CURRENT TEE-TIMES</h3>
              <div className="space-y-2">
                {MOCK_DATA.filter(t => t.manager.id === selectedManager.id).map(item => (
                  <div 
                    key={item.id} 
                    className="p-4 bg-white border border-gray-100 rounded-xl flex justify-between items-center shadow-sm active:scale-[0.98] transition-transform"
                    onClick={() => navigateToDetail(item)}
                  >
                    <div>
                      <div className="text-[10px] font-black text-[#1a73e8] mb-0.5">{item.date} {item.time}</div>
                      <div className="text-sm font-bold text-gray-800">{item.course}</div>
                    </div>
                    <div className="text-sm font-black text-red-500">{item.price.toLocaleString()}원</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="pt-14 pb-16 flex flex-col h-screen bg-gray-50">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm mb-4">
                <p className="text-[11px] text-blue-600 font-black mb-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  안심 예약 안내
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed font-bold">
                  본 채팅은 사고 예방을 위해 자동 기록됩니다. 매니저가 안심결제를 제안하면 에스크로를 통해 안전하게 거래하실 수 있습니다.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm font-medium">
                  반갑습니다. {selectedItem?.course} 티타임 예약 문의 주셨나요?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#1a73e8] text-white p-3 rounded-2xl rounded-br-none text-sm shadow-md font-medium max-w-[80%]">
                  네, 안심예약으로 진행하고 싶습니다. 어떻게 하면 되나요?
                </div>
              </div>
              {selectedItem?.isPro && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm font-medium border-l-4 border-blue-400">
                    안심결제(Pro) 전환이 가능합니다. 매니저가 결제 요청을 보내면 알림이 울립니다.
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <button className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
              <input 
                type="text" 
                placeholder="메시지 입력..." 
                className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm focus:outline-none border border-gray-100 font-medium"
              />
              <button className="text-[#1a73e8] font-black px-2">전송</button>
            </div>
          </div>
        );

      case 'myinfo':
        return (
          <div className="pt-24 text-center px-10 bg-white min-h-screen">
             <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-6 flex items-center justify-center text-gray-300 border border-gray-100">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <h2 className="text-xl font-black text-gray-800">내 정보</h2>
             <p className="text-xs text-gray-400 mt-2 font-bold leading-relaxed">
               라운딩 내역 및 채팅 기록을 확인하려면<br/>로그인이 필요합니다.
             </p>
             <button className="mt-10 w-full py-4 bg-[#1a73e8] text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-[0.98] transition-transform">로그인 / 회원가입</button>
             <div className="mt-8 grid grid-cols-2 gap-3">
               <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
                 <div className="text-[10px] font-black text-gray-400 mb-1">나의 예약</div>
                 <div className="text-sm font-black">0건</div>
               </div>
               <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
                 <div className="text-[10px] font-black text-gray-400 mb-1">관심 매니저</div>
                 <div className="text-sm font-black">0명</div>
               </div>
             </div>
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
        onClick={() => { setCurrentView(view); if (view === 'list') setActiveTab('board'); }}
        className={`flex-1 flex flex-col items-center justify-center gap-1 h-full ${isActive ? 'text-[#1a73e8]' : 'text-gray-400'}`}
      >
        <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 select-none max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-gray-100">
      {renderHeader()}
      
      <main className="min-h-screen bg-white">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-gray-100 flex items-center z-50">
        <NavItem 
          view="list" 
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
        body { font-family: 'Pretendard', -apple-system, sans-serif; background: #fafafa; margin: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; outline: none; box-sizing: border-box; }
        button:active { opacity: 0.7; }
        .tabular-nums { font-variant-numeric: tabular-nums; }
      ` }} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
