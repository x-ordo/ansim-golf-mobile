
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
];

const DATES = [
  { date: '08.15', day: '목' },
  { date: '08.16', day: '금' },
  { date: '08.17', day: '토' },
  { date: '08.18', day: '일' },
  { date: '08.19', day: '월' },
];

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold">{currentView === 'profile' ? '매니저 정보' : '상세 정보'}</h1>
        </header>
      );
    }

    return (
      <header className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="h-14 flex items-center px-4 border-b border-gray-100">
          <h1 className="text-xl font-black italic tracking-tight text-[#1a73e8]" onClick={() => setActiveTab('board')}>ANSIM GOLF</h1>
          <