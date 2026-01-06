
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types & Mock Data ---

type View = 'home' | 'join' | 'register' | 'chat' | 'myinfo' | 'detail' | 'profile';

interface Manager {
  id: string;
  name: string;
  experience: string;
  transactions: number;
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
}

const MOCK_MANAGERS: Manager[] = [
  { id: 'm1', name: '김프로', experience: '활동 3년', transactions: 312 },
  { id: 'm2', name: '이매니저', experience: '활동 1년', transactions: 85 },
  { id: 'm3', name: '박실장', experience: '활동 5년', transactions: 1240 },
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
  },
  {
    id: '5',
    date: '8/17(토)',
    time: '08:20',
    course: '스마트KU',
    location: '경기북부',
    price: 230000,
    manager: MOCK_MANAGERS[2],
    inclusions: ['카트', '캐디'],
    notes: '주말 황금 시간대입니다. 매너 플레이 필수.',
  },
];

// --- Components ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedItem, setSelectedItem] = useState<TeeTime | null>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [filterLocation, setFilterLocation] = useState<string>('전체');

  const filteredData = useMemo(() => {
    if (filterLocation === '전체') return MOCK_DATA;
    return MOCK_DATA.filter((item) => item.location === filterLocation);
  }, [filterLocation]);

  const navigateToDetail = (item: TeeTime) => {
    setSelectedItem(item);
    setCurrentView('detail');
  };

  const navigateToProfile = (manager: Manager) => {
    setSelectedManager(manager);
    setCurrentView('profile');
  };

  const renderHeader = () => {
    if (currentView === 'detail') {
      return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
          <button onClick={() => setCurrentView('home')} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">티타임 상세</h1>
        </header>
      );
    }
    if (currentView === 'profile') {
      return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
          <button onClick={() => setCurrentView('home')} className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">매니저 정보</h1>
        </header>
      );
    }
    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#1a73e8] text-white flex items-center px-4 z-50 shadow-sm">
        <h1 className="text-xl font-black italic tracking-tight">ANSIM GOLF</h1>
        <div className="ml-auto flex gap-4">
          <button className="text-sm font-bold">알림</button>
          <button className="text-sm font-bold">검색</button>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="pt-14 pb-20">
            {/* Filter Bar */}
            <div className="sticky top-14 bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar z-40">
              <select 
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
                className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
              >
                <option>전체</option>
                <option>경기북부</option>
                <option>경기남부</option>
                <option>강원</option>
                <option>충청</option>
                <option>제주</option>
              </select>
              <button className="bg-white border border-gray-300 rounded px-3 py-1 text-sm whitespace-nowrap">오늘</button>
              <button className="bg-white border border-gray-300 rounded px-3 py-1 text-sm whitespace-nowrap">내일</button>
              <button className="bg-white border border-gray-300 rounded px-3 py-1 text-sm whitespace-nowrap">주말</button>
              <button className="bg-white border border-gray-300 rounded px-3 py-1 text-sm whitespace-nowrap">필터+</button>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 active:bg-gray-50"
                  onClick={() => navigateToDetail(item)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-blue-600">{item.date} {item.time}</span>
                    <span className="text-xs text-gray-400">등록 10분전</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{item.course}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-red-500 font-bold">1인 {item.price.toLocaleString()}원</span>
                      <div className="text-xs text-gray-500 mt-1">
                        매니저: {item.manager.name} · 거래 {item.manager.transactions}건
                      </div>
                    </div>
                    <button 
                      className="bg-[#1a73e8] text-white text-xs font-bold px-3 py-1.5 rounded"
                      onClick={(e) => { e.stopPropagation(); setCurrentView('chat'); }}
                    >
                      예약문의
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'detail':
        if (!selectedItem) return null;
        return (
          <div className="pt-14 pb-20 px-4">
            <div className="py-6 border-b border-gray-100 text-center">
              <div className="text-3xl font-black text-[#1a73e8] mb-1">{selectedItem.date} {selectedItem.time}</div>
              <div className="text-xl font-bold text-gray-800">{selectedItem.course}</div>
            </div>

            <div className="py-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">가격</span>
                <span className="text-xl font-bold text-red-500">1인 {selectedItem.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">포함내역</span>
                <span className="font-medium">{selectedItem.inclusions.join(' / ')}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg my-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">특이사항</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedItem.notes}</p>
            </div>

            <div 
              className="py-4 flex items-center border-t border-gray-100 active:bg-gray-50 cursor-pointer"
              onClick={() => navigateToProfile(selectedItem.manager)}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center text-gray-500 font-bold">
                {selectedItem.manager.name[0]}
              </div>
              <div>
                <div className="font-bold">{selectedItem.manager.name} 매니저</div>
                <div className="text-xs text-gray-500">{selectedItem.manager.experience} | 거래 {selectedItem.manager.transactions}건</div>
              </div>
              <svg className="ml-auto w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>

            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3">
              <button className="flex-1 h-12 bg-gray-100 text-gray-700 font-bold rounded">전화하기</button>
              <button 
                className="flex-1 h-12 bg-[#1a73e8] text-white font-bold rounded"
                onClick={() => setCurrentView('chat')}
              >
                문의하기
              </button>
            </div>
          </div>
        );

      case 'profile':
        if (!selectedManager) return null;
        return (
          <div className="pt-14 pb-20 px-4">
            <div className="py-8 text-center border-b border-gray-100">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-500 text-2xl font-bold">
                {selectedManager.name[0]}
              </div>
              <h2 className="text-xl font-bold">{selectedManager.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedManager.experience} · 누적 거래 {selectedManager.transactions}건</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold mb-3">등록한 티타임</h3>
              <div className="divide-y divide-gray-100 border-t border-gray-100">
                {MOCK_DATA.filter(t => t.manager.id === selectedManager.id).map(item => (
                   <div key={item.id} className="py-3 flex justify-between items-center" onClick={() => navigateToDetail(item)}>
                      <div>
                        <div className="text-sm font-bold">{item.date} {item.time}</div>
                        <div className="text-xs text-gray-500">{item.course}</div>
                      </div>
                      <div className="text-sm text-red-500 font-bold">{item.price.toLocaleString()}원</div>
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
              <div className="flex justify-center">
                <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">상대방과 대화가 시작되었습니다.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="bg-gray-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm max-w-[80%]">
                  안녕하세요. 파주CC 8/15 티타임 문의 주셨나요?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#1a73e8] text-white p-3 rounded-tl-xl rounded-bl-xl rounded-br-xl text-sm max-w-[80%]">
                  네, 예약 가능한가요? 성인 3명입니다.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="bg-gray-100 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl text-sm max-w-[80%]">
                  현재 한 분 더 조인이 필요합니다. 기다려주시겠어요?
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
              <input 
                type="text" 
                placeholder="메시지를 입력하세요" 
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button className="text-[#1a73e8] font-bold px-2">전송</button>
            </div>
          </div>
        );

      case 'join':
      case 'register':
      case 'myinfo':
        return (
          <div className="pt-24 text-center px-6">
            <div className="text-gray-300 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">준비 중인 기능입니다</h2>
            <p className="text-sm text-gray-500 mt-2">MVP 버전에서는 홈(티타임 리스트) 및 상세 정보, 채팅 기능만 제공됩니다.</p>
            <button 
              onClick={() => setCurrentView('home')}
              className="mt-6 text-[#1a73e8] font-bold underline"
            >
              홈으로 돌아가기
            </button>
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
        <span className="text-[10px] font-bold">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 select-none max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      {renderHeader()}
      
      <main className="min-h-screen">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white border-t border-gray-200 flex items-center z-50">
        <NavItem 
          view="home" 
          label="홈" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
        />
        <NavItem 
          view="join" 
          label="조인" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
        />
        <NavItem 
          view="register" 
          label="등록" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />
        <NavItem 
          view="chat" 
          label="채팅" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} 
        />
        <NavItem 
          view="myinfo" 
          label="내정보" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
        />
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        body { font-family: 'Pretendard', sans-serif; background: #f4f4f4; margin: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; }
      ` }} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
